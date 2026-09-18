import type { AssetSecurityClass } from "./assets";
import type { PrincipalRole } from "./principals";

export const resourceRelationships = [
  "OWNER",
  "LICENSEE",
  "ASSIGNED_ARTIST",
  "SHOP_PROJECT_MEMBER",
  "EXPLICIT_SHARE",
  "ADMINISTRATIVE_SCOPE",
  "SYSTEM_JOB_SCOPE",
] as const;

export type ResourceRelationship = (typeof resourceRelationships)[number];

export interface ResourceAccessContext {
  resourceType: string;
  resourceId: string;
  securityClass?: AssetSecurityClass;
  relationships: readonly ResourceRelationship[];
  publicationApproved?: boolean;
}

export function hasRequiredRelationship(
  role: PrincipalRole,
  context: ResourceAccessContext,
): boolean {
  if (context.securityClass === "PUBLIC") {
    return context.publicationApproved === true;
  }

  switch (role) {
    case "CUSTOMER":
      return context.relationships.some((r) => r === "OWNER" || r === "LICENSEE");
    case "ARTIST":
      return context.relationships.some((r) => r === "ASSIGNED_ARTIST" || r === "EXPLICIT_SHARE");
    case "SHOP":
      return context.relationships.includes("SHOP_PROJECT_MEMBER");
    case "ADMIN":
      return context.relationships.includes("ADMINISTRATIVE_SCOPE");
    case "SYSTEM_AI_SERVICE":
      return context.relationships.includes("SYSTEM_JOB_SCOPE");
  }
}
