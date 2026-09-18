import { z } from "zod";

export const provenanceOperationSchema = z.enum([
  "CONCEPT_GENERATION",
  "CONTROLLED_EDIT",
  "FTA_RENDER",
  "ACR_RENDER",
  "TRS_RENDER",
  "VALIDATION",
  "PROTECTED_PREVIEW",
]);

export const provenanceRecordSchema = z.object({
  provenanceRecordId: z.string().min(1),
  designId: z.string().min(1),
  revisionId: z.string().min(1),
  operation: provenanceOperationSchema,
  providerAdapterId: z.string().min(1),
  providerModelId: z.string().min(1).optional(),
  sourceAssetIds: z.array(z.string().min(1)),
  parentRevisionId: z.string().min(1).optional(),
  promptDigest: z.string().min(1).optional(),
  parameterDigest: z.string().min(1).optional(),
  outputAssetId: z.string().min(1),
  supersedesProvenanceRecordId: z.string().min(1).optional(),
  createdAt: z.string().min(1),
});
