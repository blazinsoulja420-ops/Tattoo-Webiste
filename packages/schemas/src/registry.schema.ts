import { z } from "zod";
import { tattooSpecificationSchema } from "./design.schema";

export const designRegistryRecordSchema = z.object({
  designId: z.string().min(1),
  createdAt: z.string().min(1),
});

export const designRevisionRecordSchema = z.object({
  designId: z.string().min(1),
  revisionId: z.string().min(1),
  parentRevisionId: z.string().min(1).nullable(),
  specification: tattooSpecificationSchema,
  specificationDigest: z.string().min(1),
  createdAt: z.string().min(1),
});

export const canonicalDesignSnapshotSchema = z.object({
  designId: z.string().min(1),
  revisionId: z.string().min(1),
  locked: z.literal(true),
  specificationDigest: z.string().min(1),
  geometryFingerprint: z.string().min(1),
  compositionFingerprint: z.string().min(1),
  createdAt: z.string().min(1),
});
