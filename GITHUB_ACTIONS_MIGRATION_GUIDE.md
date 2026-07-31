# GitHub Actions Migration Guide

**Vercel Cron to GitHub Actions Migration**  
**Date:** July 31, 2026  
**Status:** ✅ Migration Complete

---

## Overview

This project has been successfully migrated from **Vercel Cron Jobs** to **GitHub Actions**. All background job functionality has been preserved and enhanced with better monitoring and reliability.

---

## What Changed

### Removed (Vercel Cron)
- ❌ `vercel.json` cron configuration
- ❌ `app/api/cron/process-videos/route.ts`
- ❌ `app/api/cron/process-social/route.ts`
- ❌ `CRON_SECRET` environment variable

### Added (GitHub Actions)
- ✅ `.github/workflows/background-jobs.yml` – Main workflow
- ✅ `scripts/jobs/process-videos.ts` – Video processing job
- ✅ `scripts/jobs/process-social.ts` – Social publishing job

---

## Job Schedules

### Video Processing
- **Schedule:** Daily at 3:00 AM UTC (`0 3 * * *`)
- **Function:** Generate videos and publish to YouTube/Facebook
- **Batch Size:** 3 (sequential processing due to HeyGen rate limiting)
- **Timeout:** 15 minutes

```bash
# Manual trigger
gh workflow run background-jobs.yml -f job_type=videos
```

### Social Media Publishing
- **Schedule:** Every 15 minutes (`*/15 * * * *`)
- **Function:** Publish queued social media posts
- **Batch Size:** 10 (parallel processing)
- **Timeout:** 15 minutes

```bash
# Manual trigger
gh workflow run background-jobs.yml -f job_type=social
```

---

## Setup: GitHub Secrets

The workflow requires the following GitHub Secrets to be configured. Navigate to:  
**Settings → Secrets and variables → Actions**

### Required Secrets

| Secret | Description | Example |
|--------|-------------|---------|
| `SUPABASE_URL` | Supabase project URL | `https://project.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-only) | `eyJhbGc...` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db` |
| `NEXT_PUBLIC_SITE_URL` | Public site URL | `https://zikr.vercel.app` |

### Optional Secrets (Video Generation)

| Secret | Description |
|--------|-------------|
| `HEYGEN_API_KEY` | HeyGen API key |
| `HEYGEN_AVATAR_ID` | Avatar ID for video generation |
| `HEYGEN_VOICE_ID` | Voice ID for video generation |
| `YOUTUBE_CLIENT_ID` | YouTube OAuth client ID |
| `YOUTUBE_CLIENT_SECRET` | YouTube OAuth client secret |
| `YOUTUBE_REFRESH_TOKEN` | YouTube refresh token |
| `FACEBOOK_PAGE_ID` | Facebook page ID |
| `FACEBOOK_PAGE_ACCESS_TOKEN` | Facebook page access token |

### Setup Instructions

1. Navigate to your GitHub repository
2. Go to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** for each required variable
4. Name: `SUPABASE_URL`, Value: (your Supabase project URL)
5. Repeat for all required secrets above

---

## Manual Execution

### Using GitHub CLI

```bash
# Trigger both jobs
gh workflow run background-jobs.yml

# Trigger only video processing
gh workflow run background-jobs.yml -f job_type=videos

# Trigger only social publishing
gh workflow run background-jobs.yml -f job_type=social
```

### Using GitHub Web UI

1. Navigate to **Actions** tab
2. Select **Background Jobs** workflow
3. Click **Run workflow** dropdown
4. (Optional) Select job type from dropdown
5. Click **Run workflow**

### Running Locally

```bash
# Install dependencies
pnpm install

# Set environment variables
export SUPABASE_URL="..."
export SUPABASE_SERVICE_ROLE_KEY="..."
# ... set other required vars ...

# Run video processing
pnpm tsx scripts/jobs/process-videos.ts

# Run social publishing
pnpm tsx scripts/jobs/process-social.ts
```

---

## Job Execution Flow

### Video Processing Job

```
1. Validate environment variables
   ↓
2. Fetch pending video requests from Supabase (limit: 3)
   ↓
3. For each request:
   a. Update status to "processing"
   b. Generate video with HeyGen API
   c. Publish to YouTube (if configured)
   d. Publish to Facebook (if configured)
   e. Update status to "completed" or "failed"
   ↓
4. Return results and logs
```

**Database Tables Used:**
- `video_generation_requests` – pending → processing → completed/failed
- `video_publish_log` – publish audit trail
- `videos` – published videos

---

### Social Publishing Job

```
1. Validate environment variables
   ↓
2. Fetch queued social items from Supabase (limit: 10)
   ↓
3. For each item (parallel):
   a. Update status to "processing"
   b. Publish to Facebook (if enabled)
   c. Publish to YouTube (if enabled)
   d. Update status to published/partial/failed
   ↓
4. Return results and logs
```

**Database Tables Used:**
- `social_publish_queue` – queued → processing → published/partial/failed

---

## Monitoring & Alerts

### GitHub Actions Dashboard

1. **Actions** tab → **Background Jobs** workflow
2. View:
   - Run history
   - Execution logs
   - Success/failure status
   - Execution time

### Automatic Failure Alerts

When a job fails, the workflow automatically:
1. Creates a GitHub Issue with details
2. Includes run log link for debugging
3. Lists troubleshooting steps
4. Provides manual retry instructions

To disable automatic issues:
- Edit `.github/workflows/background-jobs.yml`
- Comment out the "Create issue on failure" step

### Manual Status Check

```bash
# List recent workflow runs
gh run list --workflow background-jobs.yml --limit 10

# View specific run details
gh run view <RUN_ID>

# View logs
gh run view <RUN_ID> --log
```

---

## Troubleshooting

### Workflow Won't Run

**Error:** Workflow doesn't appear in Actions tab

**Solution:**
1. Commit changes to repository (workflows require git commit)
2. Workflow must be on the default branch
3. Check branch protection rules aren't blocking actions

---

### Missing Environment Variables Error

**Error:**
```
[process-videos] Missing required environment variables: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
```

**Solution:**
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add all required secrets (see [Setup: GitHub Secrets](#setup-github-secrets))
3. Re-run the workflow

---

### Database Connection Failed

**Error:**
```
Failed to fetch pending requests: connection refused
```

**Solution:**
1. Verify `SUPABASE_URL` is correct
2. Verify `SUPABASE_SERVICE_ROLE_KEY` is valid
3. Check Supabase project is running
4. Test locally first:
   ```bash
   pnpm tsx scripts/jobs/process-videos.ts
   ```

---

### Video Generation Timeout

**Error:**
```
HeyGen generation timed out (video_id=...); will retry on next run
```

**Solution:**
- Normal behavior – workflow will retry on next scheduled run
- Check HeyGen API status: https://status.heygen.com
- Reduce batch size if timeouts persist (edit workflow: `BATCH_SIZE=1`)

---

### Facebook/YouTube Publishing Failed

**Error:**
```
Facebook: Invalid page access token
```

**Solution:**
1. Regenerate access tokens from platform dashboards
2. Update GitHub Secrets with new tokens
3. Verify permissions on platform account
4. Check tokens haven't expired

---

## Comparison: Vercel Cron vs GitHub Actions

| Aspect | Vercel Cron | GitHub Actions |
|--------|------------|----------------|
| **Cost** | Included | Free tier generous (60k min/month) |
| **Observability** | Limited logs | Full run history + logs |
| **Security** | `CRON_SECRET` bearer token | GitHub OIDC tokens |
| **Reliability** | Basic retry | Configurable retry + concurrency control |
| **Latency** | HTTP request | Direct function call |
| **Public Endpoint** | Exposed API | None (private) |
| **Monitoring** | Minimal | Issue creation, GitHub UI, CLI |
| **Scheduling** | Vercel managed | GitHub managed |

---

## Best Practices

### 1. Secrets Management
- ✅ Use GitHub Secrets for all sensitive data
- ✅ Rotate YouTube/Facebook tokens regularly
- ✅ Never commit secrets to repository
- ❌ Don't hardcode API keys in scripts

### 2. Job Execution
- ✅ Monitor GitHub Actions for failures
- ✅ Check logs immediately after failures
- ✅ Test locally before deploying changes
- ✅ Keep batch sizes reasonable for timeouts

### 3. Database State
- ✅ Ensure proper status transitions (pending → processing → completed)
- ✅ Always update status, even on partial failures
- ✅ Use database locks to prevent duplicate processing
- ✅ Log all errors for debugging

### 4. Error Handling
- ✅ Catch all errors and log details
- ✅ Update database status on errors
- ✅ Don't fail silently
- ✅ Include context in error messages

### 5. Monitoring
- ✅ Check workflow runs weekly
- ✅ Review failure alerts immediately
- ✅ Monitor Supabase logs for database issues
- ✅ Track job execution times for performance

---

## Rollback Instructions

If you need to revert to Vercel Cron:

1. **Restore vercel.json:**
   ```json
   {
     "$schema": "https://openapi.vercel.sh/vercel.json",
     "framework": "nextjs",
     "crons": [
       {
         "path": "/api/cron/process-videos",
         "schedule": "0 3 * * *"
       },
       {
         "path": "/api/cron/process-social",
         "schedule": "*/15 * * * *"
       }
     ]
   }
   ```

2. **Restore API routes:** Copy route files back to:
   - `app/api/cron/process-videos/route.ts`
   - `app/api/cron/process-social/route.ts`

3. **Restore environment variable:**
   - Add `CRON_SECRET` to `.env.example`
   - Add to production environment

4. **Disable GitHub Actions:** Delete or disable `.github/workflows/background-jobs.yml`

5. **Deploy:** Push changes to Vercel

---

## Testing Checklist

- [ ] All GitHub Secrets are configured
- [ ] Workflow runs successfully manually
- [ ] Video processing logs show pending requests
- [ ] Social publishing logs show queued items
- [ ] Database status updates correctly
- [ ] No errors in workflow logs
- [ ] Failure alerts work (if enabled)
- [ ] Manual retry works
- [ ] Scheduled runs execute at correct times

---

## Support

For issues or questions:

1. **Check logs first:** GitHub Actions → Background Jobs → Workflow run
2. **Review troubleshooting:** See section above
3. **Test locally:** Run job script locally with same env vars
4. **Check GitHub Issues:** Automatic failure alerts created
5. **Contact:** Verify job configuration in workflow file

---

## Additional Resources

- **GitHub Actions Documentation:** https://docs.github.com/en/actions
- **Workflow Syntax:** https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions
- **Secrets Management:** https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions
- **GitHub CLI Reference:** https://cli.github.com/manual/gh_workflow_run

---

**Last Updated:** July 31, 2026  
**Next Review:** August 31, 2026
