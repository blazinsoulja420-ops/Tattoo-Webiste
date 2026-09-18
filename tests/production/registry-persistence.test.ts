import { describe, expect, it } from "vitest";
import {
  assertCanonicalSnapshotInsert,
  assertProvenanceAppend,
  assertRevisionAppend,
  type CanonicalDesignSnapshot,
  type DesignRevisionRecord,
  type ProvenanceRecord,
} from "../../packages/domain/src/index";

const specification = {
  designId: "TAT-100001",
  revisionId: "REV-001",
  subject: "rose",
  secondaryElements: ["leaves"],
  style: "black-grey-realism" as const,
  placement: "forearm" as const,
  dimensions: { widthMm: 90, heightMm: 160 },
  colorMode: "black-grey" as const,
  detail: "high" as const,
  shading: "medium" as const,
  negativeSpace: "medium" as const,
  purpose: "new-tattoo" as const,
};

function revision(
  revisionId: string,
  parentRevisionId: string | null,
): DesignRevisionRecord {
  return {
    designId: "TAT-100001",
    revisionId,
    parentRevisionId,
    specification: { ...specification, revisionId },
    specificationDigest: `digest-${revisionId}`,
    createdAt: "2026-09-18T00:00:00Z",
  };
}

describe("registry persistence contracts", () => {
  it("requires revisions to be appended rather than overwritten", () => {
    const first = revision("REV-001", null);
    expect(() => assertRevisionAppend([], first)).not.toThrow();

    const second = revision("REV-002", "REV-001");
    expect(() => assertRevisionAppend([first], second)).not.toThrow();

    expect(() => assertRevisionAppend([first], first)).toThrow(
      "revisions are append-only",
    );
  });

  it("requires a parent for later revisions", () => {
    const first = revision("REV-001", null);
    expect(() =>
      assertRevisionAppend([first], revision("REV-002", null)),
    ).toThrow("subsequent revision requires parentRevisionId");
  });

  it("prevents locked canonical snapshot replacement", () => {
    const snapshot: CanonicalDesignSnapshot = {
      designId: "TAT-100001",
      revisionId: "REV-001",
      locked: true,
      specificationDigest: "digest",
      geometryFingerprint: "geo",
      compositionFingerprint: "comp",
      createdAt: "2026-09-18T00:00:00Z",
    };

    expect(() => assertCanonicalSnapshotInsert([], snapshot)).not.toThrow();
    expect(() => assertCanonicalSnapshotInsert([snapshot], snapshot)).toThrow(
      "locked canonical snapshot cannot be replaced in place",
    );
  });

  it("keeps provenance persistence append-only", () => {
    const record: ProvenanceRecord = {
      provenanceRecordId: "PROV-001",
      designId: "TAT-100001",
      revisionId: "REV-001",
      operation: "FTA_RENDER",
      providerAdapterId: "test-adapter",
      sourceAssetIds: ["ASSET-SOURCE"],
      outputAssetId: "ASSET-FTA",
      createdAt: "2026-09-18T00:00:00Z",
    };

    expect(() => assertProvenanceAppend([], record)).not.toThrow();
    expect(() => assertProvenanceAppend([record], record)).toThrow(
      "provenance is append-only",
    );
  });
});
