# Authentication and Authorization Boundaries — Phase 1B-I3 Design

## Purpose

Tattoo Platform v2 needs identity and authorization semantics before a concrete authentication provider is selected.

The domain must decide whether an action is allowed. An authentication provider may prove or assert identity, but it does not own application authorization.

## Authentication boundary

Authentication answers:

> Who or what is making the request?

Future provider claims may contribute:

- principal ID;
- authentication assurance level;
- provider subject ID;
- verified email/phone flags;
- service identity;
- session metadata.

Those claims are inputs only.

## Authorization boundary

Authorization answers:

> May this principal perform this action on this resource in this context?

Every decision is fail-closed and returns an explicit ALLOW or DENY result with:

- principal ID;
- requested permission/action;
- resource type and ID;
- resource security class where applicable;
- relationship evidence;
- decision reason;
- audit correlation ID;
- timestamp.

Missing required context results in DENY.

## Role model

Supported roles are:

- CUSTOMER
- ARTIST
- SHOP
- ADMIN
- SYSTEM_AI_SERVICE

A principal may have one or more assigned roles, but role membership is not sufficient by itself when resource ownership or project relationship is required.

## Least-privilege policy

Permissions are explicit capabilities such as:

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

The implementation phase may refine the exact permission enumeration while staying within this boundary.

## Resource relationships

Authorization may depend on relationships such as:

- OWNER
- LICENSEE
- ASSIGNED_ARTIST
- SHOP_PROJECT_MEMBER
- EXPLICIT_SHARE
- ADMINISTRATIVE_SCOPE
- SYSTEM_JOB_SCOPE

Relationships must be explicit and auditable.

## Asset-class policy

### PUBLIC

Readability may be broad only after an independent publication approval exists. Public classification itself is not created by the authorization layer.

### PRIVATE_DESIGN

Requires an ownership, license, assigned-project, authorized-share, or bounded administrative relationship appropriate to the requested permission.

### RESTRICTED_EVIDENCE

Requires explicit permission plus an authorized relationship. Authentication alone, generic staff status, or SYSTEM_AI_SERVICE identity is insufficient.

## Signed-delivery authorization

The application performs authorization before creating an AuthorizedDeliveryRequest.

The storage adapter remains CAPABILITY_ONLY and may only consume an already-authorized request.

The authorization decision must match:

- asset ID;
- security class;
- requesting principal;
- permitted purpose;
- audit correlation.

## Service identity

SYSTEM_AI_SERVICE represents automated application capability.

It may receive narrow machine permissions such as executing a generation or validation job.

It may not:

- impersonate CUSTOMER, ARTIST, SHOP, or ADMIN;
- assign its own roles;
- grant itself permissions;
- authorize tattoo execution;
- override failed validation;
- publish restricted/private assets;
- access RESTRICTED_EVIDENCE without explicit bounded authorization;
- bypass audit.

## Admin boundary

ADMIN is not a universal privacy bypass.

Administrative access remains:

- purpose-bound;
- auditable;
- least-privilege;
- constrained by restricted-evidence policy;
- separate from tattoo execution approval.

## Audit linkage

Every authorization decision includes an audit correlation ID so the application can append an AuditEvent.

DENY decisions are first-class auditable outcomes.

## Provider neutrality

This design does not select Auth0, Clerk, Supabase Auth, Firebase Auth, Cognito, or another identity provider.

Provider adapters must map authenticated identity into the canonical principal contract and may not bypass the authorization evaluator.
