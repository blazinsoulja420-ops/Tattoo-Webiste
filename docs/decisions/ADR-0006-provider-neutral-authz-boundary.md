# ADR-0006 — Provider-Neutral Authentication and Authorization Boundary

## Status

Proposed for Phase 1B-I3 scope assurance.

## Context

Phase 1B-I2-I1 established provider-neutral persistence, storage, signed-delivery, audit, and retention contracts.

The next risk is allowing a future authentication provider or role claim to become the application authorization authority, especially for private production files and restricted body evidence.

## Decision

Define canonical principal, permission, relationship, service-identity, and authorization-decision contracts before selecting an authentication provider.

Authentication proves or asserts identity.

The application domain evaluates authorization.

Authorization defaults to DENY.

Resource access may require both permission and explicit ownership/project/license/share relationship.

SYSTEM_AI_SERVICE is a bounded service identity and cannot self-elevate or inherit human administrative authority.

Signed-delivery requests are created only after a successful application authorization decision.

Every ALLOW or DENY decision is audit-correlatable.

## Consequences

Positive:

- identity providers remain replaceable;
- RBAC cannot accidentally become blanket resource access;
- restricted evidence receives explicit relationship-aware authorization;
- storage signed-delivery remains downstream of application authority;
- automated AI/service identities are constrained before agentic integrations exist;
- deny decisions can be audited from the first implementation.

Tradeoffs:

- no production login exists after this phase;
- session/token validation remains deferred;
- MFA and account recovery remain future work;
- relationship data is contract-level until durable backend integration exists.

## Non-goals

This ADR does not select or activate Auth0, Clerk, Supabase Auth, Firebase Auth, Cognito, OAuth/OIDC configuration, password storage, MFA, production sessions/tokens, billing, deployment, or production activation.
