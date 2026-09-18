import type { SupabaseDevelopmentConfig } from "./config";
import type { SupabaseDevelopmentGateways } from "./types";

export interface SupabaseDevelopmentClient {
  readonly provider: "SUPABASE";
  readonly environment: "development" | "test";
  readonly gateways: SupabaseDevelopmentGateways;
}

export function createSupabaseDevelopmentClient(
  config: SupabaseDevelopmentConfig,
  gateways: SupabaseDevelopmentGateways,
): SupabaseDevelopmentClient {
  if (config.environment !== "development" && config.environment !== "test") {
    throw new Error("Supabase development client cannot target production");
  }

  return {
    provider: "SUPABASE",
    environment: config.environment,
    gateways,
  };
}
