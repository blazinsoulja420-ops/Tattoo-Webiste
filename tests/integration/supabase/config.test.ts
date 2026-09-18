import { describe, expect, it } from "vitest";
import { loadSupabaseDevelopmentConfig } from "../../../packages/infrastructure/src/index";

const env = {
  TATTOO_ENVIRONMENT: "development",
  SUPABASE_URL: "https://example.supabase.co",
  SUPABASE_PUBLISHABLE_KEY: "publishable-test",
  SUPABASE_BUCKET_PUBLIC: "public-dev",
  SUPABASE_BUCKET_PRIVATE: "private-dev",
  SUPABASE_BUCKET_RESTRICTED: "restricted-dev",
};

describe("Supabase development configuration", () => {
  it("loads a development-only public configuration", () => {
    const config = loadSupabaseDevelopmentConfig(env, "client");
    expect(config.environment).toBe("development");
    expect(config.buckets.restrictedEvidence).toBe("restricted-dev");
  });

  it("fails closed when required configuration is missing", () => {
    expect(() =>
      loadSupabaseDevelopmentConfig(
        { ...env, SUPABASE_URL: "" },
        "client",
      ),
    ).toThrow("missing required development configuration");
  });

  it("rejects privileged credentials in client runtime", () => {
    expect(() =>
      loadSupabaseDevelopmentConfig(
        { ...env, SUPABASE_SERVER_SECRET_KEY: "server-secret" },
        "client",
      ),
    ).toThrow("cannot be exposed to client runtime");
  });

  it("rejects non-development environments", () => {
    expect(() =>
      loadSupabaseDevelopmentConfig(
        { ...env, TATTOO_ENVIRONMENT: "production" },
        "server",
      ),
    ).toThrow("development/test only");
  });
});
