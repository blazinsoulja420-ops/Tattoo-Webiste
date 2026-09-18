import type { PrincipalRole } from "./principals";

export const permissions = [
  "DESIGN_READ",
  "DESIGN_EDIT",
  "PRODUCTION_ASSET_READ",
  "RESTRICTED_EVIDENCE_READ",
  "ARTIST_REVIEW_WRITE",
  "LICENSE_READ",
  "SIGNED_DELIVERY_REQUEST",
  "SHOP_PROJECT_READ",
  "ADMIN_AUDIT_READ",
  "SYSTEM_JOB_EXECUTE",
] as const;

export type Permission = (typeof permissions)[number];

const rolePermissions: Readonly<Record<PrincipalRole, readonly Permission[]>> = {
  CUSTOMER: ["DESIGN_READ", "DESIGN_EDIT", "PRODUCTION_ASSET_READ", "LICENSE_READ", "SIGNED_DELIVERY_REQUEST"],
  ARTIST: ["DESIGN_READ", "PRODUCTION_ASSET_READ", "RESTRICTED_EVIDENCE_READ", "ARTIST_REVIEW_WRITE", "SIGNED_DELIVERY_REQUEST"],
  SHOP: ["DESIGN_READ", "PRODUCTION_ASSET_READ", "SHOP_PROJECT_READ", "SIGNED_DELIVERY_REQUEST"],
  ADMIN: ["DESIGN_READ", "PRODUCTION_ASSET_READ", "RESTRICTED_EVIDENCE_READ", "ADMIN_AUDIT_READ", "SIGNED_DELIVERY_REQUEST"],
  SYSTEM_AI_SERVICE: ["SYSTEM_JOB_EXECUTE"],
};

export function roleHasPermission(
  role: PrincipalRole,
  permission: Permission,
): boolean {
  return rolePermissions[role].includes(permission);
}

export function principalHasPermission(
  roles: readonly PrincipalRole[],
  permission: Permission,
): boolean {
  return roles.some((role) => roleHasPermission(role, permission));
}
