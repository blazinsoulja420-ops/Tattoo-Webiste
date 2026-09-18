import type { AuditEvent } from "./audit";

export type RetentionRequestKind = "RETENTION_REVIEW" | "DELETION_REQUEST";
export type RetentionRequestState =
  | "REQUESTED"
  | "ON_HOLD"
  | "APPROVED"
  | "DECLINED"
  | "COMPLETED";

export interface RetentionRequest {
  requestId: string;
  kind: RetentionRequestKind;
  requesterPrincipalId: string;
  targetType: "ASSET" | "DESIGN" | "REVISION" | "PROVENANCE";
  targetId: string;
  reason: string;
  requestedAt: string;
  state: RetentionRequestState;
  legalHold: boolean;
  auditCorrelationId: string;
}

export function buildRetentionRequestAudit(
  request: RetentionRequest,
  eventId: string,
  occurredAt: string,
): AuditEvent {
  return {
    eventId,
    actorPrincipalId: request.requesterPrincipalId,
    action: request.kind,
    targetType: request.targetType,
    targetId: request.targetId,
    outcome: "RECORDED",
    correlationId: request.auditCorrelationId,
    occurredAt,
  };
}

export function assertPhysicalDeletionEligible(
  request: RetentionRequest,
  auditEvents: readonly AuditEvent[],
): void {
  if (request.kind !== "DELETION_REQUEST") {
    throw new Error("physical deletion requires a deletion request");
  }
  if (request.legalHold) {
    throw new Error("physical deletion blocked by legal hold");
  }
  if (request.state !== "APPROVED") {
    throw new Error("physical deletion requires approved request");
  }
  const recorded = auditEvents.some(
    (event) =>
      event.correlationId === request.auditCorrelationId &&
      event.targetId === request.targetId &&
      event.action === "DELETION_REQUEST",
  );
  if (!recorded) {
    throw new Error("physical deletion requires prior audit event");
  }
}
