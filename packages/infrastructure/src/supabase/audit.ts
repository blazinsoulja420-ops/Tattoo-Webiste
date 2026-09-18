import {
  assertAuditAppend,
  type AuditEvent,
  type AuditEventRepository,
} from "@tattoo/domain";
import type { SupabaseDataGateway } from "./types";

export class SupabaseAuditEventRepository implements AuditEventRepository {
  constructor(private readonly data: SupabaseDataGateway) {}

  async append(event: AuditEvent): Promise<void> {
    const existing = await this.data.getOne("audit_events", { eventId: event.eventId });
    assertAuditAppend(existing ? [existing as unknown as AuditEvent] : [], event);
    await this.data.insert("audit_events", event as unknown as Record<string, unknown>);
  }
}
