import { z } from "zod";

export const principalRoleSchema = z.enum([
  "CUSTOMER",
  "ARTIST",
  "SHOP",
  "ADMIN",
  "SYSTEM_AI_SERVICE",
]);

export const principalSchema = z.object({
  principalId: z.string().min(1),
  roles: z.array(principalRoleSchema).min(1),
  authenticated: z.boolean(),
  authenticationContext: z.record(z.string(), z.union([z.string(), z.boolean()])).optional(),
});
