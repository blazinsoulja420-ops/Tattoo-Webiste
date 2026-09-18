import { describe, expect, it } from "vitest";
import {
  SupabaseCanonicalSnapshotRepository,
  SupabaseDesignRevisionRepository,
  SupabaseProvenanceRepository,
  type SupabaseDataGateway,
  type SupabaseRow,
} from "../../../packages/infrastructure/src/index";

class MemoryDataGateway implements SupabaseDataGateway {
  readonly rows = new Map<string, SupabaseRow[]>();

  async getOne(table: string, filters: Readonly<Record<string, string>>) {
    return (this.rows.get(table) ?? []).find((row) =>
      Object.entries(filters).every(([key, value]) => row[key] === value),
    ) ?? null;
  }

  async list(table: string, filters: Readonly<Record<string, string>>) {
    return (this.rows.get(table) ?? []).filter((row) =>
      Object.entries(filters).every(([key, value]) => row[key] === value),
    );
  }

  async insert(table: string, row: Readonly<Record<string, unknown>>) {
    this.rows.set(table, [...(this.rows.get(table) ?? []), row]);
  }
}

const specification = {
  designId: "TAT-DEV-001",
  revisionId: "REV-001",
  subject: "rose",
  secondaryElements: [],
  style: "black-grey-realism" as const,
  placement: "forearm" as const,
  dimensions: { widthMm: 80, heightMm: 140 },
  colorMode: "black-grey" as const,
  detail: "high" as const,
  shading: "medium" as const,
  negativeSpace: "medium" as const,
  purpose: "new-tattoo" as const,
};

describe("Supabase persistence adapters", () => {
  it("preserves append-only revision semantics", async () => {
    const gateway = new MemoryDataGateway();
    const repo = new SupabaseDesignRevisionRepository(gateway);
    const first = {
      designId: "TAT-DEV-001",
      revisionId: "REV-001",
      parentRevisionId: null,
      specification,
      specificationDigest: "digest-1",
      createdAt: "2026-09-18T16:00:00Z",
    };

    await repo.append(first);
    await expect(repo.append(first)).rejects.toThrow("append-only");
  });

  it("prevents replacing a locked canonical snapshot", async () => {
    const gateway = new MemoryDataGateway();
    const repo = new SupabaseCanonicalSnapshotRepository(gateway);
    const snapshot = {
      designId: "TAT-DEV-001",
      revisionId: "REV-001",
      locked: true as const,
      specificationDigest: "digest-1",
      geometryFingerprint: "geo-1",
      compositionFingerprint: "comp-1",
      createdAt: "2026-09-18T16:00:00Z",
    };

    await repo.insert(snapshot);
    await expect(repo.insert(snapshot)).rejects.toThrow("cannot be replaced");
  });

  it("preserves append-only provenance", async () => {
    const gateway = new MemoryDataGateway();
    const repo = new SupabaseProvenanceRepository(gateway);
    const record = {
      provenanceRecordId: "PROV-001",
      designId: "TAT-DEV-001",
      revisionId: "REV-001",
      operation: "FTA_RENDER" as const,
      providerAdapterId: "synthetic-provider",
      sourceAssetIds: ["SOURCE-001"],
      outputAssetId: "FTA-001",
      createdAt: "2026-09-18T16:00:00Z",
    };

    await repo.append(record);
    await expect(repo.append(record)).rejects.toThrow("append-only");
  });
});
