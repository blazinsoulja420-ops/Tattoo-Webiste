export const designStates = [
  "DRAFT",
  "SPECIFIED",
  "CONCEPT_GENERATED",
  "DESIGN_CANDIDATE",
  "CANONICAL_LOCKED",
  "PRODUCTION_RENDERING",
  "PRODUCTION_VALIDATION",
  "ARTIST_REVIEW",
  "PRODUCTION_CANDIDATE",
  "ARTIST_APPROVED",
  "LICENSED",
  "DELIVERED",
  "ARCHIVED",
] as const;

export type DesignState = (typeof designStates)[number];

const allowedTransitions: Readonly<Record<DesignState, readonly DesignState[]>> = {
  DRAFT: ["SPECIFIED"],
  SPECIFIED: ["CONCEPT_GENERATED"],
  CONCEPT_GENERATED: ["DESIGN_CANDIDATE"],
  DESIGN_CANDIDATE: ["CANONICAL_LOCKED", "SPECIFIED"],
  CANONICAL_LOCKED: ["PRODUCTION_RENDERING"],
  PRODUCTION_RENDERING: ["PRODUCTION_VALIDATION"],
  PRODUCTION_VALIDATION: ["ARTIST_REVIEW", "PRODUCTION_RENDERING"],
  ARTIST_REVIEW: ["PRODUCTION_CANDIDATE", "DESIGN_CANDIDATE"],
  PRODUCTION_CANDIDATE: ["ARTIST_APPROVED", "DESIGN_CANDIDATE"],
  ARTIST_APPROVED: ["LICENSED"],
  LICENSED: ["DELIVERED"],
  DELIVERED: ["ARCHIVED"],
  ARCHIVED: [],
};

export function canTransition(from: DesignState, to: DesignState): boolean {
  return allowedTransitions[from].includes(to);
}

export function assertTransition(from: DesignState, to: DesignState): void {
  if (!canTransition(from, to)) {
    throw new Error(`Invalid design state transition: ${from} -> ${to}`);
  }
}
