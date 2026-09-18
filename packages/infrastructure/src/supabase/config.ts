export type SupabaseRuntime = "client" | "server";

export interface SupabaseDevelopmentConfig {
  environment: "development" | "test";
  url: string;
  publishableKey: string;
  serverSecretKey?: string;
  buckets: {
    public: string;
    privateDesign: string;
    restrictedEvidence: string;
  };
}

type EnvSource = Readonly<Record<string, string | undefined>>;

function required(env: EnvSource, name: string): string {
  const value = env[name]?.trim();
  if (!value) {
    throw new Error(`missing required development configuration: ${name}`);
  }
  return value;
}

export function loadSupabaseDevelopmentConfig(
  env: EnvSource,
  runtime: SupabaseRuntime,
): SupabaseDevelopmentConfig {
  const environment = required(env, "TATTOO_ENVIRONMENT");
  if (environment !== "development" && environment !== "test") {
    throw new Error("Supabase adapter is development/test only");
  }

  const serverSecretKey = env.SUPABASE_SERVER_SECRET_KEY?.trim();
  if (runtime === "client" && serverSecretKey) {
    throw new Error("privileged Supabase credential cannot be exposed to client runtime");
  }

  const config: SupabaseDevelopmentConfig = {
    environment,
    url: required(env, "SUPABASE_URL"),
    publishableKey: required(env, "SUPABASE_PUBLISHABLE_KEY"),
    buckets: {
      public: required(env, "SUPABASE_BUCKET_PUBLIC"),
      privateDesign: required(env, "SUPABASE_BUCKET_PRIVATE"),
      restrictedEvidence: required(env, "SUPABASE_BUCKET_RESTRICTED"),
    },
  };

  if (runtime === "server" && serverSecretKey) {
    config.serverSecretKey = serverSecretKey;
  }

  if (new Set(Object.values(config.buckets)).size !== 3) {
    throw new Error("Supabase security classes require distinct storage buckets");
  }

  return config;
}
