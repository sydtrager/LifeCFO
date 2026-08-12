# LifeCFO agent conventions

- Keep TypeScript strict and prefer Server Components. Use Client Components only for interaction.
- All financial math belongs in `lib/` and requires deterministic tests.
- Every household-scoped table needs explicit SELECT, INSERT, UPDATE, and DELETE RLS policies.
- Never expose elevated Supabase keys to browser code or log financial values/documents.
- Frame financial output as educational planning support. Display the disclaimer on relevant screens.
- Documents remain private and unconfirmed extraction results never become authoritative.
- Preserve the warm-neutral, ink, green, amber design system and accessible focus behavior.
