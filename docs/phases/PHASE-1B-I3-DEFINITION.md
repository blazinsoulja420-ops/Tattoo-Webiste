# Phase 1B-I3 — Authentication & Authorization Boundary Definition

## Objective

Define the provider-neutral identity, role, permission, and resource-access boundary for Tattoo Platform v2 before selecting or activating a concrete authentication provider.

The slice is:

Authenticated Principal
→ Role Assignment
→ Permission Evaluation
→ Resource Ownership / Relationship
→ Asset Access Decision
→ Signed-Delivery Authorization
→ Service Identity Boundary
→ Audit-Linked Decision

## In scope

Phase 1B-I3 defines contracts and interfaces only for:

1. principal identity;
2. CUSTOMER, ARTIST, SHOP, ADMIN, and SYSTEM_AI_SERVICE roles;
3. least-privilege permission grants;
4. role-to-permission policy;
5. resource ownership and explicit relationship checks;
6. asset-class-aware authorization decisions;
7. signed-delivery authorization decisions;
8. service identity and capability boundaries;
9. fail-closed authorization behavior;
10. audit correlation for allow/deny decisions;
11. test fixtures and acceptance criteria.

## Explicitly out of scope

- Auth0, Clerk, Supabase Auth, Firebase Auth, Cognito, or another provider;
- password storage;
- OAuth/OIDC provider configuration;
- session cookies or token issuance;
- MFA implementation;
- production secrets;
- database persistence;
- user onboarding UI;
- email/SMS verification;
- billing;
- deployment;
- public publishing;
- production activation.

## Roles

### CUSTOMER

May access resources they own or that are explicitly licensed/delivered to them.

### ARTIST

May access production materials explicitly shared for an assigned tattoo project. Artist status does not imply access to unrelated customer evidence.

### SHOP

May access shop-scoped projects and assets only where an explicit shop relationship exists.

### ADMIN

Administrative authority is application-scoped and still subject to restricted-evidence policy, audit requirements, and explicit high-risk controls.

### SYSTEM_AI_SERVICE

Service identity used for bounded automated operations. It is not a human role and cannot independently grant itself broader permission, approve tattoo execution, override validation, publish restricted assets, or bypass audit.

## Required invariants

- Authorization defaults to DENY.
- Authentication and authorization are separate concerns.
- A valid identity does not imply permission to a resource.
- Role assignment alone is insufficient for resource access when ownership/relationship checks are required.
- CUSTOMER access is owner/license scoped.
- ARTIST access requires an explicit project assignment or authorized share.
- SHOP access requires an explicit shop-scoped relationship.
- ADMIN does not bypass immutable evidence, audit, privacy, or tattoo-execution controls.
- SYSTEM_AI_SERVICE is capability-bounded and cannot self-elevate.
- RESTRICTED_EVIDENCE requires explicit permission and relationship.
- PRIVATE_DESIGN requires owner/license/project relationship as applicable.
- PUBLIC assets may be readable without private-resource permission only after separate publication approval.
- Signed-delivery authorization is an application decision made before a storage adapter is called.
- Every allow/deny decision produces an audit-correlatable decision record.
- Missing principal, role, permission, relationship, or policy context fails closed.
- Provider/session claims are inputs to authorization, never the final authority themselves.

## Proposed implementation manifest for Phase 1B-I3-I1

Future implementation shall be limited to these exact paths unless scope is explicitly expanded:

1. `packages/domain/src/principals.ts`
2. `packages/domain/src/permissions.ts`
3. `packages/domain/src/authorization.ts`
4. `packages/domain/src/resource-access.ts`
5. `packages/domain/src/service-identity.ts`
6. `packages/domain/src/index.ts`
7. `packages/schemas/src/principals.schema.ts`
8. `packages/schemas/src/authorization.schema.ts`
9. `packages/schemas/src/resource-access.schema.ts`
10. `packages/schemas/src/service-identity.schema.ts`
11. `packages/schemas/src/index.ts`
12. `tests/security/authorization-default-deny.test.ts`
13. `tests/security/resource-access.test.ts`
14. `tests/security/restricted-evidence-access.test.ts`
15. `tests/security/service-identity.test.ts`
16. `docs/architecture/AUTHENTICATION_AUTHORIZATION_BOUNDARIES.md`
17. `docs/decisions/ADR-0006-provider-neutral-authz-boundary.md`

No other source, schema, test, workflow, governance, provider, deployment, or secret-bearing path is authorized by this definition.

## Acceptance criteria for Phase 1B-I3-I1

- Governance validation passes.
- Frozen-lockfile install passes.
- Lint passes.
- TypeScript strict typecheck passes.
- Existing tests remain green.
- Tests prove authorization defaults to DENY.
- Tests prove authenticated identity alone does not grant resource access.
- Tests prove CUSTOMER access is owner/license scoped.
- Tests prove ARTIST access requires explicit project assignment or share.
- Tests prove SHOP access requires explicit shop relationship.
- Tests prove RESTRICTED_EVIDENCE fails closed without explicit permission plus relationship.
- Tests prove SYSTEM_AI_SERVICE cannot self-elevate or grant itself human/admin authority.
- Tests prove signed-delivery authorization must pass before storage capability is invoked.
- Tests prove allow/deny decisions contain audit correlation.
- No auth provider SDK, token issuer, password store, network call, or secret is introduced.
- No production identities or customer data are committed.

## Close condition

Phase 1B-I3 Definition closes only after the exact live baseline, three-path documentation-only change, role model, fail-closed rules, privacy boundary, and future 17-path implementation manifest are independently assured.
