# ADR-0005 — Provider-Neutral Persistence and Storage Boundary

## Status

Proposed for Phase 1B-I2 scope assurance.

## Context

Phase 1B-I1 established provider-neutral job, asset, provenance, validation, and provider capability contracts.

The next architectural risk is binding identity, private assets, restricted body evidence, and provenance history directly to a vendor before the domain rules for persistence and storage are explicit.

## Decision

Define persistence and object-storage boundaries before selecting a concrete backend.

The domain will own:

- permanent Design identity;
- append-only DesignRevision history;
- immutable locked canonical snapshots;
- append-only provenance;
- asset security classification;
- authorized signed-delivery requests;
- audit events;
- retention/deletion request state.

Concrete persistence and storage adapters will implement capability only.

They may not grant authorization, weaken asset classifications, overwrite immutable evidence, collapse revision history, or bypass audit requirements.

## Consequences

Positive:

- backend providers remain replaceable;
- Design Registry semantics are established before SQL schema design;
- restricted cover-up evidence receives explicit treatment before uploads exist;
- signed delivery is separated from authorization;
- deletion becomes auditable rather than an untracked destructive operation;
- future Supabase or alternative-provider evaluation can be measured against stable contracts.

Tradeoffs:

- no real database or object storage becomes available in this phase;
- migration design remains deferred;
- authorization remains a separate future concern;
- retention enforcement remains contract-level until persistence exists.

## Non-goals

This ADR does not select or activate Supabase, PostgreSQL, S3, Cloudflare R2, Vercel Blob, authentication, deployment, payment processing, public publishing, or physical data deletion.
