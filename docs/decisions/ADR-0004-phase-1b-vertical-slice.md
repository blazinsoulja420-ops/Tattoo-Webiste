# ADR-0004 — Phase 1B First Vertical Slice

## Status

Proposed for Phase 1B scope assurance.

## Context

Phase 1A established the repository, canonical design model, FTA/ACR/TRS production contract, state machine, cover-up evidence constraints, runtime schemas, and CI.

The next risk is integrating an external AI provider too early and coupling core workflow rules to vendor-specific APIs.

## Decision

The first real vertical slice will define and then implement provider-neutral job, asset, provenance, validation, and adapter contracts before any live provider integration.

The slice ends at an Artist Review Candidate contract. It does not render real images or call external services.

## Consequences

Positive:

- workflow authority remains inside the domain;
- provider replacement stays possible;
- generation and validation remain independent;
- provenance is mandatory from the first implementation;
- security classification is attached to assets before storage integration;
- future workers can implement the contracts without changing core workflow rules.

Tradeoffs:

- users still cannot generate real tattoos after Phase 1B-I1;
- storage and database design remain future work;
- visual geometry validation remains contract-level until image tooling is integrated.

## Non-goals

This ADR does not select OpenAI, another image provider, Supabase, Vercel, a queue provider, or payment provider.
