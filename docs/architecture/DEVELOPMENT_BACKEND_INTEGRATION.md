# Development Backend Integration — Phase 1B-I4

## Implementation status

Phase 1B-I4-I1 now contains a development-only Supabase infrastructure package that maps existing provider-neutral domain contracts into provider-specific adapter boundaries.

No Supabase project was provisioned because the connected Supabase account currently exposes no projects and this phase does not authorize provider provisioning.

## Dependency direction

The enforced dependency direction is:

Application / Domain
→ Provider-neutral interfaces
→ `@tattoo/infrastructure`
→ Supabase development gateways

The domain package does not import Supabase SDK or provider-specific types.

## Development configuration

The adapter configuration is loaded through an explicit development/test-only contract.

Required values are represented in `.env.example` only as placeholders.

Configuration fails closed when:

- required values are missing;
- the environment is not development/test;
- a privileged server credential is supplied to a client runtime;
- security-class buckets are not distinct.

No real credentials are committed.

## Development database adapter boundary

The infrastructure package implements provider-specific repositories for:

- Design Registry;
- DesignRevision;
- CanonicalDesignSnapshot;
- Asset metadata;
- Provenance;
- AuditEvent;
- RetentionRequest.

The adapters preserve domain rules before invoking the provider gateway:

- permanent Design IDs;
- append-only revisions;
- immutable canonical snapshots;
- append-only provenance;
- append-only audit events;
- append-only retention requests.

No SQL migration is included.

## Development storage adapter boundary

`SupabaseObjectStorageAdapter` implements the provider-neutral `ObjectStorageAdapter`.

Security classes map to separate configured bucket names:

- PUBLIC;
- PRIVATE_DESIGN;
- RESTRICTED_EVIDENCE.

The adapter never changes the domain security class and always uploads with `upsert: false`.

RESTRICTED_EVIDENCE therefore cannot be silently routed to a public bucket through this adapter.

## Identity mapping

Supabase identity data is mapped into the canonical Principal only after a trusted application role assignment is supplied.

Provider metadata role claims are intentionally ignored as authorization authority.

The identity adapter therefore establishes authenticated identity context but does not grant application permissions.

## Signed delivery

The signed-delivery adapter consumes an already-authorized `AuthorizedDeliveryRequest`.

Before asking the provider for a signed URL, it verifies:

- request validity and future expiry;
- asset location exists;
- stored security class matches the authorized request;
- TTL does not exceed the configured security-class limit.

Current maximum TTLs are:

- RESTRICTED_EVIDENCE: 15 minutes;
- PRIVATE_DESIGN: 60 minutes;
- PUBLIC: 24 hours.

Signed URLs remain bearer capabilities and must not be persisted in logs.

## Supabase plugin evidence

The connected Supabase plugin was used during implementation to inspect the account and current documentation.

Observed account state:

- existing Supabase projects: **0**.

Current Supabase documentation confirms:

- privileged service-role operations are server-only;
- private Storage assets can be delivered using time-limited signed URLs;
- signed URLs remain valid until their configured expiry.

Because there is no existing development project and provider provisioning is not authorized in this phase, live database/storage calls were not performed.

## Integration-test model

Integration tests use synthetic in-memory gateways that exercise the exact provider adapter behavior without network access or real customer data.

The tests cover:

- fail-closed configuration;
- append-only persistence behavior;
- storage-class bucket routing;
- provider identity mapping;
- signed-delivery TTL/security-class checks;
- append-only audit/retention behavior.

## Production boundary

Phase 1B-I4-I1 does not prove production readiness and does not authorize:

- production Supabase;
- production secrets;
- production RLS policies;
- SQL migrations;
- production storage;
- real customer body imagery;
- deployment;
- payment activation;
- production AI provider;
- destructive production operations.
