# LifeCFO decisions

## Implementation plan and decisions

1. Ship a polished synthetic demo that works without external credentials while preserving Supabase interfaces for production.
2. Use Next.js App Router, strict TypeScript, Tailwind CSS, accessible controls, Supabase Auth/Postgres/Storage, and deterministic calculations.
3. Treat all financial output as educational decision support. Keep formula weights, assumptions, uncertainty, and professional-review prompts visible.
4. Automatically create one profile, household, and owner membership after registration.
5. Enforce authorization in Postgres through `is_household_member`; UI visibility is never an access control.
6. Keep statements private, household-path scoped, PDF/CSV-only, limited to 10 MB, and non-authoritative until confirmation.
7. Use an isolated mock extractor in development. It labels all output synthetic.
8. Store immutable snapshots; corrections produce a new snapshot.
9. Keep rate limiting, email, extraction, and observability behind adapters.
10. Build through the workspace's Next-compatible Vinext toolchain; the application can also deploy to Vercel with Supabase environment variables.

Credential-dependent live authentication, uploads, emails, cron, and destructive account deletion require human-owned service configuration.
