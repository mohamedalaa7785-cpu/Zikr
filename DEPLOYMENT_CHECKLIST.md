# Deployment Checklist – GitHub Actions Migration

**Status:** Ready for Deployment ✅  
**Last Updated:** July 31, 2026

---

## Pre-Deployment Requirements

### Step 1: GitHub Secrets Configuration ⚠️ REQUIRED

Navigate to: **Repository → Settings → Secrets and variables → Actions**

#### Required Secrets (Must Complete)
- [ ] `SUPABASE_URL` = Your Supabase project URL
- [ ] `SUPABASE_SERVICE_ROLE_KEY` = Service role key from Supabase
- [ ] `DATABASE_URL` = PostgreSQL connection string
- [ ] `NEXT_PUBLIC_SITE_URL` = Your production site URL (e.g., https://zikr.vercel.app)

#### Optional Secrets (Video Generation & Social Publishing)
- [ ] `HEYGEN_API_KEY` = HeyGen API key (if using video generation)
- [ ] `HEYGEN_AVATAR_ID` = HeyGen avatar ID
- [ ] `HEYGEN_VOICE_ID` = HeyGen voice ID
- [ ] `YOUTUBE_CLIENT_ID` = YouTube OAuth client ID
- [ ] `YOUTUBE_CLIENT_SECRET` = YouTube OAuth client secret
- [ ] `YOUTUBE_REFRESH_TOKEN` = YouTube refresh token
- [ ] `FACEBOOK_PAGE_ID` = Facebook page ID
- [ ] `FACEBOOK_PAGE_ACCESS_TOKEN` = Facebook page access token

**How to add a secret:**
1. Click "New repository secret"
2. Name: (use names exactly as listed above)
3. Value: (paste the secret value)
4. Click "Add secret"

---

### Step 2: Verify Workflow File ✅ DONE

- [x] `.github/workflows/background-jobs.yml` exists and is valid YAML
- [x] Workflow has two jobs: `process-videos` and `process-social`
- [x] Schedules are correctly configured:
  - Video processing: `0 3 * * *` (3 AM UTC daily)
  - Social publishing: `*/15 * * * *` (every 15 minutes)
- [x] Workflow uses pnpm for package management
- [x] Environment variables properly passed to scripts

---

### Step 3: Verify Job Scripts ✅ DONE

- [x] `scripts/jobs/process-videos.ts` exists
- [x] `scripts/jobs/process-social.ts` exists
- [x] Both scripts import correct service modules
- [x] Both scripts have proper error handling
- [x] Type checking passes (no TypeScript errors)
- [x] Linting passes (no code style errors)

---

### Step 4: Verify Code Cleanup ✅ DONE

- [x] Old cron routes deleted (`app/api/cron/`)
- [x] `vercel.json` updated (crons section removed)
- [x] `CRON_SECRET` removed from `.env.example`
- [x] `CRON_SECRET` removed from `scripts/validate-deployment-env.mjs`
- [x] `CRON_SECRET` removed from `lib/env.ts`
- [x] No broken imports in codebase
- [x] No references to old cron endpoints

---

### Step 5: Database Verification ✅ PENDING

- [ ] Supabase project is running and accessible
- [ ] `video_generation_requests` table exists
- [ ] `social_publish_queue` table exists
- [ ] `video_publish_log` table exists
- [ ] `videos` table exists
- [ ] Database can be accessed with `SUPABASE_SERVICE_ROLE_KEY`
- [ ] RLS policies (if enabled) allow service role writes

**How to verify:**
```bash
# Test locally
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="your-key"
export NEXT_PUBLIC_SITE_URL="https://zikr.vercel.app"
pnpm tsx scripts/jobs/process-videos.ts
```

---

### Step 6: Local Testing ✅ PENDING

```bash
# Install dependencies
pnpm install

# Set environment variables (from GitHub Secrets)
export SUPABASE_URL="..."
export SUPABASE_SERVICE_ROLE_KEY="..."
export DATABASE_URL="..."
export NEXT_PUBLIC_SITE_URL="..."
export HEYGEN_API_KEY="..."
export HEYGEN_AVATAR_ID="..."
export HEYGEN_VOICE_ID="..."

# Test video processing job
pnpm tsx scripts/jobs/process-videos.ts
```

Expected output:
```
[process-videos] Starting video processing job
[process-videos] Timestamp: 2026-07-31T...
[process-videos] Environment validation passed
[process-videos] Fetching pending video requests (limit: 3)...
[process-videos] Found 0 pending request(s)
[process-videos] Job completed
[process-videos] Processed: 0, Succeeded: 0, Failed: 0
```

---

## Deployment Steps

### Step 1: Commit Changes
```bash
git add -A
git commit -m "migration: Replace Vercel Cron with GitHub Actions

- Remove Vercel Cron configuration
- Delete old cron API routes
- Add GitHub Actions workflow
- Create background job scripts
- Update environment configuration"
git push origin main
```

### Step 2: Configure GitHub Secrets
See "Pre-Deployment Requirements → Step 1" above.

### Step 3: Enable Workflow
- [ ] Navigate to **Actions** tab
- [ ] Verify **Background Jobs** workflow appears
- [ ] Workflow should be automatically enabled

### Step 4: Manual Test (Optional)
```bash
# Using GitHub CLI
gh workflow run background-jobs.yml -f job_type=both

# Or manually via GitHub web UI:
# Actions → Background Jobs → Run workflow → Select job type → Run workflow
```

### Step 5: Monitor First Execution
- [ ] Check Actions tab for workflow run
- [ ] Review logs for errors
- [ ] Verify database updates in Supabase dashboard

---

## Post-Deployment Verification

### Immediate (Within 1 hour)
- [ ] Workflow shows as "success" in Actions tab
- [ ] No failure GitHub Issues created
- [ ] Database tables updated correctly
- [ ] No errors in workflow logs

### Today (Within 24 hours)
- [ ] Manual trigger works correctly
- [ ] All optional integrations working (if configured)
- [ ] Monitor for any errors in logs

### This Week (Within 7 days)
- [ ] Video processing runs at 3 AM UTC (verify next scheduled run)
- [ ] Social publishing runs every 15 minutes (sample a run)
- [ ] All database states updating correctly
- [ ] No pattern of failures

### This Month (Within 30 days)
- [ ] Regular monitoring shows stable execution
- [ ] Performance is acceptable
- [ ] Error rate is zero or very low
- [ ] No issues with API rate limiting

---

## Troubleshooting Quick Reference

### Workflow doesn't appear in Actions tab
**Solution:** Commit must be pushed to main branch
```bash
git push origin main
```

### Workflow fails with "secrets not found"
**Solution:** Configure GitHub Secrets (see Step 1 of pre-deployment)
- Navigate to Settings → Secrets and variables → Actions
- Add all required secrets

### Workflow fails with "database connection refused"
**Solution:** Verify Supabase is running and credentials are correct
```bash
# Test locally
curl -H "apikey: $SUPABASE_ANON_KEY" \
  $SUPABASE_URL/rest/v1/video_generation_requests
```

### Job logs show "No pending requests"
**Solution:** Normal behavior – no jobs in queue
- Video processing: check `video_generation_requests` table
- Social publishing: check `social_publish_queue` table

---

## Rollback Plan

If critical issues occur during deployment:

### Quick Rollback
```bash
# Disable the workflow (temporary)
# Method 1: Via GitHub UI
# - Navigate to Actions → Background Jobs
# - Click "..."
# - Select "Disable workflow"

# Method 2: Via GitHub CLI
gh workflow disable background-jobs.yml
```

### Full Rollback (Restore Vercel Cron)
Only if absolutely necessary – not recommended without careful planning.

```bash
# 1. Restore vercel.json
git revert <commit-sha>

# 2. Re-deploy to Vercel
# 3. Re-configure CRON_SECRET in Vercel environment
```

---

## Success Criteria

✅ **Deployment Successful When:**

1. **Workflow Execution**
   - [ ] Workflow runs without errors
   - [ ] Both jobs (`process-videos` and `process-social`) execute
   - [ ] Execution logs show success messages

2. **Database Operations**
   - [ ] `video_generation_requests` table status updates correctly
   - [ ] `social_publish_queue` table status updates correctly
   - [ ] No data corruption or inconsistency

3. **External Integrations**
   - [ ] HeyGen video generation works (if configured)
   - [ ] YouTube publishing works (if configured)
   - [ ] Facebook publishing works (if configured)

4. **Monitoring**
   - [ ] GitHub Actions shows successful runs
   - [ ] No failure GitHub Issues created
   - [ ] Scheduled runs execute at correct times

---

## Support Contacts

| Issue Type | Resource |
|-----------|----------|
| GitHub Actions Help | https://docs.github.com/en/actions |
| Workflow Syntax | https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions |
| Secrets Management | https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions |
| GitHub Status | https://www.githubstatus.com |
| Supabase Help | https://supabase.com/docs |

---

## Documentation References

- **Full Migration Guide:** `GITHUB_ACTIONS_MIGRATION_GUIDE.md`
- **Audit Report:** `MIGRATION_AUDIT_VERCEL_CRON_TO_GITHUB_ACTIONS.md`
- **Migration Summary:** `MIGRATION_COMPLETE.md`
- **Workflow File:** `.github/workflows/background-jobs.yml`
- **Job Scripts:** `scripts/jobs/process-videos.ts`, `scripts/jobs/process-social.ts`

---

## Final Sign-Off

**Prepared by:** DevOps Engineer  
**Date:** July 31, 2026  
**Status:** ✅ Ready for Deployment

**Deployment Authorization Required:** 🟡 Waiting for approval

Once all pre-deployment requirements are met and this checklist is complete, you're ready to deploy!

---

**Next Step:** Add GitHub Secrets and trigger a manual test run.
