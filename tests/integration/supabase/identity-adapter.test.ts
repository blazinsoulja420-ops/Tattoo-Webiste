import { describe, expect, it } from "vitest";
import { mapSupabaseIdentityToPrincipal } from "../../../packages/infrastructure/src/index";

describe("Supabase identity adapter", () => {
  it("uses trusted application role assignments rather than provider metadata roles", () => {
    const principal = mapSupabaseIdentityToPrincipal(
      {
        id: "USER-001",
        authenticated: true,
        provider: "supabase",
        appMetadata: { role: "ADMIN" },
      },
      {
        principalId: "USER-001",
        roles: ["CUSTOMER"],
      },
    );

    expect(principal.roles).toEqual(["CUSTOMER"]);
    expect(principal.authenticationContext?.provider).toBe("supabase");
  });

  it("fails when trusted assignment does not match authenticated identity", () => {
    expect(() =>
      mapSupabaseIdentityToPrincipal(
        { id: "USER-001", authenticated: true },
        { principalId: "USER-002", roles: ["CUSTOMER"] },
      ),
    ).toThrow("does not match");
  });
});
