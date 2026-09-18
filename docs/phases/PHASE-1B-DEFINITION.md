# Phase 1B — Definition & Scope Assurance

## Objective

Define the first real vertical slice without activating any AI provider, database provider, deployment provider, payment provider, or public publishing workflow.

The vertical slice is:

Tattoo Specification
→ Canonical Design
→ Generation Job Contract
→ FTA / ACR / TRS Output Contracts
→ Asset / Provenance Records
→ Validation Result
→ Artist Review Candidate

## In scope

Phase 1B defines contracts and interfaces only for:

1. generation job requests and lifecycle;
2. canonical-design locking and immutable revision identity;
3. FTA / ACR / TRS render-job contracts;
4. asset metadata and security classification;
5. provenance records and parent/derivative lineage;
6. validation findings and fail-closed production disposition;
7. provider-neutral adapter interfaces;
8. test fixtures and acceptance criteria for the future implementation.

## Explicitly out of scope

- real model/API calls;
- database persistence;
- authentication;
- object-storage integration;
- image rendering;
- vectorization;
- computer vision;
- cover-up segmentation;
- payments;
- licensing transactions;
- deployment;
- public catalog publishing;
- marketing automation.

## Required invariants

- Every job references one Design ID and one Revision ID.
- A production render job requires a locked canonical design.
- FTA, ACR, and TRS outputs must share the canonical geometry fingerprint.
- ACR must declare hand-drawn presentation requirements.
- TRS must declare physical dimensions and transfer options.
- Output assets default to PRIVATE_DESIGN.
- Cover-up original evidence remains RESTRICTED_EVIDENCE and immutable.
- Validation findings are separate from generation and cannot be self-certified by the generator.
- Validation failure prevents progression to ARTIST_REVIEW.
- Provider adapters may supply capability but never grant workflow authority.

## Proposed implementation manifest for Phase 1B-I1

The future implementation shall be limited to these paths unless scope is re-authorized:

1. `packages/domain/src/jobs.ts`
2. `packages/domain/src/assets.ts`
3. `packages/domain/src/provenance.ts`
4. `packages/domain/src/validation.ts`
5. `packages/domain/src/providers.ts`
6. `packages/domain/src/index.ts`
7. `packages/schemas/src/jobs.schema.ts`
8. `packages/schemas/src/assets.schema.ts`
9. `packages/schemas/src/provenance.schema.ts`
10. `packages/schemas/src/validation.schema.ts`
11. `packages/schemas/src/index.ts`
12. `tests/production/job-contracts.test.ts`
13. `tests/production/provenance.test.ts`
14. `tests/production/validation-gate.test.ts`
15. `docs/architecture/JOB_AND_PROVENANCE_CONTRACTS.md`
16. `docs/decisions/ADR-0004-phase-1b-vertical-slice.md`

No other source or test path is authorized by this definition.

## Acceptance criteria for Phase 1B-I1

- TypeScript strict typecheck passes.
- Governance validation passes.
- Existing Phase 1A tests remain green.
- New tests prove generation jobs cannot produce production outputs from an unlocked canonical design.
- New tests prove geometry-fingerprint mismatch fails validation.
- New tests prove ACR retains the hand-drawn requirement.
- New tests prove cover-up original evidence cannot be reclassified as public.
- New tests prove provenance records preserve parent/derivative lineage.
- New tests prove validation failure blocks ARTIST_REVIEW progression.
- No live external provider calls exist.
- No secrets, credentials, private images, or production assets are committed.

## Phase 1B close condition

Phase 1B Definition closes only when this scope is independently assured against the live repository baseline and the implementation manifest is confirmed complete, minimal, non-duplicative, and governance-compatible.
