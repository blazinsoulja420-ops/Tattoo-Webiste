# Phase 1B-I4 — Development Backend Provider & Adapter Definition

## Objective

Define the first concrete development-backend integration for Tattoo Platform v2 while preserving the provider-neutral domain contracts already established in Phase 1B-I1 through Phase 1B-I3-I1.

This phase may select a development provider, but it does not grant production authority.

The slice is:

Canonical Domain Contract
→ Development Adapter
→ Development Database
→ Development Object Storage
→ Development Identity Mapping
→ Signed Delivery Adapter
→ Audit Persistence
→ Integration Test Harness

## Development provider decision

Supabase is selected as the **development backend candidate for Phase 1B-I4-I1**, subject to the exact constraints in ADR-0007.

This is not a production-provider approval.

The decision is based on current development fit:

- managed PostgreSQL;
- authentication service;
- object storage;
- signed delivery URLs;
- Row Level Security capability;
- JavaScript/TypeScript client support;
- a single development platform capable of exercising the repository's persistence, storage, and identity adapter boundaries.

Production adoption remains separately gated and may retain, split, or replace these capabilities.

## In scope

Phase 1B-I4 defines only the development integration boundary for:

1. Supabase development client/configuration contracts;
2. design registry persistence adapter;
3. design revision persistence adapter;
4. canonical snapshot persistence adapter;
5. asset metadata persistence adapter;
6. provenance persistence adapter;
7. append-only audit persistence adapter;
8. retention-request persistence adapter;
9. development object-storage adapter;
10. PUBLIC / PRIVATE_DESIGN / RESTRICTED_EVIDENCE bucket or namespace mapping;
11. authenticated identity → canonical Principal mapping;
12. signed-delivery adapter consuming an already-authorized delivery request;
13. development-only integration-test fixtures;
14. environment validation with fail-closed missing-secret behavior.

## Explicitly out of scope

- production Supabase project;
- production database;
- production storage buckets;
- production user accounts;
- production service-role credentials;
- customer data;
- customer body imagery;
- production migrations;
- production deployment;
- production DNS;
- payment activation;
- live marketing publication;
- production AI provider;
- destructive production deletion;
- automatic promotion from development to production.

## Environment model

Only a development environment is in scope.

Required conceptual environment values include:

- development Supabase URL;
- development public/anon client key where appropriate;
- development server-only privileged credential where strictly necessary;
- explicit environment marker;
- test namespace/project marker.

No credential values may be committed.

Missing required runtime configuration fails closed.

## Security boundary

- Public/client credentials must never imply admin authority.
- Privileged server credentials remain server-only.
- Domain authorization remains authoritative even if Supabase RLS is also used.
- RLS is defense in depth and not a replacement for domain authorization.
- Storage adapters cannot reclassify assets.
- RESTRICTED_EVIDENCE remains non-public.
- Signed delivery is generated only after a matching domain ALLOW decision.
- Signed delivery TTLs for sensitive assets must be short and explicit.
- Provider-returned identity/session claims map into canonical Principal; they do not bypass authorize().
- Service-role capability must never be exposed to browser code.
- Test fixtures use synthetic data only.

## Provider-specific caution

Supabase signed URLs are time-limited bearer capabilities. The application must treat them as sensitive, use short TTLs for private/restricted assets, and never treat URL creation as the authorization decision itself.

## Proposed implementation manifest for Phase 1B-I4-I1

Future implementation shall be limited to these exact paths unless scope is explicitly expanded:

1. `packages/infrastructure/package.json`
2. `packages/infrastructure/tsconfig.json`
3. `packages/infrastructure/src/index.ts`
4. `packages/infrastructure/src/supabase/client.ts`
5. `packages/infrastructure/src/supabase/config.ts`
6. `packages/infrastructure/src/supabase/persistence.ts`
7. `packages/infrastructure/src/supabase/storage.ts`
8. `packages/infrastructure/src/supabase/identity.ts`
9. `packages/infrastructure/src/supabase/audit.ts`
10. `packages/infrastructure/src/supabase/retention.ts`
11. `packages/infrastructure/src/supabase/signed-delivery.ts`
12. `packages/infrastructure/src/supabase/types.ts`
13. `tests/integration/supabase/config.test.ts`
14. `tests/integration/supabase/persistence-adapter.test.ts`
15. `tests/integration/supabase/storage-adapter.test.ts`
16. `tests/integration/supabase/identity-adapter.test.ts`
17. `tests/integration/supabase/signed-delivery-adapter.test.ts`
18. `tests/integration/supabase/audit-retention-adapter.test.ts`
19. `docs/architecture/DEVELOPMENT_BACKEND_INTEGRATION.md`
20. `docs/providers/SUPABASE_DEVELOPMENT_PROFILE.md`
21. `docs/decisions/ADR-0007-supabase-development-backend.md`
22. `.env.example`
23. `pnpm-lock.yaml`

No SQL migration, deployment workflow, production environment, customer data, generated production asset, or governance path is authorized by this definition.

## Dependency boundary

Phase 1B-I4-I1 may add the minimum Supabase JavaScript client dependency required by the infrastructure package.

No other backend SDK is authorized unless separately reviewed.

## Acceptance criteria

- Governance validation passes.
- Frozen-lockfile install passes.
- Lint passes.
- TypeScript strict typecheck passes.
- All existing tests remain green.
- Infrastructure package compiles independently.
- Missing required development configuration fails closed.
- No privileged credential is accepted from client-exposed configuration.
- Persistence adapters satisfy existing repository interfaces.
- Revision/provenance/audit semantics remain append-only.
- Storage adapter preserves security classification.
- Identity adapter maps provider identity into Principal without granting permissions.
- Signed-delivery adapter requires an already-authorized request.
- Tests use synthetic development fixtures only.
- No real customer content is uploaded.
- No production project or production credential is provisioned.
- No production deployment is performed.

## Close condition

Phase 1B-I4 Definition closes only after the exact baseline, provider-selection rationale, documentation-only manifest, future 23-path implementation manifest, and development-only authority boundary are independently assured.
