import type { AssetId, AssetSecurityClass } from "./assets";

export type DeliveryPurpose =
  | "CUSTOMER_DOWNLOAD"
  | "ARTIST_PRODUCTION"
  | "INTERNAL_REVIEW";

export interface StorageObjectRef {
  objectKey: string;
  securityClass: AssetSecurityClass;
  contentHash: string;
}

export interface AuthorizedDeliveryRequest {
  assetId: AssetId;
  securityClass: AssetSecurityClass;
  requestingPrincipalId: string;
  purpose: DeliveryPurpose;
  expiresAt: string;
  auditCorrelationId: string;
}

export interface DeliveryArtifact {
  value: string;
  expiresAt: string;
}

export interface ObjectStorageAdapter {
  readonly adapterId: string;
  readonly authority: "CAPABILITY_ONLY";

  put(
    object: StorageObjectRef,
    bytes: Uint8Array,
  ): Promise<void>;

  createDeliveryArtifact(
    request: AuthorizedDeliveryRequest,
  ): Promise<DeliveryArtifact>;
}

export function assertStorageClassification(
  current: AssetSecurityClass,
  requested: AssetSecurityClass,
): void {
  if (current !== requested) {
    throw new Error("storage adapter may not change asset security classification");
  }
}

export function assertDeliveryRequest(
  request: AuthorizedDeliveryRequest,
  now: Date,
): void {
  if (!request.requestingPrincipalId.trim()) {
    throw new Error("signed delivery requires requesting principal");
  }
  if (!request.purpose) {
    throw new Error("signed delivery requires explicit purpose");
  }
  if (!request.auditCorrelationId.trim()) {
    throw new Error("signed delivery requires audit correlation");
  }

  const expiresAt = new Date(request.expiresAt);
  if (Number.isNaN(expiresAt.getTime()) || expiresAt.getTime() <= now.getTime()) {
    throw new Error("signed delivery request must expire in the future");
  }
}

export function assertStorageAdapterBoundary(adapter: ObjectStorageAdapter): void {
  if (adapter.authority !== "CAPABILITY_ONLY") {
    throw new Error("storage adapter cannot grant application authority");
  }
}
