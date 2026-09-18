import type { PrincipalRole } from "@tattoo/domain";

export type SupabaseRow = Readonly<Record<string, unknown>>;

export interface SupabaseDataGateway {
  getOne(
    table: string,
    filters: Readonly<Record<string, string>>,
  ): Promise<SupabaseRow | null>;

  list(
    table: string,
    filters: Readonly<Record<string, string>>,
    orderBy?: string,
  ): Promise<readonly SupabaseRow[]>;

  insert(table: string, row: Readonly<Record<string, unknown>>): Promise<void>;
}

export interface SupabaseStorageGateway {
  upload(
    bucket: string,
    objectKey: string,
    bytes: Uint8Array,
    options: { upsert: false },
  ): Promise<void>;

  createSignedUrl(
    bucket: string,
    objectKey: string,
    expiresInSeconds: number,
  ): Promise<string>;
}

export interface SupabaseAuthIdentity {
  id: string;
  authenticated: boolean;
  provider?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  userMetadata?: Readonly<Record<string, unknown>>;
  appMetadata?: Readonly<Record<string, unknown>>;
}

export interface TrustedRoleAssignment {
  principalId: string;
  roles: readonly PrincipalRole[];
}

export interface SupabaseDevelopmentGateways {
  data: SupabaseDataGateway;
  storage: SupabaseStorageGateway;
}
