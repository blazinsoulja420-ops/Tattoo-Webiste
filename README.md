# Tattoo Platform v2

Tattoo Platform v2 is a governed AI-assisted tattoo design and production-preparation platform.

## Foundation status

This repository is in **Phase 1A — Canonical Repository Bootstrap**.

The foundation establishes:

- a Next.js web shell;
- canonical tattoo domain models;
- FTA / ACR / TRS production contracts;
- tattoo lifecycle state transitions;
- cover-up evidence constraints;
- Zod validation schemas;
- governance and CI gates.

## Core production rule

Every production-capable tattoo must derive from one canonical locked design and produce synchronized:

- **FTA** — Finished Tattoo Artwork
- **ACR** — Artist Construction Reference, visually hand-drawn
- **TRS** — Transfer-Ready Stencil

Material geometry drift between outputs is fail-closed.

## Local setup

```bash
corepack enable
pnpm install
pnpm typecheck
pnpm test
pnpm build
pnpm dev
```

## Important boundary

AI output is not independent authorization to tattoo. Tattoo execution, cover-up feasibility, transfer fit, and production approval remain subject to qualified tattoo-artist review.
