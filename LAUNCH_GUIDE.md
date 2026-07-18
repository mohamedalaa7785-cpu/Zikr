# 🚀 ZIKR MEDIA - PRODUCTION LAUNCH GUIDE

**Status**: ✅ **READY FOR PRODUCTION LAUNCH**

---

## 📋 TABLE OF CONTENTS

1. [Quick Start (3 Steps)](#quick-start)
2. [Prerequisites](#prerequisites)
3. [Step 1: Environment Variables](#step-1-environment-variables)
4. [Step 2: Database Migration](#step-2-database-migration)
5. [Step 3: Deploy & Verify](#step-3-deploy--verify)
6. [Testing Checklist](#testing-checklist)
7. [Troubleshooting](#troubleshooting)
8. [Post-Launch Monitoring](#post-launch-monitoring)

---

## ⚡ QUICK START

**3 simple steps to go live:**

### Step 1: Add 6 Environment Variables to Vercel
```bash
Go to: https://vercel.com/projects/zikr/settings/environment-variables
Add these 6 variables marked as Production:
  1. NEXT_PUBLIC_SUPABASE_URL
  2. NEXT_PUBLIC_SUPABASE_ANON_KEY
  3. SUPABASE_SERVICE_ROLE_KEY
  4. NEXT_PUBLIC_GOOGLE_CLIENT_ID
  5. GOOGLE_CLIENT_SECRET
  6. GEMINI_API_KEY
```

### Step 2: Apply Database Migration
```sql
Go to: https://app.supabase.com → zikr project → SQL Editor
Copy file: supabase/migrations/20260718100000_consolidated_production_baseline.sql
Paste into SQL Editor and click: Run
```

### Step 3: Test Production
```
Visit: https://zikrmediaofficial.vercel.app
Test signup, signin, content loading, favorites
```

**Done!** 🎉 Your app is now live on production.

---

## ✅ PREREQUISITES

Before starting, ensure you have:

- [ ] Access to Supabase dashboard (https://app.supabase.com)
- [ ] Access to Vercel project settings (https://vercel.com/projects/zikr)
- [ ] Access to Google Cloud Console for OAuth (https://console.cloud.google.com)
- [ ] Google Gemini API key (https://ai.google.dev/api/keys)
- [ ] Git repository access (https://github.com/mohamedalaa7785-cpu/Zikr)

---

## STEP 1: ENVIRONMENT VARIABLES

### 1.1 Get Required Values

#### **Supabase Configuration**

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Go to: https://app.supabase.com
   - Select: "zikr" project
   - Navigate to: Settings → API → URL (Public)
   - Copy: The URL starting with `https://`
   - Example: `https://eydxvcamhjhajxjrsgym.supabase.co`

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Same location as above
   - Copy: Anon key (Public)
   - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

3. **SUPABASE_SERVICE_ROLE_KEY**
   - Same location as above
   - Copy: Service Role key (Secret - KEEP SECURE!)
   - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

#### **Google OAuth Configuration**

4. **NEXT_PUBLIC_GOOGLE_CLIENT_ID**
   - Go to: https://console.cloud.google.com
   - Navigate to: APIs & Services → Credentials
   - Find: OAuth 2.0 Client ID (Web application)
   - Copy: Client ID
   - Example: `123456789-abcdefghijklmnopqrstuv.apps.googleusercontent.com`

5. **GOOGLE_CLIENT_SECRET**
   - Same location as above
   - Copy: Client Secret (Secret - KEEP SECURE!)
   - Example: `GOCSPX-xxxxxxxxxxxxxxxxxxxxx`

#### **Gemini API Configuration**

6. **GEMINI_API_KEY**
   - Go to: https://ai.google.dev/api/keys
   - Click: Create API Key
   - Copy: The generated key (Secret - KEEP SECURE!)
   - Example: `AIzaSyD...`

### 1.2 Add Variables to Vercel

**Method A: Via Dashboard (Recommended)**

1. Go to: https://vercel.com/projects/zikr/settings/environment-variables
2. Click: "Add New" button
3. For each variable:
   ```
   Name: [Variable name from above]
   Value: [The value you copied]
   Target: Production (checked)
   ```
4. Click: "Save"

**Method B: Via Vercel CLI**

```bash
# First, authenticate with Vercel
vercel login

# Add each variable
vercel env add NEXT_PUBLIC_SUPABASE_URL --scope team_DPvdFrVquJ2LRzKLsZScxTfY
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY --scope team_DPvdFrVquJ2LRzKLsZScxTfY
vercel env add SUPABASE_SERVICE_ROLE_KEY --scope team_DPvdFrVquJ2LRzKLsZScxTfY
vercel env add NEXT_PUBLIC_GOOGLE_CLIENT_ID --scope team_DPvdFrVquJ2LRzKLsZScxTfY
vercel env add GOOGLE_CLIENT_SECRET --scope team_DPvdFrVquJ2LRzKLsZScxTfY
vercel env add GEMINI_API_KEY --scope team_DPvdFrVquJ2LRzKLsZScxTfY
```

**Method C: Via Script**

```bash
node scripts/add-env-to-vercel.mjs
```

---

## STEP 2: DATABASE MIGRATION

### 2.1 Apply Migration File

**Option A: Via Supabase Dashboard (Easy)**

1. Go to: https://app.supabase.com
2. Select: "zikr" project
3. Navigate to: SQL Editor
4. Click: "New Query"
5. Copy entire contents of: `supabase/migrations/20260718100000_consolidated_production_baseline.sql`
6. Paste into the editor
7. Click: "Run"
8. Wait for: ✅ "Query completed successfully"

**Option B: Via Supabase CLI**

```bash
cd /vercel/share/v0-project

# Link your Supabase project
supabase link --project-ref eydxvcamhjhajxjrsgym

# Push the migration
supabase db push --linked

# Verify
supabase db show
```

**Option C: Via Docker Supabase Local**

```bash
# If you have Supabase CLI set up locally
supabase start
supabase migration list
supabase db push
```

### 2.2 Verify Migration

After running the migration, verify it worked:

```sql
-- Check tables created
SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = 'public';

-- Check RLS enabled
SELECT tablename FROM pg_tables WHERE schemaname = 'public' LIMIT 5;

-- Check a specific table
SELECT * FROM information_schema.tables WHERE table_name = 'users';
```

Expected result: 20+ tables created

---

## STEP 3: DEPLOY & VERIFY

### 3.1 Trigger Deployment

**Option A: Automatic (Recommended)**

Once you push to main:
```bash
git push origin main
```
Vercel automatically detects the push and deploys within 1-2 minutes.

**Option B: Manual via Vercel Dashboard**

1. Go to: https://vercel.com/projects/zikr
2. Click: "Deployments" tab
3. Find latest commit in main
4. Click: Re-deploy (if needed)

**Option C: Via Vercel CLI**

```bash
vercel deploy --prod
```

### 3.2 Monitor Deployment

1. Go to: https://vercel.com/projects/zikr/deployments
2. Look for status:
   - 🟡 Building... (wait 1-2 minutes)
   - 🟢 Ready (deployment successful)
   - 🔴 Failed (check logs for errors)

3. Check logs for errors:
   - Click on deployment
   - Click: "Functions" or "Logs" tabs
   - Search for any ERROR messages

### 3.3 Verify Production URL

1. Visit: https://zikrmediaofficial.vercel.app
2. Check for:
   - ✅ Page loads without errors
   - ✅ No 500 errors in console
   - ✅ Navigation works

---

## 📋 TESTING CHECKLIST

### Authentication Tests
- [ ] Sign up with email/password
- [ ] Email verification works
- [ ] Sign in with credentials
- [ ] Google OAuth sign in works
- [ ] Facebook OAuth sign in works
- [ ] Password reset works
- [ ] Session persists on refresh
- [ ] Sign out works

### Content Tests
- [ ] Quran verses load
- [ ] Audio playback works
- [ ] Hadith content loads
- [ ] Tafsir (commentary) loads
- [ ] Azkar (remembrance) displays
- [ ] Search functionality works

### User Features
- [ ] Can add to favorites
- [ ] Can create posts
- [ ] Can add comments
- [ ] Can edit profile
- [ ] Can upload avatar
- [ ] Can view user dashboard

### Performance
- [ ] Page loads in < 3 seconds
- [ ] Navigation is smooth
- [ ] No console errors
- [ ] No network errors
- [ ] Images optimize correctly
- [ ] Audio streams smoothly

### Security
- [ ] No secrets in console
- [ ] CORS headers present
- [ ] Rate limiting working
- [ ] Authentication required for protected routes
- [ ] RLS policies enforced

---

## 🔧 TROUBLESHOOTING

### Problem: "Missing environment variables"

**Solution:**
```bash
# Check if variables are set in Vercel
vercel env list --scope team_DPvdFrVquJ2LRzKLsZScxTfY

# Re-add missing variables
vercel env add <VARIABLE_NAME> --scope team_DPvdFrVquJ2LRzKLsZScxTfY

# Trigger redeploy
vercel redeploy --prod
```

### Problem: Database connection fails

**Solution:**
```bash
# Check Supabase URL and keys
grep NEXT_PUBLIC_SUPABASE_URL /vercel/share/.env.project

# Test connection
psql -U postgres -h eydxvcamhjhajxjrsgym.supabase.co -c "SELECT 1"

# Check RLS policies
supabase link
supabase status
```

### Problem: OAuth not working

**Solution:**
1. Check Google Console redirect URIs:
   - https://zikrmediaofficial.vercel.app/auth/callback
   - https://localhost:3000/auth/callback (local dev)

2. Verify Facebook app settings:
   - Valid OAuth Redirect URIs includes production URL

3. Re-authenticate:
   - Clear browser cookies
   - Clear cache
   - Try sign in again

### Problem: Deployment keeps failing

**Solution:**
```bash
# Check build logs
vercel logs --prod

# Check for TypeScript errors
pnpm check

# Rebuild locally
pnpm build

# Check for large files
du -sh .next/

# Redeploy
git push origin main
```

---

## 📊 POST-LAUNCH MONITORING

### Daily Checks

1. **Uptime Monitoring**
   - Check: https://status.vercel.com
   - Check: https://status.supabase.com

2. **Performance Monitoring**
   - Vercel: https://vercel.com/projects/zikr/analytics
   - Web Vitals dashboard
   - Response times

3. **Error Monitoring**
   - Check: Vercel Logs for errors
   - Monitor: User error reports
   - Track: API response codes

4. **Database Health**
   - Check: Supabase disk usage
   - Monitor: Connection count
   - Watch: Query performance

### Weekly Reviews

- Analyze traffic patterns
- Review database performance
- Check user feedback
- Update security patches
- Verify backups running

### Important Links

| Resource | URL |
|----------|-----|
| Live Site | https://zikrmediaofficial.vercel.app |
| Vercel Dashboard | https://vercel.com/projects/zikr |
| Vercel Analytics | https://vercel.com/projects/zikr/analytics |
| Supabase Dashboard | https://app.supabase.com/projects |
| GitHub Repo | https://github.com/mohamedalaa7785-cpu/Zikr |
| Google OAuth | https://console.cloud.google.com |

---

## ✅ LAUNCH CONFIRMATION

Once all steps are complete, you should have:

- [x] 6 environment variables added to Vercel
- [x] Database migration applied to Supabase
- [x] App deployed to production
- [x] All tests passing
- [x] SSL certificate active
- [x] Monitoring configured
- [x] Documentation complete

**Status: 🟢 PRODUCTION LIVE** 🚀

---

## 📞 SUPPORT

If you encounter issues:

1. **Vercel Support**: https://vercel.com/support
2. **Supabase Support**: https://supabase.com/docs
3. **GitHub Issues**: https://github.com/mohamedalaa7785-cpu/Zikr/issues

---

**Generated**: 2026-07-18  
**Version**: 1.0.0  
**Status**: ✅ Ready for Production Launch
