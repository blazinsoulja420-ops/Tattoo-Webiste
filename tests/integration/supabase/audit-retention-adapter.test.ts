import { describe, expect, it } from "vitest";
import {
  SupabaseAuditEventRepository,
  SupabaseRetentionRequestRepository,
  type SupabaseDataGateway,
  type SupabaseRow,
} from "../../../packages/infrastructure/src/index";

class MemoryDataGateway implements SupabaseDataGateway {
  readonly rows = new Map<string, SupabaseRow[]>();

  async getOne(table: string, filters: Readonly<Record<string, string>>) {
    return (this.rows.get(table) ?? []).find((row) =>
      Object.entries(filters).every(([key, value]) => row[key] === value),
    ) ?? null;
  }

  async list(table: string) {
    return this.rows.get(table) ?? [];
  }

  async insert(table: string, row: Readonly<Record<string, unknown>>) {
    this.rows.set(table, [...(this.rows.get(table) ?? []), row]);
  }
}

describe("Supabase audit and retention adapters", () => {
  it("keeps audit events append-only", async () => {
    const gateway = new MemoryDataGateway();
    const repo = new SupabaseAuditEventRepository(gateway);
    const event = {
      eventId: "AUDIT-001",
      actorPrincipalId: "USER-001",
      action: "SIGNED_DELIVERY_REQUEST",
      targetType: "ASSET",
      targetId: "ASSET-001",
      outcome: "ALLOWED" as const,
      correlationId: "CORR-001",
      occurredAt: "2026-09-18T16:00:00Z",
    };

    await repo.append(event);
    await expect(repo.append(event)).rejects.toThrow("append-only");
  });

  it("keeps retention requests append-only", async () => {
    const gateway = new MemoryDataGateway();
    const repo = new SupabaseRetentionRequestRepository(gateway);
    const request = {
      requestId: "RET-001",
      kind: "RETENTION_REVIEW" as const,
      requesterPrincipalId: "USER-001",
      targetType: "ASSET" as const,
      targetId: "ASSET-001",
      reason: "synthetic test",
      requestedAt: "2026-09-18T16:00:00Z",
      state: "REQUESTED" as const,
      legalHold: false,
      auditCorrelationId: "CORR-RET-001",
    };

    await repo.append(request);
    await expect(repo.append(request)).rejects.toThrow("append-only");
  });
});
