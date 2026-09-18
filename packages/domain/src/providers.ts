import type { JobKind, JobRequest } from "./jobs";
import type { AssetId } from "./assets";

export type ProviderCapability =
  | "CONCEPT_GENERATION"
  | "CONTROLLED_EDIT"
  | "FTA_RENDER"
  | "ACR_RENDER"
  | "TRS_RENDER";

export interface ProviderExecutionResult {
  outputAssetIds: readonly AssetId[];
  providerRequestId?: string;
  modelId?: string;
}

export interface ProviderAdapter {
  readonly adapterId: string;
  readonly authority: "CAPABILITY_ONLY";
  readonly capabilities: readonly ProviderCapability[];

  supports(kind: JobKind): boolean;

  execute(request: JobRequest): Promise<ProviderExecutionResult>;
}

export function assertProviderCapability(
  provider: ProviderAdapter,
  kind: JobKind,
): void {
  if (!provider.supports(kind)) {
    throw new Error(`provider ${provider.adapterId} does not support ${kind}`);
  }
  if (provider.authority !== "CAPABILITY_ONLY") {
    throw new Error("provider adapter may not hold workflow authority");
  }
}
