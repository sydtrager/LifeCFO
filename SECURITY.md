# Security

- RLS is enabled for every application table with explicit operation policies.
- Household isolation uses a stable security-definer membership function with a fixed search path.
- Browser clients use only the Supabase publishable key.
- The `financial-statements` bucket is private, limited to PDF/CSV and 10 MB, and household-path scoped.
- Account identifiers are constrained to four masked characters. Never request government identifiers, bank credentials, tax-account credentials, or full card numbers.
- Sensitive logger keys are redacted. Audit metadata must not contain balances, document content, or raw form payloads.
- Reminder messages are neutral and contain no financial details.
- Account deletion requires two confirmations, recent reauthentication, an audit record, and a server-side admin deletion job.

Before production: enable leaked-password protection and operator MFA, configure CAPTCHA/rate limiting, rotate secrets, set exact redirect URLs, add CSP/security headers, run Supabase advisors, and test RLS against a real local project.
