# LifeCFO

**Your world-class personal CFO.**

LifeCFO is a calm, transparent financial organization, education, planning, and decision-support application. This Version 1 repository contains a polished synthetic household demo, deterministic health and recommendation engines, a normalized Supabase schema, explicit RLS/storage policies, scheduling and extraction interfaces, tests, and deployment configuration.

LifeCFO does not execute trades, move money, or provide individualized legal, tax, insurance, fiduciary, or regulated investment advice.

## Run locally

Requirements: Node 22+, pnpm 11+, Docker (for local Supabase), and the Supabase CLI.

```bash
cp .env.example .env.local
pnpm install
pnpm dev
```

Open `http://localhost:3000` for the landing page or `/dashboard` for the credential-free synthetic demo.

## Supabase setup

1. Create a Supabase project or run `pnpm db:start`.
2. Copy the local/project URL and publishable key to `.env.local`.
3. Apply `supabase/migrations/202607240001_lifecfo.sql` with `pnpm db:reset` locally or `supabase db push` remotely.
4. Confirm the `financial-statements` bucket is private.
5. In Auth URL Configuration, set the site URL and allowed callback URLs exactly.
6. Configure SMTP for production email verification and password reset.
7. Deploy `generate-scheduled-reviews`, set `CRON_SECRET`, and schedule it through Supabase Cron with an authenticated request.
8. For Google OAuth, configure the Google provider and its redirect URI in Supabase; no code change is required.

The registration trigger creates the profile, household, and owner membership atomically. Legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` names are compatibility aliases only; prefer the current publishable and secret key names.

## Commands

```bash
pnpm dev                 # local app
pnpm build               # production build
pnpm lint                # lint
pnpm typecheck           # strict TypeScript
pnpm test                # unit + migration contract tests
pnpm test:integration    # integration contracts
pnpm test:e2e            # essential Playwright flows
pnpm verify              # lint, types, tests, build
pnpm db:start            # local Supabase
pnpm db:reset            # migrate and seed
```

## Environment

See `.env.example`. Required for live mode: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `NEXT_PUBLIC_APP_URL`. Server-only scheduled/admin features need `SUPABASE_SECRET_KEY`. Resend, OpenAI document AI, and Sentry are optional and disabled without credentials.

## Deployment

### Vercel

Import the repository, add environment variables, select the Next.js preset, and deploy. Add the production URL to Supabase Auth allowed redirects. Never expose `SUPABASE_SECRET_KEY`.

### Sites

The repository retains the workspace hosting configuration and a Cloudflare-compatible Vinext build. Build, package, save a version, and deploy through Sites.

## Testing and troubleshooting

- If fonts cannot download, allow access to Google Fonts or replace them with system fonts.
- If auth redirects fail, compare the exact protocol, hostname, and callback path in Supabase.
- If records are empty despite successful writes, verify the user has an authenticated `household_members` row.
- If uploads fail, verify MIME type, 10 MB size limit, bucket privacy, and the household UUID path prefix.
- Playwright browser binaries may require `pnpm exec playwright install chromium`.
- Full live integration tests require Docker and a running local Supabase stack.

## Production readiness

- [x] Strict TypeScript, lint/test/build scripts
- [x] Explicit RLS for all CRUD operations and private storage policies
- [x] Deterministic score/recommendation formulas with tests
- [x] Redaction, audit, rate-limit, extraction, and scheduled-review foundations
- [x] Public legal/security/disclaimer pages and in-product boundary
- [ ] Insert the operating legal entity and privacy contact
- [ ] Configure human-owned Supabase, SMTP/Resend, domain, and optional Sentry accounts
- [ ] Run live RLS and E2E tests against staging
- [ ] Complete external security/privacy review before handling real financial data

## Current limitations

The hosted demo uses synthetic in-app data. Live credential-dependent Auth, CRUD, uploads, notifications, export, and deletion admin execution are represented by production schema/interfaces but require a configured Supabase project and additional server actions. PDF extraction is intentionally a clearly labeled development mock. No external email is sent without Resend credentials.

See `ARCHITECTURE.md`, `SECURITY.md`, `DATA_MODEL.md`, and `DECISIONS.md`.
