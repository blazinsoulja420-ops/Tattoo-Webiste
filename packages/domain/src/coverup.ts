import type { DesignId } from "./design";

export type CoverUpDisposition =
  | "APPROVE"
  | "REVISE"
  | "LASER_FIRST"
  | "DEFER"
  | "DECLINE";

export type EvidenceClass = "PUBLIC" | "PRIVATE_DESIGN" | "RESTRICTED_EVIDENCE";

export interface CoverUpEvidence {
  evidenceId: string;
  designId: DesignId;
  immutableOriginalHash: string;
  storageClass: "RESTRICTED_EVIDENCE";
  originalMayBeMutated: false;
  portfolioPermissionGranted: boolean;
  createdAt: string;
}

export interface CoverUpAssessment {
  designId: DesignId;
  evidenceId: string;
  artistDisposition: CoverUpDisposition | null;
  physicalStencilTestFitCompleted: boolean;
  aiMayAuthorizeExecution: false;
  aiMayGuaranteeConcealment: false;
}
