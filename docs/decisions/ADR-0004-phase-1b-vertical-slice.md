# ADR-0004 — Phase 1B First Vertical Slice

## Status

Accepted and implemented at the contract layer by Phase 1B-I1.

## Context

Phase 1A established the repository, canonical design model, FTA/ACR/TRS production contract, state machine, cover-up evidence constraints, runtime schemas, and CI.

The next risk was integrating an external AI provider too early and coupling core workflow rules to vendor-specific APIs.

## Decision

The first real vertical slice implements provider-neutral job, asset, provenance, validation, and adapter contracts before any live provider integration.

The slice ends at an Artist Review Candidate gate. It does not render real images or call external services.

The domain owns workflow authority. Provider adapters are explicitly capability-only.

## Consequences

Positive:

- workflow authority remains inside the domain;
- provider replacement stays possible;
- generation and validation remain independent;
- provenance is mandatory before storage integration;
- security classification is attached to assets from creation;
- production render jobs require a locked canonical design;
- geometry drift fails validation;
- failed validation blocks ARTIST_REVIEW;
- cover-up original evidence cannot be reclassified as public.

Tradeoffs:

- users still cannot generate real tattoos after Phase 1B-I1;
- storage and database design remain future work;
- visual geometry validation remains fingerprint/contract-level until image tooling is integrated;
- provider execution interfaces exist without a concrete live implementation.

## Non-goals

This ADR does not select OpenAI, another image provider, Supabase, Vercel, a queue provider, object storage, or a payment provider.

It does not authorize release, deployment, production activation, payments, public auto-publishing, or tattoo execution.
