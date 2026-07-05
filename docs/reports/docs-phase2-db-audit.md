# Phase 2.2/2.3/2.4 execution notes (DB + RLS)

## What was executed in this environment
- Prepared a **non-destructive live-audit runner**: `scripts/audit-db.mjs`.
- The runner queries `information_schema`, `pg_catalog`, `pg_indexes`, `pg_constraint`, `pg_policies` and RLS metadata.
- Added integrity checks for:
  - orphan user-owned rows (`favorites`, `reading_progress`, `reminders`)
  - duplicate slugs (`scholars`, `stories`)
  - duplicate keys (`hadiths(book_id,hadith_number)`, `quran_ayahs(surah_id,ayah_number)`)

## Why full live execution is blocked here
- This runtime does **not** contain `DATABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`.
- Only anon/public keys are present, which cannot run SQL catalog audits safely.

## Required command in deployment/ops environment
Run from the same commit with secure env injected:

```bash
DATABASE_URL='postgres://...' node scripts/audit-db.mjs
```

## Required review outputs from audit
- Tables/columns/indexes/constraints/triggers/functions/extensions list
- RLS enabled matrix + full policy list
- Orphan/duplicate integrity checks (must be zero)

## Drift/sync guidance
If drift is detected between live DB and `drizzle/schema.ts`:
1. Add an **additive corrective migration** under `supabase/migrations/`.
2. Avoid drops/resets.
3. Re-run `scripts/audit-db.mjs` and confirm integrity.

## RLS hardening criteria to enforce
- anon: read-only on approved content, no writes on user/private tables
- authenticated: owner-only access on user data
- admin-only writes on managed content
- storage writes restricted to admin policy scope
