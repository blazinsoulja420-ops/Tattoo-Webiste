# Deployment Baseline

Provisional architecture:

- web frontend: Vercel candidate;
- database/auth/storage: Supabase candidate;
- heavy AI/image jobs: separate background worker runtime;
- CI: GitHub Actions.

No provider is final until security, cost, queue, storage, and workload requirements are validated. Production activation is not authorized by this document.
