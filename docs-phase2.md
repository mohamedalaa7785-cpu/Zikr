# Phase 2 hardening notes

## Environment classification
- Public: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Server-only secret: `SUPABASE_SERVICE_ROLE_KEY`
- Runtime server required: the two public vars + `SUPABASE_SERVICE_ROLE_KEY` + `DATABASE_URL`
- Scripts-only required: `DATABASE_URL`
- Optional integrations: `QURAN_API_BASE_URL`, `QURAN_AUDIO_CDN_URL`, `HADITH_API_BASE_URL`, `YOUTUBE_API_KEY`, `YOUTUBE_CHANNEL_ID`, `YOUTUBE_PLAYLIST_ID`

## Security hardening applied
- Enforced scripts env validation through `getScriptEnv()`.
- Prevented accidental no-store inheritance on cached server calls by honoring per-call cache options.
- Stabilized auth cookies with `sameSite=lax` and production-only `secure`.
- Fixed password recovery callback to use site URL (`https://zikr.app/auth/callback`) instead of Supabase API origin.

## SEO/runtime stabilization
- Added sitemap revalidation window.
- Changed dynamic sitemap hadith links to prefer `slug` then fallback `id`.
- Enabled cacheable fetch options for scholars/stories in sitemap path.

## Manual Supabase verification checklist (required in dashboard/SQL)
- Confirm RLS enabled on `profiles`, `favorites`, `reading_progress`, `reminders`, `subscriptions`, `payments`.
- Confirm no anon INSERT/UPDATE/DELETE policies on protected tables.
- Confirm admin-only write policies for content tables.
- Confirm indexes exist for high-cardinality lookups (`slug`, `created_at`, FKs).
- Confirm storage bucket policies avoid public writes.
