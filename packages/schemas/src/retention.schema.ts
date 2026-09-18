import { z } from "zod";

export const retentionRequestSchema = z.object({
  requestId: z.string().min(1),
  kind: z.enum(["RETENTION_REVIEW", "DELETION_REQUEST"]),
  requesterPrincipalId: z.string().min(1),
  targetType: z.enum(["ASSET", "DESIGN", "REVISION", "PROVENANCE"]),
  targetId: z.string().min(1),
  reason: z.string().min(1),
  requestedAt: z.string().min(1),
  state: z.enum(["REQUESTED", "ON_HOLD", "APPROVED", "DECLINED", "COMPLETED"]),
  legalHold: z.boolean(),
  auditCorrelationId: z.string().min(1),
});
