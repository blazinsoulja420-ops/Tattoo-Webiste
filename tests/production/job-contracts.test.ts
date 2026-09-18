import { describe, expect, it } from "vitest";
import {
  assertRenderJobEligible,
  canAdvanceJob,
  type CanonicalDesign,
  type JobRequest,
} from "../../packages/domain/src/index";

const canonical: CanonicalDesign = {
  designId: "TAT-000001",
  revisionId: "REV-001",
  locked: true,
  specification: {
    designId: "TAT-000001",
    revisionId: "REV-001",
    subject: "wolf",
    secondaryElements: ["moon"],
    style: "black-grey-realism",
    placement: "upper-arm",
    dimensions: { widthMm: 120, heightMm: 220 },
    colorMode: "black-grey",
    detail: "high",
    shading: "medium",
    negativeSpace: "medium",
    purpose: "new-tattoo",
  },
  geometryFingerprint: "geo-123",
  compositionFingerprint: "comp-123",
  createdAt: "2026-09-18T00:00:00Z",
};

function renderJob(kind: "FTA_RENDER" | "ACR_RENDER" | "TRS_RENDER"): JobRequest {
  return {
    jobId: `JOB-${kind}`,
    kind,
    designId: canonical.designId,
    revisionId: canonical.revisionId,
    state: "QUEUED",
    canonicalGeometryFingerprint: canonical.geometryFingerprint,
    canonicalCompositionFingerprint: canonical.compositionFingerprint,
    createdAt: "2026-09-18T00:00:00Z",
  };
}

describe("job contracts", () => {
  it("requires render jobs to use a locked canonical design", () => {
    const unlocked = { ...canonical, locked: false };
    expect(() => assertRenderJobEligible(renderJob("FTA_RENDER"), unlocked)).toThrow(
      "requires a locked canonical design",
    );
  });

  it("accepts synchronized FTA, ACR, and TRS render requests", () => {
    for (const kind of ["FTA_RENDER", "ACR_RENDER", "TRS_RENDER"] as const) {
      expect(() => assertRenderJobEligible(renderJob(kind), canonical)).not.toThrow();
    }
  });

  it("rejects canonical fingerprint drift", () => {
    const job = renderJob("TRS_RENDER");
    job.canonicalGeometryFingerprint = "wrong";
    expect(() => assertRenderJobEligible(job, canonical)).toThrow(
      "geometry fingerprint mismatch",
    );
  });

  it("prevents QUEUED from skipping directly to SUCCEEDED", () => {
    expect(canAdvanceJob("QUEUED", "SUCCEEDED")).toBe(false);
    expect(canAdvanceJob("QUEUED", "CLAIMED")).toBe(true);
  });
});
