import type { DesignId, RevisionId } from "./design";
import type { ProductionOutputKind } from "./production";

export type AssetId = string;
export type AssetSecurityClass =
  | "PUBLIC"
  | "PRIVATE_DESIGN"
  | "RESTRICTED_EVIDENCE";

export type AssetKind =
  | ProductionOutputKind
  | "PROTECTED_PREVIEW"
  | "COVERUP_ORIGINAL"
  | "COVERUP_DERIVATIVE"
  | "OTHER";

export interface AssetRecord {
  assetId: AssetId;
  designId: DesignId;
  revisionId: RevisionId;
  kind: AssetKind;
  securityClass: AssetSecurityClass;
  contentHash: string;
  mimeType: string;
  byteLength: number;
  createdAt: string;
  provenanceRecordId: string;
  canonicalGeometryFingerprint?: string;
  widthPx?: number;
  heightPx?: number;
  physicalWidthMm?: number;
  physicalHeightMm?: number;
  immutableOriginal?: boolean;
}

export function assertAssetClassification(asset: AssetRecord): void {
  if (
    (asset.kind === "FTA" || asset.kind === "ACR" || asset.kind === "TRS") &&
    asset.securityClass !== "PRIVATE_DESIGN"
  ) {
    throw new Error(`${asset.kind} must be PRIVATE_DESIGN`);
  }

  if (asset.kind === "COVERUP_ORIGINAL") {
    if (asset.securityClass !== "RESTRICTED_EVIDENCE") {
      throw new Error("cover-up original must remain RESTRICTED_EVIDENCE");
    }
    if (asset.immutableOriginal !== true) {
      throw new Error("cover-up original must remain immutable");
    }
  }
}
