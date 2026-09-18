import { z } from "zod";
import { assetSecurityClassSchema } from "./assets.schema";

export const resourceRelationshipSchema = z.enum([
  "OWNER",
  "LICENSEE",
  "ASSIGNED_ARTIST",
  "SHOP_PROJECT_MEMBER",
  "EXPLICIT_SHARE",
  "ADMINISTRATIVE_SCOPE",
  "SYSTEM_JOB_SCOPE",
]);

export const resourceAccessContextSchema = z.object({
  resourceType: z.string().min(1),
  resourceId: z.string().min(1),
  securityClass: assetSecurityClassSchema.optional(),
  relationships: z.array(resourceRelationshipSchema),
  publicationApproved: z.boolean().optional(),
});
