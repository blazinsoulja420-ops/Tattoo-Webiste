# Phase 1B-I2 — Persistence & Storage Boundary Definition

## Objective

Define the durable persistence and storage boundary for Tattoo Platform v2 without selecting or activating a concrete backend provider.

The slice is:

Design Registry
→ Immutable Design Revisions
→ Asset Metadata
→ Append-Only Provenance
→ Restricted/Public/Private Storage Boundary
→ Signed Delivery Contract
→ Audit Events
→ Retention / Deletion Requests

## In scope

Phase 1B-I2 defines contracts and interfaces only for:

1. Design Registry persistence;
2. immutable DesignRevision records;
3. canonical-design snapshot persistence;
4. asset metadata persistence;
5. append-only provenance persistence;
6. audit-event persistence;
7. provider-neutral object-storage boundary;
8. PUBLIC / PRIVATE_DESIGN / RESTRICTED_EVIDENCE namespace separation;
9. signed/expiring download-request contracts;
10. retention and deletion-request domain contracts;
11. fail-closed rules for restricted body evidence;
12. test fixtures and acceptance criteria.

## Explicitly out of scope

- Supabase, PostgreSQL, S3, Cloudflare R2, Vercel Blob, or another concrete provider;
- SQL migrations;
- production database provisioning;
- live object storage;
- signed URL generation against a real provider;
- authentication/authorization implementation;
- customer body-image uploads;
- payment processing;
- deployment;
- production activation;
- public publishing;
- destructive data deletion.

## Required invariants

- Design IDs are permanent.
- Existing DesignRevision records are never overwritten.
- A new revision is appended and points to its predecessor when applicable.
- Canonical-design snapshots are revision-scoped and immutable once locked.
- Provenance records are append-only.
- Asset metadata and binary storage identity remain distinct.
- FTA, ACR, and TRS default to PRIVATE_DESIGN.
- COVERUP_ORIGINAL remains RESTRICTED_EVIDENCE.
- RESTRICTED_EVIDENCE may not be reclassified PUBLIC by a storage adapter.
- Signed delivery requests are time-limited and purpose-scoped.
- Storage/provider adapters cannot grant access authority; they only execute already-authorized access decisions.
- Delete requests are represented as auditable requests before any physical deletion occurs.
- Retention actions must preserve legal/audit constraints and immutable lineage requirements.
- Audit events are append-only and record actor, action, target, outcome, and timestamp.
- No persistence provider may silently overwrite or collapse revision/provenance history.

## Proposed implementation manifest for Phase 1B-I2-I1

Future implementation shall be limited to these exact paths unless scope is explicitly expanded:

1. `packages/domain/src/registry.ts`
2. `packages/domain/src/persistence.ts`
3. `packages/domain/src/storage.ts`
4. `packages/domain/src/audit.ts`
5. `packages/domain/src/retention.ts`
6. `packages/domain/src/index.ts`
7. `packages/schemas/src/registry.schema.ts`
8. `packages/schemas/src/storage.schema.ts`
9. `packages/schemas/src/audit.schema.ts`
10. `packages/schemas/src/retention.schema.ts`
11. `packages/schemas/src/index.ts`
12. `tests/production/registry-persistence.test.ts`
13. `tests/security/storage-boundary.test.ts`
14. `tests/security/signed-delivery.test.ts`
15. `tests/security/retention-audit.test.ts`
16. `docs/architecture/PERSISTENCE_AND_STORAGE_BOUNDARIES.md`
17. `docs/decisions/ADR-0005-provider-neutral-persistence-storage.md`

No other source, schema, test, workflow, governance, migration, or provider path is authorized by this definition.

## Acceptance criteria for Phase 1B-I2-I1

- Governance validation passes.
- Frozen-lockfile install passes.
- Lint passes.
- TypeScript strict typecheck passes.
- Existing Phase 1A and Phase 1B-I1 tests remain green.
- Tests prove revisions are append-only.
- Tests prove canonical locked snapshots cannot be replaced in place.
- Tests prove provenance persistence is append-only.
- Tests prove FTA/ACR/TRS cannot cross from PRIVATE_DESIGN to PUBLIC through the storage boundary.
- Tests prove COVERUP_ORIGINAL cannot cross from RESTRICTED_EVIDENCE to PUBLIC.
- Tests prove signed-delivery requests require expiry and explicit purpose.
- Tests prove storage adapters cannot grant application authority.
- Tests prove retention/deletion requests emit audit events before any destructive action.
- No live provider SDKs or network calls exist.
- No SQL migration or production backend is introduced.
- No secrets, customer images, private production assets, or restricted evidence are committed.

## Close condition

Phase 1B-I2 Definition closes only after the live repository baseline, exact three-path definition change, provider-neutrality, privacy boundary, and future implementation manifest are independently assured.
