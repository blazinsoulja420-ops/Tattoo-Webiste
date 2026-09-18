import { describe, expect, it } from "vitest";
import {
  assertAssetClassification,
  assertDerivativeLineage,
  type AssetRecord,
  type ProvenanceRecord,
} from "../../packages/domain/src/index";

const original: AssetRecord = {
  assetId: "ASSET-ORIGINAL",
  designId: "TAT-000002",
  revisionId: "REV-001",
  kind: "COVERUP_ORIGINAL",
  securityClass: "RESTRICTED_EVIDENCE",
  contentHash: "hash-original",
  mimeType: "image/png",
  byteLength: 1000,
  createdAt: "2026-09-18T00:00:00Z",
  provenanceRecordId: "PROV-ORIGINAL",
  immutableOriginal: true,
};

describe("asset and provenance contracts", () => {
  it("keeps cover-up original evidence restricted and immutable", () => {
    expect(() => assertAssetClassification(original)).not.toThrow();

    expect(() =>
      assertAssetClassification({ ...original, securityClass: "PUBLIC" }),
    ).toThrow("cover-up original must remain RESTRICTED_EVIDENCE");

    expect(() =>
      assertAssetClassification({ ...original, immutableOriginal: false }),
    ).toThrow("cover-up original must remain immutable");
  });

  it("requires derivative lineage", () => {
    const derivative: ProvenanceRecord = {
      provenanceRecordId: "PROV-FTA",
      designId: "TAT-000002",
      revisionId: "REV-002",
      operation: "FTA_RENDER",
      providerAdapterId: "adapter-test",
      sourceAssetIds: ["ASSET-ORIGINAL"],
      parentRevisionId: "REV-001",
      outputAssetId: "ASSET-FTA",
      createdAt: "2026-09-18T00:01:00Z",
    };

    expect(() => assertDerivativeLineage(derivative)).not.toThrow();

    expect(() =>
      assertDerivativeLineage({
        ...derivative,
        sourceAssetIds: [],
        parentRevisionId: undefined,
      }),
    ).toThrow("derivative provenance requires a source asset or parent revision");
  });
});
