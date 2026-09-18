import type { Permission } from "./permissions";
import type { Principal } from "./principals";

export interface ServiceIdentity extends Principal {
  roles: readonly ["SYSTEM_AI_SERVICE"];
  grantedMachinePermissions: readonly Permission[];
  authority: "CAPABILITY_ONLY";
}

export function assertServiceIdentity(identity: ServiceIdentity): void {
  if (identity.roles.length !== 1 || identity.roles[0] !== "SYSTEM_AI_SERVICE") {
    throw new Error("service identity cannot hold human roles");
  }
  if (identity.authority !== "CAPABILITY_ONLY") {
    throw new Error("service identity cannot hold workflow authority");
  }
  const forbidden: readonly Permission[] = [
    "RESTRICTED_EVIDENCE_READ",
    "ADMIN_AUDIT_READ",
    "ARTIST_REVIEW_WRITE",
  ];
  if (identity.grantedMachinePermissions.some((p) => forbidden.includes(p))) {
    throw new Error("service identity contains forbidden human/admin permission");
  }
}

export function canServiceGrantRoles(): false {
  return false;
}
