import { describe, expect, it } from "vitest";
import {
  createSupabaseSignedDelivery,
  loadSupabaseDevelopmentConfig,
  type SupabaseStorageGateway,
} from "../../../packages/infrastructure/src/index";

class SignedUrlGateway implements SupabaseStorageGateway {
  async upload() {}

  async createSignedUrl(bucket: string, objectKey: string, expiresInSeconds: number) {
    return `https://signed.invalid/${bucket}/${objectKey}?ttl=${expiresInSeconds}`;
  }
}

const config = loadSupabaseDevelopmentConfig(
  {
    TATTOO_ENVIRONMENT: "test",
    SUPABASE_URL: "https://example.supabase.co",
    SUPABASE_PUBLISHABLE_KEY: "publishable-test",
    SUPABASE_BUCKET_PUBLIC: "public-dev",
    SUPABASE_BUCKET_PRIVATE: "private-dev",
    SUPABASE_BUCKET_RESTRICTED: "restricted-dev",
  },
  "server",
);

describe("Supabase signed delivery adapter", () => {
  it("creates a short-lived restricted-evidence delivery artifact", async () => {
    const artifact = await createSupabaseSignedDelivery(
      new SignedUrlGateway(),
      config,
      async () => ({
        objectKey: "cases/1/original.png",
        securityClass: "RESTRICTED_EVIDENCE",
      }),
      {
        assetId: "ASSET-001",
        securityClass: "RESTRICTED_EVIDENCE",
        requestingPrincipalId: "USER-001",
        purpose: "INTERNAL_REVIEW",
        expiresAt: "2026-09-18T16:10:00Z",
        auditCorrelationId: "CORR-001",
      },
      new Date("2026-09-18T16:00:00Z"),
    );

    expect(artifact.value).toContain("restricted-dev");
  });

  it("rejects excessive restricted-evidence TTL", async () => {
    await expect(
      createSupabaseSignedDelivery(
        new SignedUrlGateway(),
        config,
        async () => ({
          objectKey: "cases/1/original.png",
          securityClass: "RESTRICTED_EVIDENCE",
        }),
        {
          assetId: "ASSET-001",
          securityClass: "RESTRICTED_EVIDENCE",
          requestingPrincipalId: "USER-001",
          purpose: "INTERNAL_REVIEW",
          expiresAt: "2026-09-18T17:00:00Z",
          auditCorrelationId: "CORR-002",
        },
        new Date("2026-09-18T16:00:00Z"),
      ),
    ).rejects.toThrow("TTL exceeds");
  });
});
