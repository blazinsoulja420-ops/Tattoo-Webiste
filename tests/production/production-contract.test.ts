import { describe, expect, it } from "vitest";
import { validateProductionSet, type ProductionSet } from "../../packages/domain/src/production";

const base = {
  designId: "TAT-000001",
  revisionId: "REV-001",
  canonicalGeometryFingerprint: "geo-123",
  assetHash: "hash",
  widthPx: 3000,
  heightPx: 6000,
  privateAsset: true as const,
};

function validSet(): ProductionSet {
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
      physicalWidthMm: 100,
      physicalHeightMm: 200,
      mirrored: false,
      tiled: false,
      lineHierarchy: ["primary", "structural", "secondary", "shading-landmark"],
    },
  };
}

describe("FTA / ACR / TRS production contract", () => {
  it("accepts synchronized derivatives from one canonical geometry", () => {
    expect(validateProductionSet(validSet())).toEqual([]);
  });

  it("fails closed on geometry drift", () => {
    const set = validSet();
    set.trs.canonicalGeometryFingerprint = "different-geometry";
    expect(validateProductionSet(set)).toContain("TRS: canonical geometry drift");
  });
});
