import { describe, expect, it } from "vitest";
import {
  assertStorageAdapterBoundary,
  assertStorageClassification,
  type ObjectStorageAdapter,
} from "../../packages/domain/src/index";

const adapter: ObjectStorageAdapter = {
  adapterId: "storage-test",
  authority: "CAPABILITY_ONLY",
  async put() {},
  async createDeliveryArtifact(request) {
    return {
      value: "opaque-test-artifact",
      expiresAt: request.expiresAt,
    };
  },
};

describe("storage security boundary", () => {
  it("prevents private production files from becoming public", () => {
    expect(() =>
      assertStorageClassification("PRIVATE_DESIGN", "PUBLIC"),
    ).toThrow("may not change asset security classification");
  });

  it("prevents restricted evidence from becoming public", () => {
    expect(() =>
      assertStorageClassification("RESTRICTED_EVIDENCE", "PUBLIC"),
    ).toThrow("may not change asset security classification");
  });

  it("allows storage only to preserve the assigned class", () => {
    expect(() =>
      assertStorageClassification("RESTRICTED_EVIDENCE", "RESTRICTED_EVIDENCE"),
    ).not.toThrow();
  });

  it("keeps storage adapters capability-only", () => {
    expect(() => assertStorageAdapterBoundary(adapter)).not.toThrow();
  });
});
