import type { AssetSecurityClass } from "./assets";
import type { AuthorizedDeliveryRequest, DeliveryPurpose } from "./storage";
import type { Permission } from "./permissions";
import { principalHasPermission } from "./permissions";
import type { Principal } from "./principals";
import { assertPrincipal } from "./principals";
import type { ResourceAccessContext } from "./resource-access";
import { hasRequiredRelationship } from "./resource-access";

export type AuthorizationDecisionValue = "ALLOW" | "DENY";

export interface AuthorizationDecision {
  decision: AuthorizationDecisionValue;
  principalId: string;
  permission: Permission;
  resourceType: string;
  resourceId: string;
  securityClass?: AssetSecurityClass | undefined;
  auditCorrelationId: string;
  reason: string;
  decidedAt: string;
}

export interface AuthorizationRequest {
  principal: Principal | null;
  permission: Permission;
  resource: ResourceAccessContext | null;
  auditCorrelationId: string;
  decidedAt: string;
}

export function authorize(request: AuthorizationRequest): AuthorizationDecision {
  const principal = request.principal;
  const resource = request.resource;

  const deny = (reason: string): AuthorizationDecision => ({
    decision: "DENY",
    principalId: principal?.principalId ?? "UNKNOWN",
    permission: request.permission,
    resourceType: resource?.resourceType ?? "UNKNOWN",
    resourceId: resource?.resourceId ?? "UNKNOWN",
    securityClass: resource?.securityClass,
    auditCorrelationId: request.auditCorrelationId,
    reason,
    decidedAt: request.decidedAt,
  });

  if (!request.auditCorrelationId.trim()) {
    return deny("missing audit correlation");
  }
  if (!principal || !resource) {
    return deny("missing principal or resource context");
  }

  try {
    assertPrincipal(principal);
  } catch {
    return deny("principal is not eligible for authorization");
  }

  if (!principalHasPermission(principal.roles, request.permission)) {
    return deny("principal lacks required permission");
  }

  const qualifyingRole = principal.roles.find((role) =>
    hasRequiredRelationship(role, resource),
  );
  if (!qualifyingRole) {
    return deny("principal lacks required resource relationship");
  }

  if (
    resource.securityClass === "RESTRICTED_EVIDENCE" &&
    request.permission !== "RESTRICTED_EVIDENCE_READ"
  ) {
    return deny("restricted evidence requires explicit restricted-evidence permission");
  }

  if (principal.roles.includes("SYSTEM_AI_SERVICE") && resource.securityClass === "RESTRICTED_EVIDENCE") {
    return deny("service identity cannot access restricted evidence by role alone");
  }

  return {
    decision: "ALLOW",
    principalId: principal.principalId,
    permission: request.permission,
    resourceType: resource.resourceType,
    resourceId: resource.resourceId,
    securityClass: resource.securityClass,
    auditCorrelationId: request.auditCorrelationId,
    reason: `authorized via ${qualifyingRole}`,
    decidedAt: request.decidedAt,
  };
}

export function createAuthorizedDeliveryRequest(
  decision: AuthorizationDecision,
  principalId: string,
  assetId: string,
  securityClass: AssetSecurityClass,
  purpose: DeliveryPurpose,
  expiresAt: string,
): AuthorizedDeliveryRequest {
  if (decision.decision !== "ALLOW") {
    throw new Error("signed delivery requires ALLOW authorization decision");
  }
  if (decision.permission !== "SIGNED_DELIVERY_REQUEST") {
    throw new Error("authorization decision is not for signed delivery");
  }
  if (decision.principalId !== principalId || decision.resourceId !== assetId) {
    throw new Error("authorization decision does not match delivery request");
  }
  if (decision.securityClass !== securityClass) {
    throw new Error("authorization security class does not match delivery request");
  }

  return {
    assetId,
    securityClass,
    requestingPrincipalId: principalId,
    purpose,
    expiresAt,
    auditCorrelationId: decision.auditCorrelationId,
  };
}
