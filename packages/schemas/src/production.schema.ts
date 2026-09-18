import { z } from "zod";

const productionBaseSchema = z.object({
  designId: z.string().min(1),
  revisionId: z.string().min(1),
  canonicalGeometryFingerprint: z.string().min(1),
  assetHash: z.string().min(1),
  widthPx: z.number().int().positive(),
  heightPx: z.number().int().positive(),
  privateAsset: z.literal(true),
});

export const ftaSchema = productionBaseSchema.extend({ kind: z.literal("FTA") });

export const acrSchema = productionBaseSchema.extend({
  kind: z.literal("ACR"),
  handDrawnPresentationRequired: z.literal(true),
  allowedVisualModes: z.tuple([
    z.literal("pencil"), z.literal("graphite"), z.literal("ink"), z.literal("professional-sketch")
  ]),
});

export const trsSchema = productionBaseSchema.extend({
  kind: z.literal("TRS"),
  physicalWidthMm: z.number().positive(),
  physicalHeightMm: z.number().positive(),
  mirrored: z.boolean(),
  tiled: z.boolean(),
  lineHierarchy: z.tuple([
    z.literal("primary"), z.literal("structural"), z.literal("secondary"), z.literal("shading-landmark")
  ]),
});
