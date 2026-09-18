# Job and Provenance Contracts — Phase 1B Design

## Implementation status

Phase 1B-I1 implements the provider-neutral contract layer defined here. No live provider, storage, database, payment, deployment, or publishing integration is active.

## Job model

Long-running AI and image work is asynchronous.

The web application creates a provider-neutral job request and does not directly execute heavy generation work inside the request lifecycle.

Required job states:

`QUEUED → CLAIMED → RUNNING → SUCCEEDED | FAILED | CANCELLED`

Direct `QUEUED → SUCCEEDED` progression is prohibited.

## Job categories

Implemented contract categories:

- CONCEPT_GENERATION
- CONTROLLED_EDIT
- FTA_RENDER
- ACR_RENDER
- TRS_RENDER
- PRODUCTION_VALIDATION

Reserved for later phases:

- COVERUP_ANALYSIS
- SIMILARITY_CHECK

## Canonical-design gate

FTA_RENDER, ACR_RENDER, and TRS_RENDER require:

- matching Design ID;
- matching Revision ID;
- canonical lock = true;
- matching canonical geometry fingerprint;
- matching canonical composition fingerprint.

Render eligibility fails closed on stale or mismatched canonical identity.

## Asset contract

Every generated artifact records identity, revision, security class, content hash, media metadata, provenance identity, and geometry/physical metadata where applicable.

Allowed security classes:

- PUBLIC
- PRIVATE_DESIGN
- RESTRICTED_EVIDENCE

FTA, ACR, and TRS must remain PRIVATE_DESIGN.

A COVERUP_ORIGINAL must remain RESTRICTED_EVIDENCE and immutable.

## Provenance contract

Derivative records preserve:

- provider adapter identity;
- model identity when available;
- operation type;
- source asset IDs;
- parent revision when applicable;
- prompt/specification digest when applicable;
- parameter digest when applicable;
- output asset ID;
- supersession lineage;
- creation timestamp.

Derivative operations require source-asset or parent-revision lineage. A record may supersede another record but cannot overwrite history or supersede itself.

## Validation contract

Generation and validation are separate responsibilities.

Production validation checks:

- FTA / ACR / TRS presence;
- Design ID alignment;
- Revision ID alignment;
- canonical geometry alignment;
- ACR hand-drawn requirement;
- TRS positive physical dimensions;
- private production-asset classification.

Any ERROR finding makes the validation result fail.

Only a passing independent production-validation result permits progression to ARTIST_REVIEW.

## Provider boundary

Provider adapters expose capabilities only and carry the explicit authority marker:

`CAPABILITY_ONLY`

They do not:

- change the design lifecycle state;
- approve tattoo execution;
- grant release or deployment authority;
- publish assets;
- issue licenses;
- override validation failures.

Application/domain authority remains separate from provider capability.

## Phase 1B-I1 evidence target

The contract layer is complete only when governance validation, frozen-lockfile installation, lint, TypeScript strict typecheck, existing Phase 1A tests, new job/provenance/validation tests, and the Next.js build all pass.
