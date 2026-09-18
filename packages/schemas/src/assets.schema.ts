import { z } from "zod";

export const assetSecurityClassSchema = z.enum([
  "PUBLIC",
  "PRIVATE_DESIGN",
  "RESTRICTED_EVIDENCE",
]);

export const assetKindSchema = z.enum([
  "FTA",
  "ACR",
  "TRS",
  "PROTECTED_PREVIEW",
  "COVERUP_ORIGINAL",
  "COVERUP_DERIVATIVE",
  "OTHER",
]);

export const assetRecordSchema = z.object({
  assetId: z.string().min(1),
  designId: z.string().min(1),
  revisionId: z.string().min(1),
  kind: assetKindSchema,
  securityClass: assetSecurityClassSchema,
  contentHash: z.string().min(1),
  mimeType: z.string().min(1),
  byteLength: z.number().int().nonnegative(),
  createdAt: z.string().min(1),
  provenanceRecordId: z.string().min(1),
  canonicalGeometryFingerprint: z.string().min(1).optional(),
  widthPx: z.number().int().positive().optional(),
  heightPx: z.number().int().positive().optional(),
  physicalWidthMm: z.number().positive().optional(),
  physicalHeightMm: z.number().positive().optional(),
  immutableOriginal: z.boolean().optional(),
});
