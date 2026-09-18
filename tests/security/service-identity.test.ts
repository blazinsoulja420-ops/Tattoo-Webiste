import { describe, expect, it } from "vitest";
import {
  assertServiceIdentity,
  authorize,
  canServiceGrantRoles,
  type ServiceIdentity,
} from "../../packages/domain/src/index";

const service: ServiceIdentity = {
  principalId: "SERVICE-AI-001",
  roles: ["SYSTEM_AI_SERVICE"],
  authenticated: true,
  grantedMachinePermissions: ["SYSTEM_JOB_EXECUTE"],
  authority: "CAPABILITY_ONLY",
};

describe("service identity boundary", () => {
  it("accepts a capability-only service identity", () => {
    expect(() => assertServiceIdentity(service)).not.toThrow();
    expect(canServiceGrantRoles()).toBe(false);
  });

  it("rejects forbidden human/admin permissions", () => {
    expect(() =>
      assertServiceIdentity({
        ...service,
        grantedMachinePermissions: ["ADMIN_AUDIT_READ"],
      }),
    ).toThrow("forbidden human/admin permission");
  });

  it("does not allow service identity restricted-evidence access by role alone", () => {
    const decision = authorize({
      principal: service,
      permission: "RESTRICTED_EVIDENCE_READ",
      resource: {
        resourceType: "ASSET",
        resourceId: "EVIDENCE-001",
        securityClass: "RESTRICTED_EVIDENCE",
        relationships: ["SYSTEM_JOB_SCOPE"],
      },
      auditCorrelationId: "CORR-SERVICE-1",
      decidedAt: "2026-09-18T16:00:00Z",
    });

    expect(decision.decision).toBe("DENY");
  });
});
