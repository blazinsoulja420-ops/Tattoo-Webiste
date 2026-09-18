import { describe, expect, it } from "vitest";
import {
  assertDeliveryRequest,
  type AuthorizedDeliveryRequest,
} from "../../packages/domain/src/index";

function request(): AuthorizedDeliveryRequest {
  return {
    assetId: "ASSET-FTA",
    securityClass: "PRIVATE_DESIGN",
    requestingPrincipalId: "USER-001",
    purpose: "CUSTOMER_DOWNLOAD",
    expiresAt: "2026-09-18T13:00:00Z",
    auditCorrelationId: "AUDIT-CORR-001",
  };
}

describe("signed delivery contracts", () => {
  it("accepts an authorized, purpose-scoped, unexpired request", () => {
    expect(() =>
      assertDeliveryRequest(request(), new Date("2026-09-18T12:00:00Z")),
    ).not.toThrow();
  });

  it("rejects expired requests", () => {
    expect(() =>
      assertDeliveryRequest(request(), new Date("2026-09-18T14:00:00Z")),
    ).toThrow("must expire in the future");
  });

  it("requires a requesting principal and audit correlation", () => {
    expect(() =>
      assertDeliveryRequest(
        { ...request(), requestingPrincipalId: "" },
        new Date("2026-09-18T12:00:00Z"),
      ),
    ).toThrow("requires requesting principal");

    expect(() =>
      assertDeliveryRequest(
        { ...request(), auditCorrelationId: "" },
        new Date("2026-09-18T12:00:00Z"),
      ),
    ).toThrow("requires audit correlation");
  });
});
