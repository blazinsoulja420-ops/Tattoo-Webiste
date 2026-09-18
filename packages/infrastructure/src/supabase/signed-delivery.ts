import {
  assertDeliveryRequest,
  assertStorageClassification,
  type AssetSecurityClass,
  type AuthorizedDeliveryRequest,
  type DeliveryArtifact,
} from "@tattoo/domain";
import type { SupabaseDevelopmentConfig } from "./config";
import type { SupabaseStorageGateway } from "./types";

export interface SupabaseStoredAssetLocation {
  objectKey: string;
  securityClass: AssetSecurityClass;
}

export type SupabaseAssetLocator = (
  assetId: string,
) => Promise<SupabaseStoredAssetLocation | null>;

function bucketFor(
  config: SupabaseDevelopmentConfig,
  securityClass: AssetSecurityClass,
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

function maxTtlSeconds(securityClass: AssetSecurityClass): number {
  if (securityClass === "RESTRICTED_EVIDENCE") return 900;
  if (securityClass === "PRIVATE_DESIGN") return 3600;
  return 86400;
}

export async function createSupabaseSignedDelivery(
  storage: SupabaseStorageGateway,
  config: SupabaseDevelopmentConfig,
  locate: SupabaseAssetLocator,
  request: AuthorizedDeliveryRequest,
  now: Date,
): Promise<DeliveryArtifact> {
  assertDeliveryRequest(request, now);

  const location = await locate(request.assetId);
  if (!location) {
    throw new Error("asset location not found");
  }

  assertStorageClassification(location.securityClass, request.securityClass);

  const ttl = Math.floor(
    (new Date(request.expiresAt).getTime() - now.getTime()) / 1000,
  );
  if (ttl <= 0 || ttl > maxTtlSeconds(request.securityClass)) {
    throw new Error("signed delivery TTL exceeds security-class limit");
  }

  const value = await storage.createSignedUrl(
    bucketFor(config, request.securityClass),
    location.objectKey,
    ttl,
  );

  return { value, expiresAt: request.expiresAt };
}
