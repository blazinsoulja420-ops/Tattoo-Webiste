# Job and Provenance Contracts — Phase 1B Design

## Job model

Long-running AI and image work is asynchronous.

The web application creates a provider-neutral job request and does not directly execute heavy generation work inside the request lifecycle.

Required conceptual job states:

`QUEUED → CLAIMED → RUNNING → SUCCEEDED | FAILED | CANCELLED`

A job may not advance directly from QUEUED to SUCCEEDED.

## Job categories

- CONCEPT_GENERATION
- CONTROLLED_EDIT
- FTA_RENDER
- ACR_RENDER
- TRS_RENDER
- PRODUCTION_VALIDATION
- COVERUP_ANALYSIS (reserved; not implemented in Phase 1B-I1)
- SIMILARITY_CHECK (reserved; not implemented in Phase 1B-I1)

## Canonical-design requirement

FTA_RENDER, ACR_RENDER, and TRS_RENDER require:

- Design ID
- Revision ID
- canonical lock = true
- canonical geometry fingerprint
- canonical composition fingerprint

Jobs must reject stale or mismatched revision identifiers.

## Asset contract

Every generated artifact records:

- asset ID;
- Design ID;
- Revision ID;
- output kind;
- security class;
- content hash;
- canonical geometry fingerprint where applicable;
- MIME type;
- byte length;
- pixel dimensions when raster;
- physical dimensions when transfer-oriented;
- created timestamp;
- provenance record ID.

Allowed security classes remain:

- PUBLIC
- PRIVATE_DESIGN
- RESTRICTED_EVIDENCE

FTA, ACR, and TRS default to PRIVATE_DESIGN.

## Provenance contract

Each derivative records:

- provider adapter identity;
- provider model identifier if available;
- operation type;
- source asset IDs;
- parent revision;
- prompt/specification digest;
- parameter digest;
- output asset ID;
- creation timestamp.

Provenance is append-only at the domain level. A newer record may supersede an older record but does not overwrite it.

## Validation contract

Generation and validation are separate responsibilities.

A validation result contains:

- validator identity;
- target Design ID / Revision ID;
- target output IDs;
- findings;
- severity;
- pass/fail disposition;
- evidence references;
- timestamp.

At minimum, production validation checks:

- Design ID alignment;
- Revision ID alignment;
- geometry fingerprint alignment;
- presence of FTA / ACR / TRS;
- ACR hand-drawn presentation requirement;
- TRS physical dimensions;
- private-asset classification;
- cover-up evidence restrictions when applicable.

A failed production validation blocks progression to ARTIST_REVIEW.

## Provider boundary

Provider adapters expose capabilities only.

They do not:

- change the design lifecycle state;
- approve tattoo execution;
- grant release or deployment authority;
- publish assets;
- issue licenses;
- override validation failures.

These actions remain controlled by application/domain authority.
