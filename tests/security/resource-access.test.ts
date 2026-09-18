import { describe, expect, it } from "vitest";
import { authorize, createAuthorizedDeliveryRequest } from "../../packages/domain/src/index";

describe("resource relationship access", () => {
  it("allows customer owner access to a private design", () => {
    const decision = authorize({
      principal: {
        principalId: "CUSTOMER-001",
        roles: ["CUSTOMER"],
        authenticated: true,
      },
      permission: "DESIGN_READ",
      resource: {
        resourceType: "DESIGN",
        resourceId: "TAT-001",
        securityClass: "PRIVATE_DESIGN",
        relationships: ["OWNER"],
      },
      auditCorrelationId: "CORR-CUST",
      decidedAt: "2026-09-18T16:00:00Z",
    });

    expect(decision.decision).toBe("ALLOW");
  });

  it("requires explicit artist assignment or share", () => {
    const denied = authorize({
      principal: {
        principalId: "ARTIST-001",
        roles: ["ARTIST"],
        authenticated: true,
      },
      permission: "PRODUCTION_ASSET_READ",
      resource: {
        resourceType: "ASSET",
        resourceId: "ASSET-001",
        securityClass: "PRIVATE_DESIGN",
        relationships: [],
      },
      auditCorrelationId: "CORR-ARTIST-1",
      decidedAt: "2026-09-18T16:00:00Z",
    });

    const allowed = authorize({
      principal: {
        principalId: "ARTIST-001",
        roles: ["ARTIST"],
        authenticated: true,
      },
      permission: "PRODUCTION_ASSET_READ",
      resource: {
        resourceType: "ASSET",
        resourceId: "ASSET-001",
        securityClass: "PRIVATE_DESIGN",
        relationships: ["ASSIGNED_ARTIST"],
      },
      auditCorrelationId: "CORR-ARTIST-2",
      decidedAt: "2026-09-18T16:00:00Z",
    });

    expect(denied.decision).toBe("DENY");
    expect(allowed.decision).toBe("ALLOW");
  });

  it("requires explicit shop relationship", () => {
    const decision = authorize({
      principal: {
        principalId: "SHOP-001",
        roles: ["SHOP"],
        authenticated: true,
      },
      permission: "SHOP_PROJECT_READ",
      resource: {
        resourceType: "PROJECT",
        resourceId: "PROJECT-001",
        relationships: ["SHOP_PROJECT_MEMBER"],
      },
      auditCorrelationId: "CORR-SHOP",
      decidedAt: "2026-09-18T16:00:00Z",
    });

    expect(decision.decision).toBe("ALLOW");
  });

  it("requires signed-delivery authorization before delivery request creation", () => {
    const denied = authorize({
      principal: {
        principalId: "CUSTOMER-001",
        roles: ["CUSTOMER"],
        authenticated: true,
      },
      permission: "SIGNED_DELIVERY_REQUEST",
      resource: {
        resourceType: "ASSET",
        resourceId: "ASSET-FTA",
        securityClass: "PRIVATE_DESIGN",
        relationships: [],
      },
      auditCorrelationId: "CORR-DELIVERY-1",
      decidedAt: "2026-09-18T16:00:00Z",
    });

    expect(() =>
      createAuthorizedDeliveryRequest(
        denied,
        "CUSTOMER-001",
        "ASSET-FTA",
        "PRIVATE_DESIGN",
        "CUSTOMER_DOWNLOAD",
        "2026-09-18T17:00:00Z",
      ),
    ).toThrow("requires ALLOW authorization decision");

    const allowed = authorize({
      principal: {
        principalId: "CUSTOMER-001",
        roles: ["CUSTOMER"],
        authenticated: true,
      },
      permission: "SIGNED_DELIVERY_REQUEST",
      resource: {
        resourceType: "ASSET",
        resourceId: "ASSET-FTA",
        securityClass: "PRIVATE_DESIGN",
        relationships: ["OWNER"],
      },
      auditCorrelationId: "CORR-DELIVERY-2",
      decidedAt: "2026-09-18T16:00:00Z",
    });

    const request = createAuthorizedDeliveryRequest(
      allowed,
      "CUSTOMER-001",
      "ASSET-FTA",
      "PRIVATE_DESIGN",
      "CUSTOMER_DOWNLOAD",
      "2026-09-18T17:00:00Z",
    );

    expect(request.auditCorrelationId).toBe("CORR-DELIVERY-2");
  });
});
