-- ============================================================================
-- ZIKR MEDIA - FIX COLUMN NAMING CONSISTENCY
-- Date: 2026-07-29
-- Purpose: Align all column names in Supabase to snake_case and match Drizzle schema
-- Status: Fully idempotent - safe to re-run
-- ============================================================================

-- ── NOTIFICATION SETTINGS: Rename columns to snake_case ──────────────────────

DO $$ BEGIN
  -- Rename email_notifications if it's using camelCase
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'notification_settings' 
    AND column_name = 'emailNotifications'
  ) THEN
    ALTER TABLE public.notification_settings RENAME COLUMN "emailNotifications" TO email_notifications;
  END IF;

  -- Rename push_notifications if it's using camelCase
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'notification_settings' 
    AND column_name = 'pushNotifications'
  ) THEN
    ALTER TABLE public.notification_settings RENAME COLUMN "pushNotifications" TO push_notifications;
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Error fixing notification_settings columns: %', SQLERRM;
END $$;

-- ── APP SETTINGS: Rename fontSize to font_size ────────────────────────────

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'app_settings' 
    AND column_name = 'fontSize'
  ) THEN
    ALTER TABLE public.app_settings RENAME COLUMN "fontSize" TO font_size;
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Error fixing app_settings columns: %', SQLERRM;
END $$;

-- ── USERS TABLE (Legacy): Fix column naming ────────────────────────────────

DO $$ BEGIN
  -- Rename openId if exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'users' 
    AND column_name = 'openId'
  ) THEN
    ALTER TABLE public.users RENAME COLUMN "openId" TO open_id;
  END IF;

  -- Rename loginMethod if exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'users' 
    AND column_name = 'loginMethod'
  ) THEN
    ALTER TABLE public.users RENAME COLUMN "loginMethod" TO login_method;
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Error fixing users table columns: %', SQLERRM;
END $$;

-- ── EPISODES TABLE: Fix column naming ──────────────────────────────────────

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'episodes' 
    AND column_name = 'titleEn'
  ) THEN
    ALTER TABLE public.episodes RENAME COLUMN "titleEn" TO title_en;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'episodes' 
    AND column_name = 'titleAr'
  ) THEN
    ALTER TABLE public.episodes RENAME COLUMN "titleAr" TO title_ar;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'episodes' 
    AND column_name = 'descriptionEn'
  ) THEN
    ALTER TABLE public.episodes RENAME COLUMN "descriptionEn" TO description_en;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'episodes' 
    AND column_name = 'descriptionAr'
  ) THEN
    ALTER TABLE public.episodes RENAME COLUMN "descriptionAr" TO description_ar;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'episodes' 
    AND column_name = 'contentEn'
  ) THEN
    ALTER TABLE public.episodes RENAME COLUMN "contentEn" TO content_en;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'episodes' 
    AND column_name = 'contentAr'
  ) THEN
    ALTER TABLE public.episodes RENAME COLUMN "contentAr" TO content_ar;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'episodes' 
    AND column_name = 'keywordsEn'
  ) THEN
    ALTER TABLE public.episodes RENAME COLUMN "keywordsEn" TO keywords_en;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'episodes' 
    AND column_name = 'keywordsAr'
  ) THEN
    ALTER TABLE public.episodes RENAME COLUMN "keywordsAr" TO keywords_ar;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'episodes' 
    AND column_name = 'thumbnailUrl'
  ) THEN
    ALTER TABLE public.episodes RENAME COLUMN "thumbnailUrl" TO thumbnail_url;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'episodes' 
    AND column_name = 'youtubeVideoId'
  ) THEN
    ALTER TABLE public.episodes RENAME COLUMN "youtubeVideoId" TO youtube_video_id;
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Error fixing episodes table columns: %', SQLERRM;
END $$;

-- ── SUBSCRIPTIONS TABLE: Fix verification_token naming ──────────────────────

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'subscriptions' 
    AND column_name = 'verificationToken'
  ) THEN
    ALTER TABLE public.subscriptions RENAME COLUMN "verificationToken" TO verification_token;
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Error fixing subscriptions table columns: %', SQLERRM;
END $$;

-- End of migration
