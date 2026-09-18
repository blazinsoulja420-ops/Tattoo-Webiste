import type { AssetSecurityClass } from "./assets";

export type AuditOutcome = "ALLOWED" | "DENIED" | "FAILED" | "RECORDED";

export interface AuditEvent {
  eventId: string;
  actorPrincipalId: string;
  action: string;
  targetType: string;
  targetId: string;
  outcome: AuditOutcome;
  correlationId: string;
  occurredAt: string;
  securityClass?: AssetSecurityClass;
  details?: Readonly<Record<string, string>>;
}

export function assertAuditAppend(
  existing: readonly AuditEvent[],
  next: AuditEvent,
): void {
  if (existing.some((event) => event.eventId === next.eventId)) {
    throw new Error("audit event already exists; audit log is append-only");
  }

  if (!next.actorPrincipalId.trim() || !next.action.trim() || !next.targetId.trim()) {
    throw new Error("audit event requires actor, action, and target");
  }
}
