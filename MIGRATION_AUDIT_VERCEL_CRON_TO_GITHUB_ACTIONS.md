# Vercel Cron to GitHub Actions Migration – Audit Report

**Date:** July 31, 2026  
**Status:** Production Migration Ready  
**Scope:** Complete removal of Vercel Cron and replacement with GitHub Actions

---

## Executive Summary

The ZIKR project currently relies on **Vercel Cron Jobs** for two critical background tasks:
1. **Video Generation Processing** (`/api/cron/process-videos`) – runs daily at 3:00 AM UTC
2. **Social Media Publishing** (`/api/cron/process-social`) – runs every 15 minutes

This audit confirms all Vercel Cron dependencies and identifies required changes for a complete migration to **GitHub Actions**.

---

## PHASE 1 – AUDIT FINDINGS

### 1. Vercel Configuration

**File:** `vercel.json`

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

**Status:** ✅ Identified for removal

---

### 2. Scheduled API Routes

#### Route 1: Video Processing
**File:** `app/api/cron/process-videos/route.ts`

**Functionality:**
- Fetches pending video generation requests from Supabase
- Processes them sequentially (batch size: 3)
- Generates videos using HeyGen API
- Publishes to YouTube and Facebook
- Updates status in database

**Key Functions:**
- `getPendingVideoRequests(limit = 100)` – fetches pending jobs
- `processVideoGenerationRequest(request)` – orchestrates generation and publishing

**Security:** Uses `CRON_SECRET` for bearer token authentication

---

#### Route 2: Social Media Publishing
**File:** `app/api/cron/process-social/route.ts`

**Functionality:**
- Fetches pending social media posts from Supabase queue
- Processes them in parallel (batch size: 10)
- Publishes to Facebook and YouTube
- Updates queue item status

**Key Functions:**
- `getPendingSocialPublishItems(limit = 10)` – fetches pending items
- `processSocialPublishItem(item)` – handles publishing

**Security:** Uses `CRON_SECRET` for bearer token authentication

---

### 3. Service Files Supporting Cron Jobs

**File:** `lib/services/video-automation.ts` (704 lines)

**Exports:**
- `createVideoGenerationRequest()` – creates new request
- `getPendingVideoRequests(limit)` – **used by cron**
- `updateVideoRequestStatus()` – updates status
- `generateVideoWithHeyGen()` – generates video
- `publishToYoutube()` – publishes to YouTube
- `publishToFacebook()` – publishes to Facebook
- `processVideoGenerationRequest()` – **main processing function, called by cron**

**Database Tables Used:**
- `video_generation_requests` – status: pending → processing → completed/failed
- `video_publish_log` – audit trail
- `videos` – published videos

---

**File:** `lib/services/social-publishing.ts` (176 lines)

**Exports:**
- `getPendingSocialPublishItems(limit)` – **used by cron**
- `processSocialPublishItem(item)` – **main processing function, called by cron**
- `publishFacebookPost()` – publishes to Facebook
- `publishYoutubeItem()` – publishes video to YouTube

**Database Tables Used:**
- `social_publish_queue` – status: queued → processing → published/partial/failed

---

### 4. Environment Variables

**File:** `.env.example`

**Cron-related variables:**
```bash
# Cron (required in production)
CRON_SECRET=

# Video generation
HEYGEN_API_KEY=
HEYGEN_AVATAR_ID=
HEYGEN_VOICE_ID=

# YouTube Integration
YOUTUBE_API_KEY=
YOUTUBE_CHANNEL_ID=
YOUTUBE_CLIENT_ID=
YOUTUBE_CLIENT_SECRET=
YOUTUBE_REFRESH_TOKEN=

# Facebook Integration
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
FACEBOOK_PAGE_ACCESS_TOKEN=
FACEBOOK_PAGE_ID=

# Gemini AI
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash

# Database & Supabase
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
```

**Status:** ✅ All variables referenced in validation script

---

### 5. Environment Validation

**File:** `scripts/validate-deployment-env.mjs`

**Cron-related check:**
```javascript
const OPTIONAL_INTEGRATIONS = [
  // ... other vars ...
  "CRON_SECRET",
];
```

**Status:** ✅ CRON_SECRET marked as optional integration

---

### 6. References in Documentation

**Files Checked:**
- `README.md` – No cron references
- `docs/` – Contains generic hosting info
- `INFRA_AUDIT_LOG.md` – Documents cron secret issue:
  ```
  "A review of the runtime logs identified a recurring issue within 
  the video processing cron job located at `/api/cron/process-videos`. 
  The system is refusing to execute the job because the `CRON_SECRET` 
  environment variable is not configured..."
  ```

**Status:** ✅ No critical documentation requiring updates

---

### 7. References in Code

**Search Results:**

| File | Reference | Type |
|------|-----------|------|
| `vercel.json` | `crons` array | Configuration |
| `app/api/cron/process-videos/route.ts` | Route handler | API |
| `app/api/cron/process-social/route.ts` | Route handler | API |
| `lib/services/video-automation.ts` | `getPendingVideoRequests()` | Service |
| `lib/services/social-publishing.ts` | `getPendingSocialPublishItems()` | Service |
| `lib/env.ts` | None (CRON_SECRET not referenced) | - |
| `.env.example` | `CRON_SECRET=` | Configuration |
| `scripts/validate-deployment-env.mjs` | Optional integration | Validation |

**Status:** ✅ All cron references identified

---

### 8. Business Logic Analysis

#### Video Generation Pipeline

**Status Flow:** `pending` → `processing` → `completed` OR `failed`

1. **Fetch Phase:**
   - Query `video_generation_requests` where `status = 'pending'`
   - Order by `created_at` ASC (FIFO)
   - Batch size: 3 (due to HeyGen API rate limiting and timeout constraints)

2. **Generation Phase:**
   - Submit job to HeyGen API
   - Poll status endpoint (5s interval, max 48 polls = 4 minutes)
   - Store generated video URL

3. **Publishing Phase:**
   - Publish to YouTube (if configured)
   - Publish to Facebook (if configured)
   - Log publish results

4. **Completion:**
   - Mark as `completed` if all enabled targets succeeded
   - Mark as `failed` with error details if any critical failure
   - Can be retried via admin panel (resets to `pending`)

---

#### Social Media Publishing Pipeline

**Status Flow:** `queued` → `processing` → `published` OR `partial` OR `failed`

1. **Fetch Phase:**
   - Query `social_publish_queue` where `status = 'queued'`
   - Include scheduled items where `scheduled_at <= NOW()`
   - Order by `scheduled_at` ASC (NULLS FIRST), then `created_at` ASC
   - Batch size: 10

2. **Publishing Phase:**
   - Publish to all target platforms (Facebook, YouTube) in parallel
   - Capture individual platform results

3. **Completion:**
   - `published` if ALL platforms succeeded
   - `partial` if SOME platforms succeeded
   - `failed` if NO platforms succeeded
   - Store metadata with per-platform results

---

### 9. Cron Schedule Analysis

| Job | Schedule | Frequency | Purpose |
|-----|----------|-----------|---------|
| `process-videos` | `0 3 * * *` | Daily at 3:00 AM UTC | Batch video generation |
| `process-social` | `*/15 * * * *` | Every 15 minutes | Real-time social publishing |

**Execution Windows:**
- Video processing: 300s timeout (5 minutes max)
- Social publishing: 300s timeout (5 minutes max)

---

## PHASE 2 – RISK ASSESSMENT

### Current Issues

1. **CRON_SECRET not configured in production**
   - Status: BLOCKING
   - Impact: Cron jobs refuse to execute
   - Evidence: INFRA_AUDIT_LOG.md

2. **No automatic retry on failure**
   - Status: Design limitation
   - Impact: Failed jobs require manual retry via admin
   - Mitigation: GitHub Actions can implement automatic retry with exponential backoff

3. **No alerting on cron execution**
   - Status: Visibility gap
   - Impact: Silent failures possible
   - Mitigation: GitHub Actions can send notifications

---

### Advantages of Migration to GitHub Actions

✅ **No `CRON_SECRET` required** – GitHub provides OIDC token authentication  
✅ **Better visibility** – Workflow runs are logged and visible in GitHub UI  
✅ **Automatic retries** – Built-in retry mechanism  
✅ **No Vercel quota limits** – Independent of Vercel cron limitations  
✅ **Cost savings** – GitHub Actions runners are generous free tier  
✅ **Timeout flexibility** – Up to 35,520 minutes for enterprise plans  
✅ **No API calls through public endpoints** – Services call internal functions directly  

---

## PHASE 3 – MIGRATION STRATEGY

### Files to Delete
- `app/api/cron/process-videos/route.ts`
- `app/api/cron/process-social/route.ts`
- `vercel.json` (crons section)

### Files to Create
- `.github/workflows/background-jobs.yml`

### Files to Modify
- `.env.example` – Remove `CRON_SECRET`
- `scripts/validate-deployment-env.mjs` – Remove `CRON_SECRET` from optional integrations
- `README.md` – Document GitHub Actions migration

### Files That Remain Unchanged
- `lib/services/video-automation.ts` – Core logic reused
- `lib/services/social-publishing.ts` – Core logic reused
- All database schema and types

---

## PHASE 4 – GITHUB ACTIONS WORKFLOW DESIGN

### Workflow: `background-jobs.yml`

**Triggers:**
- `schedule`: `0 3 * * *` (video processing – 3 AM UTC)
- `schedule`: `*/15 * * * *` (social publishing – every 15 min)
- `workflow_dispatch`: Manual trigger for testing

**Concurrency:**
- Prevent overlapping executions
- Cancel in-progress runs when new run starts

**Job Configuration:**
- Timeout: 15 minutes (2x the cron timeout for safety)
- Permissions: Minimal (only GitHub token, no repo write)
- Retry: Automatic with exponential backoff

**Environment Setup:**
- Install dependencies
- Cache node_modules
- Load environment variables from GitHub Secrets

**Execution:**
- Call the existing service functions directly via Node.js
- Log execution details
- Report failures via GitHub Actions annotations

---

## Summary

| Aspect | Current State | Migration Status |
|--------|---------------|------------------|
| **Cron Routes** | 2 public endpoints | ❌ To be deleted |
| **Vercel Config** | `vercel.json` | ❌ To be cleaned |
| **Environment Vars** | `CRON_SECRET` (unused) | ❌ To be removed |
| **Service Functions** | Working | ✅ Reusable as-is |
| **Database Logic** | Functional | ✅ No changes needed |
| **GitHub Actions** | None | ✅ To be created |
| **Documentation** | Generic hosting | ⚠️ To be updated |

---

## Next Steps

1. ✅ **Audit Complete** – This report
2. ⏭️ **Phase 2** – Remove Vercel Cron configuration
3. ⏭️ **Phase 3** – Create GitHub Actions workflow
4. ⏭️ **Phase 4** – Configure GitHub Secrets
5. ⏭️ **Phase 5** – Validate and test
6. ⏭️ **Phase 6** – Deploy and monitor

---

**Prepared by:** DevOps Engineer  
**Review Status:** Ready for implementation  
**Approval Required:** Yes (before deleting cron routes)
