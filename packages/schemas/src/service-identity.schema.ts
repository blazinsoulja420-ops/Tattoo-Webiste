import { z } from "zod";
import { permissionSchema } from "./authorization.schema";

export const serviceIdentitySchema = z.object({
  principalId: z.string().min(1),
  roles: z.tuple([z.literal("SYSTEM_AI_SERVICE")]),
  authenticated: z.literal(true),
  authenticationContext: z.record(z.string(), z.union([z.string(), z.boolean()])).optional(),
  grantedMachinePermissions: z.array(permissionSchema),
  authority: z.literal("CAPABILITY_ONLY"),
});
