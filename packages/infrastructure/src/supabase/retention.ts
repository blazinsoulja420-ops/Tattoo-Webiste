import type {
  RetentionRequest,
  RetentionRequestRepository,
} from "@tattoo/domain";
import type { SupabaseDataGateway } from "./types";

export class SupabaseRetentionRequestRepository implements RetentionRequestRepository {
  constructor(private readonly data: SupabaseDataGateway) {}

  async get(requestId: string): Promise<RetentionRequest | null> {
    return (await this.data.getOne("retention_requests", {
      requestId,
    })) as unknown as RetentionRequest | null;
  }

  async append(request: RetentionRequest): Promise<void> {
    if (await this.get(request.requestId)) {
      throw new Error("retention request already exists; history is append-only");
    }
    await this.data.insert(
      "retention_requests",
      request as unknown as Record<string, unknown>,
    );
  }
}
