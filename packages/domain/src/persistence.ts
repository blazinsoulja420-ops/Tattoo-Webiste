import type { AssetRecord } from "./assets";
import type { AuditEvent } from "./audit";
import type { ProvenanceRecord } from "./provenance";
import type {
  CanonicalDesignSnapshot,
  DesignRegistryRecord,
  DesignRevisionRecord,
} from "./registry";
import type { RetentionRequest } from "./retention";

export interface DesignRegistryRepository {
  get(designId: string): Promise<DesignRegistryRecord | null>;
  insert(record: DesignRegistryRecord): Promise<void>;
}

export interface DesignRevisionRepository {
  list(designId: string): Promise<readonly DesignRevisionRecord[]>;
  append(record: DesignRevisionRecord): Promise<void>;
}

export interface CanonicalSnapshotRepository {
  get(designId: string, revisionId: string): Promise<CanonicalDesignSnapshot | null>;
  insert(snapshot: CanonicalDesignSnapshot): Promise<void>;
}

export interface AssetMetadataRepository {
  get(assetId: string): Promise<AssetRecord | null>;
  insert(asset: AssetRecord): Promise<void>;
}

export interface ProvenanceRepository {
  listForDesign(designId: string): Promise<readonly ProvenanceRecord[]>;
  append(record: ProvenanceRecord): Promise<void>;
}

export interface AuditEventRepository {
  append(event: AuditEvent): Promise<void>;
}

export interface RetentionRequestRepository {
  get(requestId: string): Promise<RetentionRequest | null>;
  append(request: RetentionRequest): Promise<void>;
}

export function assertProvenanceAppend(
  existing: readonly ProvenanceRecord[],
  next: ProvenanceRecord,
): void {
  if (
    existing.some(
      (record) => record.provenanceRecordId === next.provenanceRecordId,
    )
  ) {
    throw new Error("provenanceRecordId already exists; provenance is append-only");
  }
}
