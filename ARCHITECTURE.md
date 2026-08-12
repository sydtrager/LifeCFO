# Architecture

LifeCFO is a Next.js App Router application. Server-rendered public and legal pages surround a focused interactive dashboard Client Component. Deterministic domain calculations live in `lib/finance.ts`. Supabase provides authentication, relational storage, private object storage, and authorization.

The database is the trust boundary. Every household record carries `household_id`; RLS resolves access through authenticated membership. Elevated credentials are reserved for server or Edge Function environments. Storage keys begin `{household_id}/{year}/{upload_id}/{sanitized_filename}`.

External capabilities use adapters: document extraction, rate limiting, email, and optional observability. Core recommendations and health scores never require an AI API.
