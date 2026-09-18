# Persistence and Storage Boundaries — Phase 1B-I2 Design

## Purpose

Tattoo Platform v2 needs durable records before connecting a concrete database or object-storage provider.

This architecture keeps domain authority independent from storage capability.

## Design Registry boundary

The Design Registry is the durable source of identity and lineage.

Conceptual records include:

- Design;
- DesignRevision;
- CanonicalDesignSnapshot;
- AssetRecord;
- ProvenanceRecord;
- AuditEvent;
- RetentionRequest;
- DeletionRequest.

A Design ID remains permanent for the life of the record.

A DesignRevision is append-only. A later revision may reference a parent revision, but existing revision content is never replaced in place.

## Canonical snapshot boundary

A canonical locked design is persisted as a revision-scoped snapshot containing at minimum:

- Design ID;
- Revision ID;
- lock state;
- specification digest;
- geometry fingerprint;
- composition fingerprint;
- creation timestamp.

Once locked, the persisted snapshot is immutable. A changed design requires a new revision.

## Persistence interfaces

Domain contracts should depend on small provider-neutral repository interfaces such as:

- DesignRegistryRepository
- DesignRevisionRepository
- CanonicalSnapshotRepository
- AssetMetadataRepository
- ProvenanceRepository
- AuditEventRepository
- RetentionRequestRepository

Interfaces express domain operations, not SQL or vendor-specific APIs.

## Binary storage boundary

Binary objects are stored behind a separate ObjectStorageAdapter.

Metadata and binary identity are intentionally separated.

The adapter may:

- store bytes under an already-authorized security class;
- read an already-authorized object;
- generate an expiring delivery artifact only when given an authorized delivery request;
- report integrity metadata.

The adapter may not:

- decide who is authorized;
- change PUBLIC / PRIVATE_DESIGN / RESTRICTED_EVIDENCE classification;
- publish restricted evidence;
- silently overwrite immutable originals;
- erase provenance or audit history.

## Security namespaces

Logical storage namespaces remain:

### PUBLIC

Protected previews, watermarked marketing derivatives, thumbnails, and explicitly approved promotional assets.

### PRIVATE_DESIGN

FTA masters, ACR files, TRS files, scale sheets, production packs, and purchased private deliverables.

### RESTRICTED_EVIDENCE

Original body imagery, cover-up evidence, assessment images, and sensitive derivatives.

RESTRICTED_EVIDENCE has the strongest access, retention, audit, and deletion controls.

## Signed delivery contract

A signed delivery request is an application-authorized capability request, not an authorization decision.

It requires:

- asset ID;
- security class;
- requesting principal ID;
- approved purpose;
- expiry timestamp or maximum TTL;
- audit correlation ID.

A storage adapter may translate that authorized request into a provider-specific signed URL/token in a later phase.

## Retention and deletion

Deletion is a governed workflow, not an unlogged storage operation.

A deletion request records:

- request ID;
- requester;
- target asset/record;
- reason;
- requested timestamp;
- legal/retention holds;
- approval state;
- eventual disposition.

The current phase defines only the contract. No physical deletion implementation is authorized.

## Audit boundary

Audit events are append-only and capture at minimum:

- event ID;
- actor/principal;
- action;
- target type and ID;
- outcome;
- correlation ID;
- timestamp;
- relevant security class where applicable.

Failed access and blocked reclassification attempts should also be auditable.

## Provider neutrality

This design does not select Supabase, PostgreSQL, S3, R2, Vercel Blob, or any other backend.

Concrete providers must implement these contracts and pass the same security and lineage tests before adoption.
