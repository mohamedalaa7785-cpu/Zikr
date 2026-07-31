# Quick Start: GitHub Actions Background Jobs

**TL;DR** – Get background jobs running in 5 minutes ⚡

---

## What This Is

ZIKR's background jobs (video processing + social publishing) have been moved from **Vercel Cron** to **GitHub Actions**.

**No user-facing changes.** Everything works the same. Just better monitoring.

---

## 5-Minute Setup

### 1. Add GitHub Secrets (2 minutes)

Go to: **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add these 4 secrets:

| Name | Value | Example |
|------|-------|---------|
| `SUPABASE_URL` | Your Supabase URL | `https://project.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key | `eyJhbGc...` |
| `DATABASE_URL` | PostgreSQL connection | `postgresql://...` |
| `NEXT_PUBLIC_SITE_URL` | Your site URL | `https://zikr.vercel.app` |

**If you're adding video generation/social publishing support, also add:**

```
HEYGEN_API_KEY=...
HEYGEN_AVATAR_ID=...
HEYGEN_VOICE_ID=...
YOUTUBE_CLIENT_ID=...
YOUTUBE_CLIENT_SECRET=...
YOUTUBE_REFRESH_TOKEN=...
FACEBOOK_PAGE_ID=...
FACEBOOK_PAGE_ACCESS_TOKEN=...
```

### 2. That's It! (0 minutes)

The workflow is automatically enabled. Jobs run on schedule:
- **Video processing:** Daily at 3 AM UTC
- **Social publishing:** Every 15 minutes

---

## Test It

### Option A: GitHub CLI (1 command)
```bash
gh workflow run background-jobs.yml
```

### Option B: GitHub Web UI
1. **Actions** tab
2. **Background Jobs** workflow
3. **Run workflow** button

### Option C: Local Testing
```bash
export SUPABASE_URL="..."
export SUPABASE_SERVICE_ROLE_KEY="..."
export DATABASE_URL="..."
export NEXT_PUBLIC_SITE_URL="https://zikr.vercel.app"
export HEYGEN_API_KEY="..."
export HEYGEN_AVATAR_ID="..."
export HEYGEN_VOICE_ID="..."

pnpm tsx scripts/jobs/process-videos.ts
pnpm tsx scripts/jobs/process-social.ts
```

---

## Monitor Executions

### GitHub Actions Dashboard
**Actions** tab → **Background Jobs** → View runs

### Recent Runs
```bash
gh run list --workflow background-jobs.yml --limit 10
```

### View Logs
```bash
gh run view <RUN_ID> --log
```

---

## If Something Breaks

### No secrets configured?
**Error:** `Missing required environment variables`

**Fix:** Add GitHub Secrets (see setup above)

### Can't connect to database?
**Error:** `Failed to fetch pending requests`

**Fix:** Verify `DATABASE_URL` is correct

### 15-minute social job keeps timing out?
**Normal** – External API delays

**Solution:** Reduces happen automatically on next run

---

## Key Files

| File | Purpose |
|------|---------|
| `.github/workflows/background-jobs.yml` | Main workflow (don't edit) |
| `scripts/jobs/process-videos.ts` | Video processing job |
| `scripts/jobs/process-social.ts` | Social publishing job |
| `GITHUB_ACTIONS_MIGRATION_GUIDE.md` | **Full guide →** Read if you need details |

---

## What Changed

### Removed ❌
- `app/api/cron/process-videos/` endpoint
- `app/api/cron/process-social/` endpoint
- `CRON_SECRET` environment variable
- Vercel Cron configuration from `vercel.json`

### Added ✨
- `.github/workflows/background-jobs.yml`
- `scripts/jobs/process-videos.ts`
- `scripts/jobs/process-social.ts`

### Unchanged ✓
- Database schema
- Service logic (video-automation, social-publishing)
- Job functionality
- Behavior

---

## Schedules

### Video Processing
- **When:** Every day at 3:00 AM UTC
- **What:** Generate videos, publish to YouTube/Facebook
- **Speed:** 3 at a time (batch)

### Social Publishing
- **When:** Every 15 minutes
- **What:** Publish queued social posts
- **Speed:** 10 at a time (parallel)

---

## Manual Triggers

### Via CLI
```bash
# Both jobs
gh workflow run background-jobs.yml

# Just videos
gh workflow run background-jobs.yml -f job_type=videos

# Just social
gh workflow run background-jobs.yml -f job_type=social
```

### Via Web UI
1. **Actions** → **Background Jobs**
2. **Run workflow** → Select type (optional)
3. **Run workflow**

---

## FAQ

**Q: Will jobs still run on schedule?**  
A: Yes, automatically. First run at scheduled time.

**Q: Can I manually trigger?**  
A: Yes, via CLI or GitHub web UI.

**Q: What if a job fails?**  
A: A GitHub Issue is created with details and logs.

**Q: Do I need to do anything?**  
A: Just add the 4 required secrets. That's it.

**Q: Will this cost money?**  
A: No, GitHub Actions is free for public repos.

**Q: Can I disable it?**  
A: Yes, disable the workflow in Actions tab.

---

## Support

| Issue | See |
|-------|-----|
| Setup help | This file or `GITHUB_ACTIONS_MIGRATION_GUIDE.md` |
| Troubleshooting | `GITHUB_ACTIONS_MIGRATION_GUIDE.md` → Troubleshooting |
| Detailed info | `GITHUB_ACTIONS_MIGRATION_GUIDE.md` |
| Full audit | `MIGRATION_AUDIT_VERCEL_CRON_TO_GITHUB_ACTIONS.md` |
| Deployment steps | `DEPLOYMENT_CHECKLIST.md` |

---

## Next Steps

1. ✅ Read this file (you're done!)
2. ⏭️ Add 4 secrets to GitHub (Settings → Secrets)
3. ⏭️ Test with `gh workflow run background-jobs.yml`
4. ⏭️ Check actions tab for results
5. ✅ Done!

---

**That's it!** Your background jobs are now running on GitHub Actions.

Questions? See the detailed guides linked above. 👆

---

*Last Updated: July 31, 2026*
