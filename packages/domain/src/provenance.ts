import type { AssetId } from "./assets";
import type { DesignId, RevisionId } from "./design";

export type ProvenanceRecordId = string;

export type ProvenanceOperation =
  | "CONCEPT_GENERATION"
  | "CONTROLLED_EDIT"
  | "FTA_RENDER"
  | "ACR_RENDER"
  | "TRS_RENDER"
  | "VALIDATION"
  | "PROTECTED_PREVIEW";

export interface ProvenanceRecord {
  provenanceRecordId: ProvenanceRecordId;
  designId: DesignId;
  revisionId: RevisionId;
  operation: ProvenanceOperation;
  providerAdapterId: string;
  providerModelId?: string;
  sourceAssetIds: readonly AssetId[];
  parentRevisionId?: RevisionId;
  promptDigest?: string;
  parameterDigest?: string;
  outputAssetId: AssetId;
  supersedesProvenanceRecordId?: ProvenanceRecordId;
  createdAt: string;
}

export function assertDerivativeLineage(record: ProvenanceRecord): void {
  const derivativeOperations: readonly ProvenanceOperation[] = [
    "CONTROLLED_EDIT",
    "FTA_RENDER",
    "ACR_RENDER",
    "TRS_RENDER",
    "PROTECTED_PREVIEW",
  ];

  if (
    derivativeOperations.includes(record.operation) &&
    record.sourceAssetIds.length === 0 &&
    !record.parentRevisionId
  ) {
    throw new Error("derivative provenance requires a source asset or parent revision");
  }

  if (
    record.supersedesProvenanceRecordId &&
    record.supersedesProvenanceRecordId === record.provenanceRecordId
  ) {
    throw new Error("provenance record cannot supersede itself");
  }
}
