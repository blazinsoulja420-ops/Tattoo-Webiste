import type { Principal } from "@tattoo/domain";
import type { SupabaseAuthIdentity, TrustedRoleAssignment } from "./types";

export function mapSupabaseIdentityToPrincipal(
  identity: SupabaseAuthIdentity,
  assignment: TrustedRoleAssignment,
): Principal {
  if (!identity.authenticated || !identity.id.trim()) {
    throw new Error("Supabase identity is not authenticated");
  }
  if (identity.id !== assignment.principalId) {
    throw new Error("trusted role assignment does not match authenticated identity");
  }
  if (assignment.roles.length === 0) {
    throw new Error("trusted role assignment requires at least one role");
  }

  return {
    principalId: identity.id,
    authenticated: true,
    roles: assignment.roles,
    authenticationContext: {
      provider: identity.provider ?? "supabase",
      emailVerified: identity.emailVerified ?? false,
      phoneVerified: identity.phoneVerified ?? false,
    },
  };
}
