# ADR-0006 — Provider-Neutral Authentication and Authorization Boundary

## Status

Accepted and implemented at the contract layer by Phase 1B-I3-I1.

## Context

Phase 1B-I2-I1 established provider-neutral persistence, storage, signed-delivery, audit, and retention contracts.

The next risk was allowing a future authentication provider, session claim, role, or automated service identity to become the effective application authorization authority, especially for PRIVATE_DESIGN and RESTRICTED_EVIDENCE resources.

## Decision

Implement canonical principal, permission, relationship, service-identity, and authorization-decision contracts before selecting a concrete authentication provider.

Authentication provides identity input.

The application domain evaluates authorization.

Authorization defaults to DENY.

Resource access requires explicit permission plus an appropriate relationship whenever the resource is not independently approved for public access.

Every ALLOW or DENY result is audit-correlatable.

Signed-delivery requests may be created only from a matching ALLOW decision for SIGNED_DELIVERY_REQUEST.

SYSTEM_AI_SERVICE is a capability-only machine identity and cannot inherit or grant human/admin authority.

## Enforced consequences

The contract layer now denies or rejects:

- missing principal/resource authorization context;
- unauthenticated principals;
- missing required permission;
- missing required ownership/project/license/share relationship;
- restricted-evidence access without RESTRICTED_EVIDENCE_READ;
- generic ADMIN access without ADMINISTRATIVE_SCOPE;
- artist access without ASSIGNED_ARTIST or EXPLICIT_SHARE;
- shop access without SHOP_PROJECT_MEMBER;
- signed-delivery creation from a DENY decision;
- signed-delivery decisions that do not match principal, asset, or security class;
- service identities holding human/admin-oriented permissions;
- service identities attempting restricted-evidence access by role alone;
- service self-grant of roles.

## Positive effects

- identity providers remain replaceable;
- authentication and authorization remain separate;
- RBAC cannot silently become blanket object access;
- restricted body evidence has relationship-aware controls;
- storage capability remains downstream from application authorization;
- automated AI identities are constrained before agentic provider integration;
- both ALLOW and DENY outcomes can be audited.

## Tradeoffs

- no production login exists yet;
- session/token validation remains deferred;
- MFA and account recovery remain future work;
- relationship data remains contract-level until a concrete persistence adapter exists;
- administrative break-glass procedures remain a future explicitly governed design.

## Non-goals

This ADR does not select or activate Auth0, Clerk, Supabase Auth, Firebase Auth, Cognito, OAuth/OIDC configuration, password storage, MFA, production session/token issuance, billing, deployment, or production activation.
