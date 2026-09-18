# Architecture Baseline

- `apps/web` — Next.js application shell.
- `packages/domain` — provider-independent canonical business rules.
- `packages/schemas` — runtime validation contracts.
- future `services/*` — asynchronous generation, production, validation, and cover-up workers.

The canonical design is the source of geometry truth. FTA, ACR, and TRS are derivatives and must not be independently invented.

Heavy AI/image work must execute through background jobs rather than a synchronous web request lifecycle.
