import { z } from "zod";
import { assetSecurityClassSchema } from "./assets.schema";

export const auditEventSchema = z.object({
  eventId: z.string().min(1),
  actorPrincipalId: z.string().min(1),
  action: z.string().min(1),
  targetType: z.string().min(1),
  targetId: z.string().min(1),
  outcome: z.enum(["ALLOWED", "DENIED", "FAILED", "RECORDED"]),
  correlationId: z.string().min(1),
  occurredAt: z.string().min(1),
  securityClass: assetSecurityClassSchema.optional(),
  details: z.record(z.string(), z.string()).optional(),
});
