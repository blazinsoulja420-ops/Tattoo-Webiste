import type { AssetRecord } from "./assets";
import { assertAssetClassification } from "./assets";
import type { ProductionSet } from "./production";
import { validateProductionSet } from "./production";

export type ValidationSeverity = "INFO" | "WARNING" | "ERROR";

export interface ValidationFinding {
  code: string;
  severity: ValidationSeverity;
  message: string;
}

export interface ProductionValidationResult {
  validatorId: string;
  designId: string;
  revisionId: string;
  passed: boolean;
  findings: readonly ValidationFinding[];
  validatedAt: string;
}

export function validateProductionCandidate(
  validatorId: string,
  set: ProductionSet,
  assets: readonly AssetRecord[],
  validatedAt: string,
): ProductionValidationResult {
  const findings: ValidationFinding[] = [];

  for (const error of validateProductionSet(set)) {
    findings.push({
      code: "PRODUCTION_SET_INVALID",
      severity: "ERROR",
      message: error,
    });
  }

  const requiredKinds = ["FTA", "ACR", "TRS"] as const;
  for (const kind of requiredKinds) {
    const asset = assets.find(
      (candidate) =>
        candidate.kind === kind &&
        candidate.designId === set.designId &&
        candidate.revisionId === set.revisionId,
    );

    if (!asset) {
      findings.push({
        code: "MISSING_PRODUCTION_ASSET",
        severity: "ERROR",
        message: `missing ${kind} asset`,
      });
      continue;
    }

    try {
      assertAssetClassification(asset);
    } catch (error) {
      findings.push({
        code: "ASSET_CLASSIFICATION_INVALID",
        severity: "ERROR",
        message: error instanceof Error ? error.message : String(error),
      });
    }

    if (asset.canonicalGeometryFingerprint !== set.canonicalGeometryFingerprint) {
      findings.push({
        code: "ASSET_GEOMETRY_DRIFT",
        severity: "ERROR",
        message: `${kind} asset geometry fingerprint mismatch`,
      });
    }
  }

  if (!set.acr.handDrawnPresentationRequired) {
    findings.push({
      code: "ACR_HAND_DRAWN_REQUIRED",
      severity: "ERROR",
      message: "ACR must retain the hand-drawn presentation requirement",
    });
  }

  if (set.trs.physicalWidthMm <= 0 || set.trs.physicalHeightMm <= 0) {
    findings.push({
      code: "TRS_DIMENSIONS_INVALID",
      severity: "ERROR",
      message: "TRS requires positive physical dimensions",
    });
  }

  return {
    validatorId,
    designId: set.designId,
    revisionId: set.revisionId,
    passed: !findings.some((finding) => finding.severity === "ERROR"),
    findings,
    validatedAt,
  };
}

export function canEnterArtistReview(
  result: ProductionValidationResult,
): boolean {
  return result.passed && !result.findings.some((finding) => finding.severity === "ERROR");
}
