import { z } from "zod";

export const validationFindingSchema = z.object({
  code: z.string().min(1),
  severity: z.enum(["INFO", "WARNING", "ERROR"]),
  message: z.string().min(1),
});

export const productionValidationResultSchema = z.object({
  validatorId: z.string().min(1),
  designId: z.string().min(1),
  revisionId: z.string().min(1),
  passed: z.boolean(),
  findings: z.array(validationFindingSchema),
  validatedAt: z.string().min(1),
});
