# Zikr Media Launch Checklist

Use this checklist to prepare the project for production without committing secrets. Keep real credentials only in local `.env.local`, Vercel Environment Variables, Supabase dashboard settings, and GitHub Actions secrets.

## 1. Local environment

1. Copy the template:

   ```bash
   cp .env.example .env.local
   ```

2. Fill `.env.local` with project-specific values:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DATABASE_URL`
   - `NEXT_PUBLIC_SITE_URL`
   - Optional OAuth and integration keys such as `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GEMINI_API_KEY`, `HEYGEN_API_KEY`, and YouTube credentials.

3. Validate the local deployment configuration:

   ```bash
   pnpm deploy:check
   ```

## 2. Database readiness

1. Confirm Supabase connectivity with the values from `.env.local`.
2. Apply the consolidated migration:

   ```bash
   pnpm db:migrate:supabase
   ```

3. Verify migration status:

   ```bash
   pnpm dlx supabase migration list
   ```

4. Confirm the expected tables are present and protected by RLS policies:
   - `users`, `profiles`, `quran_chapters`, `verses`
   - `hadith_books`, `hadith_collection`, `duas`
   - `videos`, `video_generation_requests`
   - `social_publish_queue`

## 3. Vercel configuration

Add these variables in Vercel Dashboard → Settings → Environment Variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`
- `NEXT_PUBLIC_SITE_URL`
- Optional integration variables required for enabled features.

After saving the variables, trigger a deployment and review the build logs.

## 4. GitHub Actions configuration

Add these secrets in Repository → Settings → Secrets and variables → Actions:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`
- `NEXT_PUBLIC_SITE_URL`
- Optional: `HEYGEN_API_KEY`, `YOUTUBE_CLIENT_ID`, and other integration secrets used by workflows.

Verify workflows are available and run the background jobs workflow manually when appropriate:

```bash
gh workflow list
gh workflow run background-jobs.yml
```

## 5. Production smoke tests

Manually verify the primary routes after deployment:

- `/` loads the home banner and sections.
- `/quran` lists surahs.
- `/quran/1` displays verses.
- `/hadith` lists hadith books.
- `/dua` lists duas.
- `/profile` requires authentication when signed out.
- `/search` searches content.
- `/settings` loads settings.

Run API and application checks:

```bash
pnpm lint
pnpm check
pnpm build
pnpm launch:smoke
curl -H "Authorization: Bearer $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/quran_chapters?limit=1"
```

## 6. Security and performance gate

Before launch, confirm:

- HTTPS is enabled for all public pages.
- Browser console has no unexpected errors.
- RLS policies block private data access for anonymous users.
- No server-only values appear in browser bundles, logs, screenshots, or committed files.
- Lighthouse scores are at least 90 for Performance, Accessibility, Best Practices, and SEO.
- Offline mode behaves as expected.

> Note: `pnpm launch:smoke` intentionally checks only public routes and anon-key Supabase reads. Keep service-role and database credentials out of browser-side smoke tests.
