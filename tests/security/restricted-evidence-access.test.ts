import { describe, expect, it } from "vitest";
import { authorize } from "../../packages/domain/src/index";

describe("restricted evidence access", () => {
  it("fails closed without explicit permission", () => {
    const decision = authorize({
      principal: {
        principalId: "ADMIN-001",
        roles: ["ADMIN"],
        authenticated: true,
      },
      permission: "PRODUCTION_ASSET_READ",
      resource: {
        resourceType: "ASSET",
        resourceId: "EVIDENCE-001",
        securityClass: "RESTRICTED_EVIDENCE",
        relationships: ["ADMINISTRATIVE_SCOPE"],
      },
      auditCorrelationId: "CORR-RESTRICTED-1",
      decidedAt: "2026-09-18T16:00:00Z",
    });

    expect(decision.decision).toBe("DENY");
  });

  it("requires explicit permission plus relationship", () => {
    const denied = authorize({
      principal: {
        principalId: "ARTIST-001",
        roles: ["ARTIST"],
        authenticated: true,
      },
      permission: "RESTRICTED_EVIDENCE_READ",
      resource: {
        resourceType: "ASSET",
        resourceId: "EVIDENCE-001",
        securityClass: "RESTRICTED_EVIDENCE",
        relationships: [],
      },
      auditCorrelationId: "CORR-RESTRICTED-2",
      decidedAt: "2026-09-18T16:00:00Z",
    });

    const allowed = authorize({
      principal: {
        principalId: "ARTIST-001",
        roles: ["ARTIST"],
        authenticated: true,
      },
      permission: "RESTRICTED_EVIDENCE_READ",
      resource: {
        resourceType: "ASSET",
        resourceId: "EVIDENCE-001",
        securityClass: "RESTRICTED_EVIDENCE",
        relationships: ["ASSIGNED_ARTIST"],
      },
      auditCorrelationId: "CORR-RESTRICTED-3",
      decidedAt: "2026-09-18T16:00:00Z",
    });

    expect(denied.decision).toBe("DENY");
    expect(allowed.decision).toBe("ALLOW");
  });
});
