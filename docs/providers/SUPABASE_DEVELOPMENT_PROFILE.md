# Supabase Development Profile

## Status

Selected development backend candidate for Phase 1B-I4-I1.

Production adoption: **NOT AUTHORIZED**.

## Intended development use

Supabase may be used in the development environment for:

- PostgreSQL-backed persistence;
- authentication identity source;
- object storage;
- signed delivery URLs;
- development integration testing.

## Fit with existing architecture

The repository already defines provider-neutral contracts for:

- persistence;
- storage;
- audit;
- retention;
- principal identity;
- authorization;
- signed delivery.

Supabase is therefore integrated through adapters rather than imported into the domain layer.

## Development capability mapping

| Tattoo Platform contract | Supabase development capability |
| --- | --- |
| Design Registry / revisions | PostgreSQL |
| Provenance / audit | PostgreSQL |
| Identity source | Supabase Auth |
| Private/restricted binary storage | Supabase Storage |
| Expiring delivery | Storage signed URL |
| Additional DB access control | PostgreSQL RLS, defense in depth |

## Required safeguards

- Separate development project from any future production project.
- Synthetic test users and assets only.
- No real body imagery.
- No production credentials.
- No public restricted-evidence bucket.
- Server-only handling of privileged credentials.
- Domain authorization remains authoritative.
- RLS cannot weaken domain policy.
- Signed delivery requires prior ALLOW decision.
- Short TTLs for sensitive signed URLs.
- No signed URL values in persistent logs.
- Provider failures fail closed.

## Deferred production questions

Production evaluation must separately address:

- backup/recovery objectives;
- regional/data-location requirements;
- incident response;
- key rotation;
- secret management;
- storage lifecycle controls;
- signed-URL revocation requirements;
- cost and capacity;
- operational observability;
- vendor lock-in/exit plan;
- production RLS assurance;
- legal/privacy requirements for body imagery.

## Exit strategy

The provider-neutral domain and infrastructure-adapter boundary must remain sufficient to replace Supabase components without rewriting core tattoo workflow rules.

A future production architecture may:

- keep Supabase;
- use Supabase for only some capabilities;
- move object storage elsewhere;
- move authentication elsewhere;
- move persistence elsewhere.

No development decision in this profile grants production approval.
