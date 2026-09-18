# ADR-0005 — Provider-Neutral Persistence and Storage Boundary

## Status

Accepted and implemented at the contract layer by Phase 1B-I2-I1.

## Context

Phase 1B-I1 established provider-neutral job, asset, provenance, validation, and provider capability contracts.

The next architectural risk was binding permanent design identity, private production assets, restricted body evidence, audit history, and provenance directly to a vendor before persistence and storage semantics were explicit.

## Decision

Implement provider-neutral persistence and object-storage contracts before selecting a concrete backend.

The domain now owns:

- permanent Design identity;
- append-only DesignRevision history;
- immutable locked canonical snapshots;
- append-only provenance;
- asset security classification;
- authorized signed-delivery requests;
- append-only audit events;
- retention/deletion request state.

Concrete persistence and storage adapters implement capability only.

They may not grant authorization, weaken asset classifications, overwrite immutable evidence, collapse revision/provenance history, or bypass audit requirements.

## Enforced consequences

The contract layer now rejects:

- duplicate revision identities;
- later revisions without a valid parent;
- in-place replacement of locked canonical snapshots;
- duplicate provenance-record identities;
- storage security-class changes;
- expired or incomplete delivery requests;
- storage adapters that hold workflow authority;
- physical-deletion eligibility under legal hold;
- physical-deletion eligibility without approved request state;
- physical-deletion eligibility without prior correlated audit evidence;
- duplicate audit-event identities.

## Positive effects

- backend providers remain replaceable;
- Design Registry semantics are established before SQL schema design;
- restricted cover-up evidence is protected before upload implementation exists;
- signed delivery remains separate from authorization;
- deletion becomes auditable instead of silently destructive;
- Supabase or another provider can later be evaluated against stable contracts.

## Tradeoffs

- no real database or object storage is available yet;
- SQL migration design remains deferred;
- authentication and authorization remain separate future concerns;
- retention enforcement is contract-level until durable persistence exists;
- physical deletion remains intentionally absent.

## Non-goals

This ADR does not select or activate Supabase, PostgreSQL, S3, Cloudflare R2, Vercel Blob, authentication, deployment, payment processing, public publishing, or physical data deletion.
