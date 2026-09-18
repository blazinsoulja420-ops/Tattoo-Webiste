import type { CanonicalDesign, DesignId, RevisionId } from "./design";
import type { ProductionOutputKind } from "./production";

export type JobId = string;

export const jobStates = [
  "QUEUED",
  "CLAIMED",
  "RUNNING",
  "SUCCEEDED",
  "FAILED",
  "CANCELLED",
] as const;

export type JobState = (typeof jobStates)[number];

export type JobKind =
  | "CONCEPT_GENERATION"
  | "CONTROLLED_EDIT"
  | "FTA_RENDER"
  | "ACR_RENDER"
  | "TRS_RENDER"
  | "PRODUCTION_VALIDATION";

export interface JobRequest {
  jobId: JobId;
  kind: JobKind;
  designId: DesignId;
  revisionId: RevisionId;
  state: JobState;
  canonicalGeometryFingerprint?: string;
  canonicalCompositionFingerprint?: string;
  createdAt: string;
}

const allowedJobTransitions: Readonly<Record<JobState, readonly JobState[]>> = {
  QUEUED: ["CLAIMED", "CANCELLED"],
  CLAIMED: ["RUNNING", "FAILED", "CANCELLED"],
  RUNNING: ["SUCCEEDED", "FAILED", "CANCELLED"],
  SUCCEEDED: [],
  FAILED: [],
  CANCELLED: [],
};

export function canAdvanceJob(from: JobState, to: JobState): boolean {
  return allowedJobTransitions[from].includes(to);
}

export function outputKindForRenderJob(kind: JobKind): ProductionOutputKind | null {
  if (kind === "FTA_RENDER") return "FTA";
  if (kind === "ACR_RENDER") return "ACR";
  if (kind === "TRS_RENDER") return "TRS";
  return null;
}

export function assertRenderJobEligible(
  request: JobRequest,
  canonical: CanonicalDesign,
): void {
  const outputKind = outputKindForRenderJob(request.kind);
  if (!outputKind) return;

  if (!canonical.locked) {
    throw new Error(`${request.kind} requires a locked canonical design`);
  }
  if (request.designId !== canonical.designId) {
    throw new Error("render job designId does not match canonical design");
  }
  if (request.revisionId !== canonical.revisionId) {
    throw new Error("render job revisionId does not match canonical revision");
  }
  if (request.canonicalGeometryFingerprint !== canonical.geometryFingerprint) {
    throw new Error("render job geometry fingerprint mismatch");
  }
  if (request.canonicalCompositionFingerprint !== canonical.compositionFingerprint) {
    throw new Error("render job composition fingerprint mismatch");
  }
}
