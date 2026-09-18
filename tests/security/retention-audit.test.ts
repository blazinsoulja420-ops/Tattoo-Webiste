import { describe, expect, it } from "vitest";
import {
  assertAuditAppend,
  assertPhysicalDeletionEligible,
  buildRetentionRequestAudit,
  type RetentionRequest,
} from "../../packages/domain/src/index";

function approvedRequest(): RetentionRequest {
  return {
    requestId: "DEL-001",
    kind: "DELETION_REQUEST",
    requesterPrincipalId: "USER-001",
    targetType: "ASSET",
    targetId: "ASSET-001",
    reason: "customer deletion request",
    requestedAt: "2026-09-18T12:00:00Z",
    state: "APPROVED",
    legalHold: false,
    auditCorrelationId: "CORR-DEL-001",
  };
}

describe("retention and audit contracts", () => {
  it("requires a prior audit event before physical deletion can be eligible", () => {
    const request = approvedRequest();

    expect(() => assertPhysicalDeletionEligible(request, [])).toThrow(
      "requires prior audit event",
    );

    const event = buildRetentionRequestAudit(
      request,
      "AUDIT-DEL-001",
      "2026-09-18T12:01:00Z",
    );

    expect(() => assertPhysicalDeletionEligible(request, [event])).not.toThrow();
  });

  it("blocks deletion under legal hold", () => {
    const request = { ...approvedRequest(), legalHold: true };
    const event = buildRetentionRequestAudit(
      request,
      "AUDIT-DEL-002",
      "2026-09-18T12:01:00Z",
    );

    expect(() => assertPhysicalDeletionEligible(request, [event])).toThrow(
      "blocked by legal hold",
    );
  });

  it("keeps audit events append-only", () => {
    const request = approvedRequest();
    const event = buildRetentionRequestAudit(
      request,
      "AUDIT-DEL-003",
      "2026-09-18T12:01:00Z",
    );

    expect(() => assertAuditAppend([], event)).not.toThrow();
    expect(() => assertAuditAppend([event], event)).toThrow(
      "audit log is append-only",
    );
  });
});
