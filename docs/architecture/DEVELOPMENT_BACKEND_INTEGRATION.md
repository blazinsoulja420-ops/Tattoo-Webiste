# Development Backend Integration — Phase 1B-I4

## Purpose

Phase 1B-I4 introduces the first concrete backend adapter target while preserving the provider-neutral domain.

Supabase is selected for the development integration slice only.

## Architectural rule

The dependency direction remains:

Application / Domain
→ Provider-neutral interfaces
→ Infrastructure adapters
→ Supabase development services

The domain never imports Supabase SDK types.

Only the infrastructure package knows about provider-specific APIs.

## Development database mapping

The development persistence adapter will map the existing domain repository contracts onto PostgreSQL-backed storage.

The first integration target covers:

- Design Registry;
- DesignRevision;
- CanonicalDesignSnapshot;
- Asset metadata;
- Provenance;
- AuditEvent;
- RetentionRequest.

Provider persistence must preserve the existing domain invariants:

- permanent Design IDs;
- append-only revisions;
- immutable canonical snapshots;
- append-only provenance;
- append-only audit events;
- no silent history collapse.

## Development storage mapping

The development storage adapter will map the existing ObjectStorageAdapter onto Supabase Storage.

Logical security classes remain canonical:

- PUBLIC
- PRIVATE_DESIGN
- RESTRICTED_EVIDENCE

The provider-specific bucket/namespace layout may implement those classes, but it may not change their meaning.

RESTRICTED_EVIDENCE must never use a public bucket.

## Identity mapping

Supabase Auth is an identity source, not the authorization authority.

The identity adapter maps provider identity/session claims into the canonical Principal contract.

The adapter may establish:

- principal ID;
- authenticated state;
- provider subject metadata;
- authentication context.

It may not establish final application permission or relationship access.

All application access decisions still flow through authorize().

## RLS boundary

Supabase Row Level Security may be used as defense in depth in a later implementation stage.

RLS does not replace:

- domain permission policy;
- resource relationship checks;
- restricted-evidence policy;
- service-identity boundaries;
- audit correlation.

A database policy must not be interpreted as permission to weaken domain authorization.

## Signed delivery

The storage adapter may create a time-limited signed URL only after it receives an AuthorizedDeliveryRequest that was produced from a matching domain ALLOW decision.

Signed URLs are bearer capabilities and must be treated as sensitive.

For PRIVATE_DESIGN and RESTRICTED_EVIDENCE:

- TTL is explicit;
- TTL is short by default;
- URLs are never committed or logged in full;
- creation is audit-correlated;
- security class must match the authorized asset.

## Privileged credentials

Development privileged credentials are server-only.

They may not be:

- embedded in browser bundles;
- committed;
- returned to clients;
- placed in public runtime configuration.

Any adapter requiring privileged capability must fail closed if executed in a client context.

## Development-only assurance

Phase 1B-I4-I1 proves adapter compatibility only.

It does not prove:

- production scalability;
- production privacy readiness;
- production backup/recovery readiness;
- production retention compliance;
- production secret-management readiness;
- production incident-response readiness.

Those require separate production-readiness gates.
