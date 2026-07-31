# Background Jobs Migration

ZIKR no longer uses Vercel Cron Jobs. Scheduled production background processing now runs from GitHub Actions in `.github/workflows/background-jobs.yml`.

## Why Vercel Cron was removed

The project had two production cron endpoints under `/api/cron/*`. Moving scheduling to GitHub Actions removes public cron API routes and centralizes schedule logs, permissions, concurrency, retries, and manual operations in GitHub.

## What GitHub Actions runs

The workflow invokes `scripts/run-background-jobs.ts`, which reuses the existing service layer instead of duplicating business logic:

- Video automation: claims pending `video_generation_requests`, processes generation, publishes configured channels, and updates status.
- Social publishing: claims due `social_publish_queue` rows, publishes to configured platforms, and updates status.

Rows are claimed with conditional Supabase updates before external side effects, preventing duplicate processing when workflows overlap.

## Schedule

- Every 15 minutes: checks the social publishing queue.
- Daily at 03:00 UTC: preserves the former video automation check time.

Both schedules execute the same runner. Empty queues exit successfully.

## Required GitHub Secrets

Set these repository or environment secrets in GitHub Actions:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL`

Optional integration secrets used when relevant jobs publish externally:

- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `HEYGEN_API_KEY`
- `HEYGEN_AVATAR_ID`
- `HEYGEN_VOICE_ID`
- `YOUTUBE_CLIENT_ID`
- `YOUTUBE_CLIENT_SECRET`
- `YOUTUBE_REFRESH_TOKEN`
- `YOUTUBE_CHANNEL_ID`
- `FACEBOOK_PAGE_ACCESS_TOKEN`
- `FACEBOOK_PAGE_ID`

Missing required secrets fail the workflow immediately before queue processing starts.

## Manual execution

1. Open GitHub → Actions → Background Jobs.
2. Select **Run workflow**.
3. Choose the production branch and run.
4. Review the summary logs for processed, succeeded, and failed item counts.

## Troubleshooting

- **Missing secret failure:** add the named secret in GitHub repository settings and rerun.
- **Supabase REST error:** verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` point to the production project.
- **Video generation failure:** verify HeyGen credentials and inspect `video_generation_requests.error_message` / `error_details`.
- **YouTube publishing skipped or failed:** verify OAuth client credentials and refresh token.
- **Facebook publishing failed:** verify page ID and page access token scopes.
- **Workflow overlap:** concurrency is configured with `cancel-in-progress: false`; the later run waits instead of racing.

## Rollback instructions

1. Revert the migration commit.
2. Restore the deleted `/api/cron/*` routes and `vercel.json` cron entries.
3. Restore the `CRON_SECRET` environment variable in production.
4. Redeploy and confirm Vercel Cron invokes the endpoints.

Prefer fixing the GitHub Actions runner over rollback unless production processing is blocked.
