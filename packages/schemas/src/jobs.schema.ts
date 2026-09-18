import { z } from "zod";

export const jobStateSchema = z.enum([
  "QUEUED",
  "CLAIMED",
  "RUNNING",
  "SUCCEEDED",
  "FAILED",
  "CANCELLED",
]);

export const jobKindSchema = z.enum([
  "CONCEPT_GENERATION",
  "CONTROLLED_EDIT",
  "FTA_RENDER",
  "ACR_RENDER",
  "TRS_RENDER",
  "PRODUCTION_VALIDATION",
]);

export const jobRequestSchema = z.object({
  jobId: z.string().min(1),
  kind: jobKindSchema,
  designId: z.string().min(1),
  revisionId: z.string().min(1),
  state: jobStateSchema,
  canonicalGeometryFingerprint: z.string().min(1).optional(),
  canonicalCompositionFingerprint: z.string().min(1).optional(),
  createdAt: z.string().min(1),
});
