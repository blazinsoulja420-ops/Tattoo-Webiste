export const principalRoles = [
  "CUSTOMER",
  "ARTIST",
  "SHOP",
  "ADMIN",
  "SYSTEM_AI_SERVICE",
] as const;

export type PrincipalRole = (typeof principalRoles)[number];

export interface Principal {
  principalId: string;
  roles: readonly PrincipalRole[];
  authenticated: boolean;
  authenticationContext?: Readonly<Record<string, string | boolean>>;
}

export function assertPrincipal(principal: Principal): void {
  if (!principal.principalId.trim()) {
    throw new Error("principalId is required");
  }
  if (!principal.authenticated) {
    throw new Error("principal must be authenticated before authorization");
  }
  if (principal.roles.length === 0) {
    throw new Error("principal requires at least one role");
  }
}
