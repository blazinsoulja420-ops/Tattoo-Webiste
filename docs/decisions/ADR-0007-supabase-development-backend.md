# ADR-0007 — Supabase as Development Backend Candidate

## Status

Proposed for Phase 1B-I4 scope assurance.

## Context

Tattoo Platform v2 now has provider-neutral contracts for jobs, persistence, storage, audit, retention, authentication identity, authorization, resource relationships, service identity, and signed delivery.

The next useful proof is a real development integration that exercises those contracts without granting production authority.

The current deployment baseline already identifies Supabase as a backend candidate.

## Decision

Select Supabase as the concrete **development backend candidate** for Phase 1B-I4-I1.

Use a dedicated infrastructure package so provider-specific SDK types do not enter the domain package.

The development adapter layer may target:

- Supabase PostgreSQL for repository persistence;
- Supabase Auth as an identity source;
- Supabase Storage for development object storage;
- Supabase Storage signed URLs for already-authorized delivery requests.

Application authorization remains owned by the domain.

## Why this development candidate fits

Supabase provides a full PostgreSQL database, integrated authentication, object storage, and time-limited signed URL capability in one development platform.

That allows the project to test the existing contracts with minimal provider sprawl while preserving the adapter boundary.

## Important constraints

- Development selection is not production approval.
- No real customer data or body imagery.
- No production credentials.
- Privileged credentials remain server-only.
- RLS is defense in depth, not the canonical authorization authority.
- Storage classification cannot be weakened.
- Signed URLs are bearer capabilities and require short, explicit TTLs.
- Signed URL creation occurs only after domain authorization.
- Provider identity claims do not grant permissions by themselves.
- No production deployment/provisioning is authorized.

## Alternatives retained

The architecture intentionally preserves the ability to use a different production stack or split services later.

Examples include:

- another PostgreSQL provider;
- a separate auth provider;
- Cloudflare R2 or another S3-compatible object store;
- a different signed-delivery implementation.

No rejected alternative is prohibited by this ADR.

## Consequences

Positive:

- first concrete backend integration becomes testable;
- one development provider can exercise several established interfaces;
- provider-specific code remains isolated;
- production provider decisions remain reversible.

Tradeoffs:

- a development SDK dependency is introduced in the next implementation phase;
- development tests will gain provider-specific fixtures;
- provider semantics must be carefully prevented from leaking into domain contracts;
- signed URL behavior requires security discipline.

## Non-goals

This ADR does not create a Supabase project, provision a database, upload assets, create production users, enable production auth, define production migrations, deploy the application, activate payments, or grant production authority.
