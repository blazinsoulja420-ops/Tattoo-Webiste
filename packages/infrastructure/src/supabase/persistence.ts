import {
  assertCanonicalSnapshotInsert,
  assertProvenanceAppend,
  assertRevisionAppend,
  type AssetMetadataRepository,
  type AssetRecord,
  type CanonicalDesignSnapshot,
  type CanonicalSnapshotRepository,
  type DesignRegistryRecord,
  type DesignRegistryRepository,
  type DesignRevisionRecord,
  type DesignRevisionRepository,
  type ProvenanceRecord,
  type ProvenanceRepository,
} from "@tattoo/domain";
import type { SupabaseDataGateway, SupabaseRow } from "./types";

function asRecord<T>(row: SupabaseRow | null): T | null {
  return row as T | null;
}

function asRecords<T>(rows: readonly SupabaseRow[]): readonly T[] {
  return rows as readonly T[];
}

export class SupabaseDesignRegistryRepository implements DesignRegistryRepository {
  constructor(private readonly data: SupabaseDataGateway) {}

  async get(designId: string): Promise<DesignRegistryRecord | null> {
    return asRecord<DesignRegistryRecord>(
      await this.data.getOne("design_registry", { design_id: designId }),
    );
  }

  async insert(record: DesignRegistryRecord): Promise<void> {
    if (await this.get(record.designId)) {
      throw new Error("Design ID already exists");
    }
    await this.data.insert("design_registry", record as unknown as Record<string, unknown>);
  }
}

export class SupabaseDesignRevisionRepository implements DesignRevisionRepository {
  constructor(private readonly data: SupabaseDataGateway) {}

  async list(designId: string): Promise<readonly DesignRevisionRecord[]> {
    return asRecords<DesignRevisionRecord>(
      await this.data.list("design_revisions", { design_id: designId }, "createdAt"),
    );
  }

  async append(record: DesignRevisionRecord): Promise<void> {
    const existing = await this.list(record.designId);
    assertRevisionAppend(existing, record);
    await this.data.insert("design_revisions", record as unknown as Record<string, unknown>);
  }
}

export class SupabaseCanonicalSnapshotRepository implements CanonicalSnapshotRepository {
  constructor(private readonly data: SupabaseDataGateway) {}

  async get(designId: string, revisionId: string): Promise<CanonicalDesignSnapshot | null> {
    return asRecord<CanonicalDesignSnapshot>(
      await this.data.getOne("canonical_snapshots", {
        design_id: designId,
        revision_id: revisionId,
      }),
    );
  }

  async insert(snapshot: CanonicalDesignSnapshot): Promise<void> {
    const existing = await this.get(snapshot.designId, snapshot.revisionId);
    assertCanonicalSnapshotInsert(existing ? [existing] : [], snapshot);
    await this.data.insert("canonical_snapshots", snapshot as unknown as Record<string, unknown>);
  }
}

export class SupabaseAssetMetadataRepository implements AssetMetadataRepository {
  constructor(private readonly data: SupabaseDataGateway) {}

  async get(assetId: string): Promise<AssetRecord | null> {
    return asRecord<AssetRecord>(
      await this.data.getOne("assets", { asset_id: assetId }),
    );
  }

  async insert(asset: AssetRecord): Promise<void> {
    if (await this.get(asset.assetId)) {
      throw new Error("asset metadata already exists");
    }
    await this.data.insert("assets", asset as unknown as Record<string, unknown>);
  }
}

export class SupabaseProvenanceRepository implements ProvenanceRepository {
  constructor(private readonly data: SupabaseDataGateway) {}

  async listForDesign(designId: string): Promise<readonly ProvenanceRecord[]> {
    return asRecords<ProvenanceRecord>(
      await this.data.list("provenance", { design_id: designId }, "createdAt"),
    );
  }

  async append(record: ProvenanceRecord): Promise<void> {
    const existing = await this.listForDesign(record.designId);
    assertProvenanceAppend(existing, record);
    await this.data.insert("provenance", record as unknown as Record<string, unknown>);
  }
}
