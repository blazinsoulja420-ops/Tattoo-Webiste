import { describe, expect, it } from "vitest";
import {
  authorize,
  type Principal,
  type ResourceAccessContext,
} from "../../packages/domain/src/index";

const customer: Principal = {
  principalId: "USER-001",
  roles: ["CUSTOMER"],
  authenticated: true,
};

const ownedPrivateDesign: ResourceAccessContext = {
  resourceType: "ASSET",
  resourceId: "ASSET-001",
  securityClass: "PRIVATE_DESIGN",
  relationships: ["OWNER"],
};

describe("authorization default deny", () => {
  it("denies when principal context is missing", () => {
    const decision = authorize({
      principal: null,
      permission: "DESIGN_READ",
      resource: ownedPrivateDesign,
      auditCorrelationId: "CORR-001",
      decidedAt: "2026-09-18T16:00:00Z",
    });

    expect(decision.decision).toBe("DENY");
  });

  it("denies when resource context is missing", () => {
    const decision = authorize({
      principal: customer,
      permission: "DESIGN_READ",
      resource: null,
      auditCorrelationId: "CORR-002",
      decidedAt: "2026-09-18T16:00:00Z",
    });

    expect(decision.decision).toBe("DENY");
  });

  it("does not treat authentication alone as authorization", () => {
    const decision = authorize({
      principal: customer,
      permission: "DESIGN_READ",
      resource: {
        ...ownedPrivateDesign,
        relationships: [],
      },
      auditCorrelationId: "CORR-003",
      decidedAt: "2026-09-18T16:00:00Z",
    });

    expect(decision.decision).toBe("DENY");
    expect(decision.auditCorrelationId).toBe("CORR-003");
  });
});
