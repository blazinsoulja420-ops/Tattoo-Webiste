import { describe, expect, it } from "vitest";
import {
  SupabaseObjectStorageAdapter,
  loadSupabaseDevelopmentConfig,
  type SupabaseStorageGateway,
} from "../../../packages/infrastructure/src/index";

class MemoryStorageGateway implements SupabaseStorageGateway {
  readonly uploads: Array<{ bucket: string; key: string }> = [];

  async upload(bucket: string, objectKey: string) {
    this.uploads.push({ bucket, key: objectKey });
  }

  async createSignedUrl(bucket: string, objectKey: string) {
    return `https://signed.invalid/${bucket}/${objectKey}`;
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

describe("Supabase storage adapter", () => {
  it("maps restricted evidence only to the restricted bucket", async () => {
    const gateway = new MemoryStorageGateway();
    const adapter = new SupabaseObjectStorageAdapter(
      gateway,
      config,
      async () => null,
    );

    await adapter.put(
      {
        objectKey: "cases/case-1/original.png",
        securityClass: "RESTRICTED_EVIDENCE",
        contentHash: "hash",
      },
      new Uint8Array([1, 2, 3]),
    );

    expect(gateway.uploads).toEqual([
      { bucket: "restricted-dev", key: "cases/case-1/original.png" },
    ]);
    expect(adapter.authority).toBe("CAPABILITY_ONLY");
  });
});
