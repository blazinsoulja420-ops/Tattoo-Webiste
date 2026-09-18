# ADR-0001 — Foundation Stack

## Decision

Use a pnpm/Turborepo TypeScript monorepo with a Next.js web application and provider-independent domain packages.

## Rationale

This keeps the initial deployment surface small while preserving separable customer, artist, shop, admin, worker, storage, and AI-provider concerns.
