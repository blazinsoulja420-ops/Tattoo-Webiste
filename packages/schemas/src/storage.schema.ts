import { z } from "zod";
import { assetSecurityClassSchema } from "./assets.schema";

export const deliveryPurposeSchema = z.enum([
  "CUSTOMER_DOWNLOAD",
  "ARTIST_PRODUCTION",
  "INTERNAL_REVIEW",
]);

export const storageObjectRefSchema = z.object({
  objectKey: z.string().min(1),
  securityClass: assetSecurityClassSchema,
  contentHash: z.string().min(1),
});

export const authorizedDeliveryRequestSchema = z.object({
  assetId: z.string().min(1),
  securityClass: assetSecurityClassSchema,
  requestingPrincipalId: z.string().min(1),
  purpose: deliveryPurposeSchema,
  expiresAt: z.string().min(1),
  auditCorrelationId: z.string().min(1),
});
