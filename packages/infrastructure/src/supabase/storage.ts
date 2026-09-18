import type {
  ObjectStorageAdapter,
  StorageObjectRef,
  AuthorizedDeliveryRequest,
  DeliveryArtifact,
} from "@tattoo/domain";
import type { SupabaseDevelopmentConfig } from "./config";
import {
  createSupabaseSignedDelivery,
  type SupabaseAssetLocator,
} from "./signed-delivery";
import type { SupabaseStorageGateway } from "./types";

function bucketFor(
  config: SupabaseDevelopmentConfig,
  securityClass: StorageObjectRef["securityClass"],
): string {
  switch (securityClass) {
    case "PUBLIC":
      return config.buckets.public;
    case "PRIVATE_DESIGN":
      return config.buckets.privateDesign;
    case "RESTRICTED_EVIDENCE":
      return config.buckets.restrictedEvidence;
  }
}

export class SupabaseObjectStorageAdapter implements ObjectStorageAdapter {
  readonly adapterId = "supabase-development-storage";
  readonly authority = "CAPABILITY_ONLY" as const;

  constructor(
    private readonly storage: SupabaseStorageGateway,
    private readonly config: SupabaseDevelopmentConfig,
    private readonly locate: SupabaseAssetLocator,
    private readonly now: () => Date = () => new Date(),
  ) {}

  async put(object: StorageObjectRef, bytes: Uint8Array): Promise<void> {
    await this.storage.upload(
      bucketFor(this.config, object.securityClass),
      object.objectKey,
      bytes,
      { upsert: false },
    );
  }

  async createDeliveryArtifact(
    request: AuthorizedDeliveryRequest,
  ): Promise<DeliveryArtifact> {
    return createSupabaseSignedDelivery(
      this.storage,
      this.config,
      this.locate,
      request,
      this.now(),
    );
  }
}
