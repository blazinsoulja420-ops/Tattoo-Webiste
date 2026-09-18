# Authentication and Authorization Boundaries — Phase 1B-I3

## Implementation status

Phase 1B-I3-I1 implements the provider-neutral contract layer for canonical principals, roles, permissions, resource relationships, fail-closed authorization decisions, signed-delivery authorization, bounded service identities, and audit correlation.

No concrete authentication provider, token issuer, password store, MFA system, session framework, database, or production identity integration is active.

## Authentication boundary

Authentication answers who or what is making the request.

The canonical Principal contract contains:

- principal ID;
- assigned role set;
- authenticated flag;
- optional authentication context.

Future provider claims are inputs only. They do not directly grant application access.

## Role model

Supported roles are:

- CUSTOMER
- ARTIST
- SHOP
- ADMIN
- SYSTEM_AI_SERVICE

A principal may have multiple roles, except a ServiceIdentity which is constrained to SYSTEM_AI_SERVICE only.

## Permission policy

The implemented permission set includes:

- DESIGN_READ
- DESIGN_EDIT
- PRODUCTION_ASSET_READ
- RESTRICTED_EVIDENCE_READ
- ARTIST_REVIEW_WRITE
- LICENSE_READ
- SIGNED_DELIVERY_REQUEST
- SHOP_PROJECT_READ
- ADMIN_AUDIT_READ
- SYSTEM_JOB_EXECUTE

Role permission mappings are explicit and least-privilege oriented.

Permission possession alone is not sufficient where resource relationships are required.

## Resource relationships

Implemented relationships are:

- OWNER
- LICENSEE
- ASSIGNED_ARTIST
- SHOP_PROJECT_MEMBER
- EXPLICIT_SHARE
- ADMINISTRATIVE_SCOPE
- SYSTEM_JOB_SCOPE

Access checks combine role permission plus relationship evidence.

Examples:

- CUSTOMER: OWNER or LICENSEE
- ARTIST: ASSIGNED_ARTIST or EXPLICIT_SHARE
- SHOP: SHOP_PROJECT_MEMBER
- ADMIN: ADMINISTRATIVE_SCOPE
- SYSTEM_AI_SERVICE: SYSTEM_JOB_SCOPE

## Default-deny evaluator

The authorize() evaluator returns ALLOW or DENY.

It denies when:

- audit correlation is absent;
- principal or resource context is absent;
- principal is not authenticated/valid;
- required permission is missing;
- required resource relationship is missing;
- RESTRICTED_EVIDENCE is requested without RESTRICTED_EVIDENCE_READ;
- SYSTEM_AI_SERVICE attempts restricted-evidence access by role alone.

Every result contains an audit correlation ID and a human-readable reason.

## Asset-class policy

### PUBLIC

A PUBLIC resource relationship succeeds only when publicationApproved is true. The authorization layer does not itself publish assets.

### PRIVATE_DESIGN

Requires a qualifying ownership, license, project, share, administrative, or bounded system relationship according to the requesting role.

### RESTRICTED_EVIDENCE

Requires the explicit RESTRICTED_EVIDENCE_READ permission plus an authorized relationship.

Authentication, staff status, ADMIN role alone, or SYSTEM_AI_SERVICE role alone is insufficient.

## Signed-delivery authorization

createAuthorizedDeliveryRequest() accepts only an ALLOW decision for SIGNED_DELIVERY_REQUEST.

The decision must match:

- principal ID;
- asset/resource ID;
- security class;
- audit correlation.

Only after those checks may the application create an AuthorizedDeliveryRequest for the CAPABILITY_ONLY storage boundary.

## Service identity

ServiceIdentity is constrained to:

- role SYSTEM_AI_SERVICE only;
- authority CAPABILITY_ONLY;
- explicitly granted machine permissions.

The contract rejects human/admin-oriented service permissions such as ADMIN_AUDIT_READ, ARTIST_REVIEW_WRITE, and RESTRICTED_EVIDENCE_READ.

The service identity cannot grant roles to itself or others.

## Admin boundary

ADMIN is not a universal access bypass.

Administrative resource access requires ADMINISTRATIVE_SCOPE and remains subject to:

- explicit permission;
- restricted-evidence controls;
- audit correlation;
- privacy rules;
- separate tattoo-execution authority.

## Audit linkage

Every authorization decision includes auditCorrelationId.

ALLOW and DENY outcomes can therefore be converted into append-only AuditEvent records by a later application layer.

## Provider neutrality

No Auth0, Clerk, Supabase Auth, Firebase Auth, Cognito, OAuth/OIDC provider, token issuer, password system, or session implementation exists in this phase.

A future identity adapter must map its authenticated identity into the canonical Principal contract and must pass the same default-deny and relationship-aware tests.

## Phase 1B-I3-I1 completion evidence

Completion requires:

- governance validation;
- frozen-lockfile installation;
- lint;
- TypeScript strict typecheck;
- all existing tests;
- new authorization/resource/restricted-evidence/service-identity tests;
- Next.js build.
