# Vercel Cron to GitHub Actions Audit

## Existing Vercel Cron configuration

`vercel.json` contained two cron entries:

- `/api/cron/process-videos` scheduled at `0 3 * * *`.
- `/api/cron/process-social` scheduled at `*/15 * * * *`.

## Scheduled API routes

- `app/api/cron/process-videos/route.ts` processed up to 3 pending video generation requests.
- `app/api/cron/process-social/route.ts` processed up to 10 due social publishing items.

## Background job services

- `lib/services/video-automation.ts` owns video request creation, queue reads, status updates, HeyGen generation, site publishing, YouTube publishing, Facebook publishing, and publish logging.
- `lib/services/social-publishing.ts` owns social queue reads, status updates, Facebook publishing, YouTube publishing, and result metadata.

## Vercel Cron references removed

- `vercel.json` `crons` block.
- `/api/cron` route directory.
- `CRON_SECRET` from `.env.example`, `lib/env.ts`, and `scripts/validate-deployment-env.mjs`.

## GitHub Actions replacement

`.github/workflows/background-jobs.yml` runs `scripts/run-background-jobs.ts` on `workflow_dispatch`, every 15 minutes, and daily at 03:00 UTC. The script reuses existing services and adds optimistic row claiming so duplicate processing is prevented.
