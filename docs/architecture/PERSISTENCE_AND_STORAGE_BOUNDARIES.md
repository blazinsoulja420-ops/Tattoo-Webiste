# Persistence and Storage Boundaries — Phase 1B-I2 Design

## Implementation status

Phase 1B-I2-I1 implements the provider-neutral contract layer for durable registry identity, immutable revisions, canonical snapshots, storage boundaries, signed delivery, audit events, and retention/deletion requests.

No concrete database or object-storage provider is active.

## Design Registry boundary

The Design Registry is the durable source of identity and lineage.

Implemented conceptual records include:

- DesignRegistryRecord;
- DesignRevisionRecord;
- CanonicalDesignSnapshot;
- AssetRecord;
- ProvenanceRecord;
- AuditEvent;
- RetentionRequest.

A Design ID remains permanent.

DesignRevision records are append-only. Duplicate Revision IDs are rejected, later revisions require a valid same-design parent, and existing revisions are not replaced in place.

## Canonical snapshot boundary

A locked canonical snapshot contains:

- Design ID;
- Revision ID;
- lock state = true;
- specification digest;
- geometry fingerprint;
- composition fingerprint;
- creation timestamp.

A second snapshot for the same Design ID + Revision ID is rejected. A changed canonical design requires a new revision.

## Provider-neutral persistence interfaces

The domain now exposes repository contracts for:

- DesignRegistryRepository
- DesignRevisionRepository
- CanonicalSnapshotRepository
- AssetMetadataRepository
- ProvenanceRepository
- AuditEventRepository
- RetentionRequestRepository

These interfaces describe domain operations only. They contain no SQL, migration, network, or vendor-specific implementation.

Provenance persistence is append-only: duplicate provenance-record identities are rejected.

## Binary storage boundary

Object bytes remain behind ObjectStorageAdapter.

Metadata and binary identity are intentionally separate.

The adapter is explicitly:

`CAPABILITY_ONLY`

It may store bytes and translate an already-authorized delivery request into an opaque delivery artifact in a later provider implementation.

It may not:

- decide authorization;
- change PUBLIC / PRIVATE_DESIGN / RESTRICTED_EVIDENCE classification;
- publish restricted evidence;
- weaken PRIVATE_DESIGN production assets to PUBLIC;
- silently replace immutable originals;
- erase provenance or audit history.

The contract rejects storage-class changes at the adapter boundary.

## Security namespaces

### PUBLIC

Protected previews, watermarked marketing derivatives, thumbnails, and explicitly approved promotional assets.

### PRIVATE_DESIGN

FTA masters, ACR files, TRS files, scale sheets, production packs, and purchased private deliverables.

### RESTRICTED_EVIDENCE

Original body imagery, cover-up evidence, assessment images, and sensitive derivatives.

RESTRICTED_EVIDENCE may not be reclassified PUBLIC by a storage adapter.

## Signed delivery contract

AuthorizedDeliveryRequest requires:

- Asset ID;
- assigned security class;
- requesting principal ID;
- explicit purpose;
- future expiry timestamp;
- audit correlation ID.

The current contract supports purposes:

- CUSTOMER_DOWNLOAD
- ARTIST_PRODUCTION
- INTERNAL_REVIEW

A storage adapter consumes an authorization decision; it does not create one.

Expired requests, missing principals, and missing audit correlation are rejected.

## Audit boundary

Audit events are append-only and include:

- event ID;
- actor/principal;
- action;
- target type and ID;
- outcome;
- correlation ID;
- timestamp;
- optional security class and details.

Duplicate audit-event identities are rejected.

Blocked or failed access/reclassification attempts can be represented as audit events in later application layers.

## Retention and deletion

Deletion remains a governed workflow rather than a storage command.

RetentionRequest records:

- request ID;
- request kind;
- requester;
- target;
- reason;
- requested timestamp;
- workflow state;
- legal-hold status;
- audit correlation ID.

The domain requires:

- DELETION_REQUEST kind;
- no active legal hold;
- APPROVED state;
- a prior correlated deletion-request audit event;

before a future physical deletion operation could even be eligible.

No physical deletion implementation exists in Phase 1B-I2-I1.

## Provider neutrality

This contract layer does not select or activate Supabase, PostgreSQL, S3, R2, Vercel Blob, or another backend.

Concrete providers must implement these contracts and pass the same lineage, security-classification, signed-delivery, retention, and audit tests before adoption.

## Phase 1B-I2-I1 evidence target

Completion requires governance validation, frozen-lockfile install, lint, TypeScript strict typecheck, all prior production tests, the new persistence/security tests, and the Next.js build to pass.
