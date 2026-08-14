# Background Queue Recovery

GitHub-hosted runners are currently unavailable for this account because GitHub reports an account-level billing lock. Consequently, `.github/workflows/background-jobs.yml` is **manual-only** and must not be treated as a production scheduler.

The workflow remains a controlled recovery tool for the existing queue processors:

| Queue                       | Current owner                      | Why it is not automatic today                                                                              |
| --------------------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `social_publish_queue`      | Manual GitHub recovery workflow    | Publishing requires social-provider credentials and external API side effects.                             |
| `video_generation_requests` | Manual GitHub recovery workflow    | HeyGen polling, media publishing, and YouTube upload can exceed a short serverless job budget.             |
| Prayer Web Push             | Supabase `pg_cron` + Edge Function | This is the only active automatic scheduler; see [`production-scheduling.md`](./production-scheduling.md). |

## Manual recovery

1. Open **GitHub → Actions → Background Jobs**.
2. Select **Run workflow** and choose `social`, `videos`, or `all`.
3. Confirm the required repository secrets exist before running.
4. Review queue row status and provider-side results afterward.

The worker validates the core Supabase configuration before processing. Social/video provider secrets remain optional because they are required only for the queue types that call those providers.

## Do not create duplicate schedulers

Do not restore a GitHub cron trigger, Vercel Cron endpoint, or another database cron schedule for a queue until its single authoritative owner, credentials, retry behavior, and idempotent claims have been verified. Re-enabling the legacy GitHub schedule while a replacement is active risks duplicate external publishing.

## Future migration criteria

A queue may move to Supabase Edge Functions only after its provider credentials are available in the Supabase secret store, its complete execution fits Edge Function limits, and its external side effects have an idempotent delivery design. The video and social paths do not currently meet those conditions in the configured environment, so they are intentionally not moved speculatively.
