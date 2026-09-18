import { z } from "zod";
import { assetSecurityClassSchema } from "./assets.schema";

export const permissionSchema = z.enum([
  "DESIGN_READ",
  "DESIGN_EDIT",
  "PRODUCTION_ASSET_READ",
  "RESTRICTED_EVIDENCE_READ",
  "ARTIST_REVIEW_WRITE",
  "LICENSE_READ",
  "SIGNED_DELIVERY_REQUEST",
  "SHOP_PROJECT_READ",
  "ADMIN_AUDIT_READ",
  "SYSTEM_JOB_EXECUTE",
]);

export const authorizationDecisionSchema = z.object({
  decision: z.enum(["ALLOW", "DENY"]),
  principalId: z.string().min(1),
  permission: permissionSchema,
  resourceType: z.string().min(1),
  resourceId: z.string().min(1),
  securityClass: assetSecurityClassSchema.optional(),
  auditCorrelationId: z.string().min(1),
  reason: z.string().min(1),
  decidedAt: z.string().min(1),
});
