import { z } from "zod";

export const physicalDimensionsSchema = z.object({
  widthMm: z.number().positive(),
  heightMm: z.number().positive(),
});

export const tattooSpecificationSchema = z.object({
  designId: z.string().min(1),
  revisionId: z.string().min(1),
  subject: z.string().min(1).max(500),
  secondaryElements: z.array(z.string().min(1).max(200)).max(50),
  style: z.enum([
    "black-grey-realism","color-realism","fine-line","traditional",
    "neo-traditional","japanese","illustrative","geometric","lettering","other"
  ]),
  placement: z.enum([
    "forearm","upper-arm","shoulder","chest","back","thigh","calf","wrist","hand","sleeve","other"
  ]),
  dimensions: physicalDimensionsSchema,
  colorMode: z.enum(["black-grey", "color"]),
  detail: z.enum(["low", "medium", "high"]),
  shading: z.enum(["light", "medium", "heavy"]),
  negativeSpace: z.enum(["low", "medium", "high"]),
  purpose: z.enum(["new-tattoo", "cover-up"]),
});
