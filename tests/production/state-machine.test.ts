import { describe, expect, it } from "vitest";
import { assertTransition, canTransition } from "../../packages/domain/src/state-machine";

describe("design state machine", () => {
  it("allows governed forward progression", () => {
    expect(canTransition("DRAFT", "SPECIFIED")).toBe(true);
    expect(canTransition("ARTIST_REVIEW", "PRODUCTION_CANDIDATE")).toBe(true);
  });

  it("blocks execution-stage skipping", () => {
    expect(canTransition("DRAFT", "ARTIST_APPROVED")).toBe(false);
    expect(() => assertTransition("CANONICAL_LOCKED", "DELIVERED")).toThrow(
      "Invalid design state transition",
    );
  });
});
