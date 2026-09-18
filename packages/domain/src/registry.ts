import type { DesignId, RevisionId, TattooSpecification } from "./design";

export interface DesignRegistryRecord {
  designId: DesignId;
  createdAt: string;
}

export interface DesignRevisionRecord {
  designId: DesignId;
  revisionId: RevisionId;
  parentRevisionId: RevisionId | null;
  specification: TattooSpecification;
  specificationDigest: string;
  createdAt: string;
}

export interface CanonicalDesignSnapshot {
  designId: DesignId;
  revisionId: RevisionId;
  locked: true;
  specificationDigest: string;
  geometryFingerprint: string;
  compositionFingerprint: string;
  createdAt: string;
}

export function assertRevisionAppend(
  existing: readonly DesignRevisionRecord[],
  next: DesignRevisionRecord,
): void {
  if (existing.some((record) => record.revisionId === next.revisionId)) {
    throw new Error("revisionId already exists; revisions are append-only");
  }

  const sameDesign = existing.filter((record) => record.designId === next.designId);
  if (sameDesign.length === 0) {
    if (next.parentRevisionId !== null) {
      throw new Error("first revision cannot reference a missing parent");
    }
    return;
  }

  if (!next.parentRevisionId) {
    throw new Error("subsequent revision requires parentRevisionId");
  }

  if (!sameDesign.some((record) => record.revisionId === next.parentRevisionId)) {
    throw new Error("parent revision must exist for the same Design ID");
  }
}

export function assertCanonicalSnapshotInsert(
  existing: readonly CanonicalDesignSnapshot[],
  next: CanonicalDesignSnapshot,
): void {
  if (
    existing.some(
      (snapshot) =>
        snapshot.designId === next.designId &&
        snapshot.revisionId === next.revisionId,
    )
  ) {
    throw new Error("locked canonical snapshot cannot be replaced in place");
  }
}
