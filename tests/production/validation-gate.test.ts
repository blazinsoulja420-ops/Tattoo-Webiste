import { describe, expect, it } from "vitest";
import {
  canEnterArtistReview,
  validateProductionCandidate,
  type AssetRecord,
  type ProductionSet,
} from "../../packages/domain/src/index";

const base = {
  designId: "TAT-000003",
  revisionId: "REV-001",
  canonicalGeometryFingerprint: "geo-789",
  assetHash: "output-hash",
  widthPx: 3000,
  heightPx: 5000,
  privateAsset: true as const,
};

function productionSet(): ProductionSet {
  return {
    designId: base.designId,
    revisionId: base.revisionId,
    canonicalGeometryFingerprint: base.canonicalGeometryFingerprint,
    fta: { ...base, kind: "FTA" },
    acr: {
      ...base,
      kind: "ACR",
      handDrawnPresentationRequired: true,
      allowedVisualModes: ["pencil", "graphite", "ink", "professional-sketch"],
    },
    trs: {
      ...base,
      kind: "TRS",
      physicalWidthMm: 120,
      physicalHeightMm: 200,
      mirrored: false,
      tiled: false,
      lineHierarchy: ["primary", "structural", "secondary", "shading-landmark"],
    },
  };
}

function assets(): AssetRecord[] {
  return (["FTA", "ACR", "TRS"] as const).map((kind) => ({
    assetId: `ASSET-${kind}`,
    designId: base.designId,
    revisionId: base.revisionId,
    kind,
    securityClass: "PRIVATE_DESIGN",
    contentHash: `hash-${kind}`,
    mimeType: "image/png",
    byteLength: 5000,
    createdAt: "2026-09-18T00:00:00Z",
    provenanceRecordId: `PROV-${kind}`,
    canonicalGeometryFingerprint: base.canonicalGeometryFingerprint,
  }));
}

describe("production validation gate", () => {
  it("allows artist review only after independent validation passes", () => {
    const result = validateProductionCandidate(
      "validator-independent",
      productionSet(),
      assets(),
      "2026-09-18T00:02:00Z",
    );

    expect(result.passed).toBe(true);
    expect(canEnterArtistReview(result)).toBe(true);
  });

  it("blocks artist review on geometry drift", () => {
    const candidateAssets = assets();
    candidateAssets[2] = {
      ...candidateAssets[2]!,
      canonicalGeometryFingerprint: "drifted",
    };

    const result = validateProductionCandidate(
      "validator-independent",
      productionSet(),
      candidateAssets,
      "2026-09-18T00:02:00Z",
    );

    expect(result.passed).toBe(false);
    expect(result.findings.some((finding) => finding.code === "ASSET_GEOMETRY_DRIFT")).toBe(true);
    expect(canEnterArtistReview(result)).toBe(false);
  });

  it("preserves the mandatory hand-drawn ACR contract", () => {
    const set = productionSet();
    expect(set.acr.handDrawnPresentationRequired).toBe(true);
    expect(set.acr.allowedVisualModes).toEqual([
      "pencil",
      "graphite",
      "ink",
      "professional-sketch",
    ]);
  });
});
