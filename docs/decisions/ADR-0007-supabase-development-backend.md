# ADR-0007 — Supabase as Development Backend Candidate

## Status

Accepted for development adapter implementation by Phase 1B-I4-I1.

Production adoption remains **NOT AUTHORIZED**.

## Context

Tattoo Platform v2 has provider-neutral contracts for persistence, storage, audit, retention, identity, authorization, and signed delivery.

Phase 1B-I4-I1 needed a concrete provider target without granting provider provisioning or production authority.

## Decision

Retain Supabase as the development backend candidate and implement the provider-specific adapter layer inside `@tattoo/infrastructure`.

The implementation uses narrow development gateway interfaces so the repository can verify provider mapping behavior without requiring a live project.

The connected Supabase account currently has no projects. No project was created.

## Implemented consequences

The repository now has:

- development/test-only Supabase configuration;
- persistence adapters for registry/revisions/canonical snapshots/assets/provenance;
- audit and retention adapters;
- security-class-aware storage routing;
- trusted identity mapping;
- signed-delivery TTL enforcement;
- synthetic integration tests.

## Security decisions

- Domain authorization remains authoritative.
- Provider role metadata is not authorization.
- Privileged credentials are server-only.
- RESTRICTED_EVIDENCE maps to a distinct configured bucket.
- Signed URLs require an already-authorized domain request.
- Sensitive signed URLs use bounded TTLs.
- No provider output may silently weaken domain security class.

## Dependency decision

A live `@supabase/supabase-js` dependency is deferred until a development project is separately authorized/provisioned.

This avoids pretending to have a live backend when none exists and keeps the current phase reproducible with synthetic test gateways.

## Non-goals

This ADR does not authorize:

- Supabase project creation;
- project cost acceptance;
- SQL migrations;
- real development users;
- real object uploads;
- production provider selection;
- production credentials;
- deployment;
- payment activation;
- destructive production operations.
