-- ============================================================================
-- ZIKR MEDIA - CONSOLIDATED PRODUCTION BASELINE MIGRATION
-- ============================================================================
-- Date: 2026-07-18
-- Purpose: Single source of truth for all database schema
-- Status: Fully idempotent - safe to re-run multiple times
-- ============================================================================

-- ── ENABLE EXTENSIONS ────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── CREATE ENUMS ─────────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE public.user_role AS ENUM ('user', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.favorite_item_type AS ENUM (
    'quran',
    'hadith',
    'story',
    'scholar',
    'dua'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.progress_scope AS ENUM (
    'quran',
    'hadith',
    'stories'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.reminder_type AS ENUM (
    'prayer',
    'quran',
    'adhkar',
    'fasting',
    'zakat'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.category AS ENUM (
    'dark',
    'romantic',
    'psychological',
    'prophets',
    'stories',
    'duas',
    'hadith',
    'quran',
    'sahaba',
    'documentaries',
    'history'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.payment_status AS ENUM (
    'pending',
    'approved',
    'rejected'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.subscription_plan AS ENUM (
    'free',
    'pro',
    'premium'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.job_status AS ENUM (
    'pending',
    'processing',
    'completed',
    'failed'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ── CREATE TABLES ───────────────────────────────────────────────────────

-- User Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL PRIMARY KEY DEFAULT auth.uid(),
  email text,
  username text UNIQUE,
  avatar_url text,
  bio text,
  role public.user_role DEFAULT 'user'::public.user_role,
  subscription_plan public.subscription_plan DEFAULT 'free'::public.subscription_plan,
  is_email_verified boolean DEFAULT false,
  preferences jsonb DEFAULT '{}'::jsonb,
  last_login_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_id_fk FOREIGN KEY (id) REFERENCES auth.users (id) ON DELETE CASCADE
);

-- Favorites
CREATE TABLE IF NOT EXISTS public.favorites (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  item_type public.favorite_item_type NOT NULL,
  item_id text NOT NULL,
  item_data jsonb,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT favorites_unique_item UNIQUE (user_id, item_type, item_id)
);

-- Reading Progress
CREATE TABLE IF NOT EXISTS public.reading_progress (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  scope public.progress_scope NOT NULL,
  content_id text NOT NULL,
  progress_percent integer DEFAULT 0,
  last_position jsonb,
  completed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT reading_progress_unique UNIQUE (user_id, scope, content_id)
);

-- Prayer Times
CREATE TABLE IF NOT EXISTS public.prayer_times (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  location text,
  latitude numeric,
  longitude numeric,
  timezone text,
  send_notifications boolean DEFAULT true,
  notification_minutes_before integer DEFAULT 15,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT prayer_times_user_location UNIQUE (user_id, location)
);

-- Quran Content
CREATE TABLE IF NOT EXISTS public.quran_chapters (
  id integer NOT NULL PRIMARY KEY,
  number integer NOT NULL UNIQUE,
  name text NOT NULL,
  name_arabic text,
  name_english text,
  verses_count integer,
  revelation_order integer,
  revelation_type text,
  description text,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.quran_verses (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id integer NOT NULL REFERENCES public.quran_chapters (id),
  verse_number integer NOT NULL,
  text text,
  text_english text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT quran_verses_unique UNIQUE (chapter_id, verse_number)
);

-- Hadith Content
CREATE TABLE IF NOT EXISTS public.hadith (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  category public.category,
  narrator text,
  text text,
  text_english text,
  authenticity text,
  source text,
  is_approved boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Stories
CREATE TABLE IF NOT EXISTS public.stories (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  category public.category,
  title text NOT NULL,
  title_english text,
  content text,
  content_english text,
  duration_seconds integer,
  duration_minutes integer,
  voice_type text,
  voice_url text,
  is_approved boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Adhkar (Remembrance)
CREATE TABLE IF NOT EXISTS public.adhkar (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  title_english text,
  content text NOT NULL,
  content_english text,
  category public.category,
  repetitions integer DEFAULT 1,
  audio_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Reciters
CREATE TABLE IF NOT EXISTS public.reciters (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_english text,
  arabic_name text,
  bio text,
  avatar_url text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Video Categories
CREATE TABLE IF NOT EXISTS public.video_categories (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar text NOT NULL,
  name_en text NOT NULL,
  slug text NOT NULL UNIQUE,
  description_ar text,
  description_en text,
  icon text,
  published boolean NOT NULL DEFAULT true,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Videos
CREATE TABLE IF NOT EXISTS public.videos (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES public.video_categories (id) ON DELETE CASCADE,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  youtube_id text,
  thumbnail_url text,
  duration integer,
  views integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Admin Logs
CREATE TABLE IF NOT EXISTS public.admin_logs (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  action text NOT NULL,
  target_type text,
  target_id text,
  changes jsonb,
  ip_address text,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

-- Moderation Queue
CREATE TABLE IF NOT EXISTS public.moderation_queue (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type text NOT NULL,
  content_id text NOT NULL,
  content_data jsonb,
  status public.job_status DEFAULT 'pending'::public.job_status,
  reported_by uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  moderated_by uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  reason text,
  decision text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Social Publishing Queue (aligned with drizzle/schema.ts and app REST calls)
CREATE TABLE IF NOT EXISTS public.social_publish_queue (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type text NOT NULL,
  content_id text,
  title text NOT NULL,
  body text,
  image_url text,
  video_url text,
  target_platforms text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'queued',
  scheduled_at timestamp with time zone,
  published_at timestamp with time zone,
  error_message text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Video Render Jobs
CREATE TABLE IF NOT EXISTS public.video_render_jobs (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id text NOT NULL,
  content_type text NOT NULL,
  avatar_id text,
  voice_id text,
  status public.job_status DEFAULT 'pending'::public.job_status,
  video_url text,
  render_result jsonb,
  error_message text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- ── CREATE INDEXES ──────────────────────────────────────────────────────

-- Profiles Indexes
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'email'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles (email);
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'username'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles (username);
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'display_name'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_profiles_display_name ON public.profiles (display_name);
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'role'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles (role);
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'subscription_plan'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_profiles_subscription ON public.profiles (subscription_plan);
  END IF;
END $$;

-- Favorites Indexes
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites (user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_item_type ON public.favorites (item_type);
CREATE INDEX IF NOT EXISTS idx_favorites_user_type ON public.favorites (user_id, item_type);

-- Reading Progress Indexes
CREATE INDEX IF NOT EXISTS idx_reading_progress_user_id ON public.reading_progress (user_id);
CREATE INDEX IF NOT EXISTS idx_reading_progress_scope ON public.reading_progress (scope);
CREATE INDEX IF NOT EXISTS idx_reading_progress_user_scope ON public.reading_progress (user_id, scope);

-- Prayer Times Indexes
CREATE INDEX IF NOT EXISTS idx_prayer_times_user_id ON public.prayer_times (user_id);
CREATE INDEX IF NOT EXISTS idx_prayer_times_location ON public.prayer_times (location);

-- Quran Indexes
CREATE INDEX IF NOT EXISTS idx_quran_chapters_number ON public.quran_chapters (number);
CREATE INDEX IF NOT EXISTS idx_quran_verses_chapter_id ON public.quran_verses (chapter_id);
CREATE INDEX IF NOT EXISTS idx_quran_verses_number ON public.quran_verses (verse_number);

-- Hadith Indexes
CREATE INDEX IF NOT EXISTS idx_hadith_category ON public.hadith (category);
CREATE INDEX IF NOT EXISTS idx_hadith_approved ON public.hadith (is_approved);

-- Stories Indexes
CREATE INDEX IF NOT EXISTS idx_stories_category ON public.stories (category);
CREATE INDEX IF NOT EXISTS idx_stories_approved ON public.stories (is_approved);

-- Videos Indexes
CREATE INDEX IF NOT EXISTS idx_video_categories_slug ON public.video_categories (slug);
CREATE INDEX IF NOT EXISTS idx_video_categories_public ON public.video_categories (published, is_active);
CREATE INDEX IF NOT EXISTS idx_videos_category ON public.videos (category_id);
CREATE INDEX IF NOT EXISTS idx_videos_slug ON public.videos (slug);
CREATE INDEX IF NOT EXISTS idx_videos_published ON public.videos (published);
CREATE INDEX IF NOT EXISTS idx_videos_youtube_id ON public.videos (youtube_id);

-- Admin Logs Indexes
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_id ON public.admin_logs (admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_action ON public.admin_logs (action);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON public.admin_logs (created_at);

-- Moderation Queue Indexes
CREATE INDEX IF NOT EXISTS idx_moderation_queue_status ON public.moderation_queue (status);
CREATE INDEX IF NOT EXISTS idx_moderation_queue_content_type ON public.moderation_queue (content_type);
CREATE INDEX IF NOT EXISTS idx_moderation_queue_reported_by ON public.moderation_queue (reported_by);

-- Social Publishing Queue Indexes
CREATE INDEX IF NOT EXISTS idx_social_pub_queue_status ON public.social_publish_queue (status);
CREATE INDEX IF NOT EXISTS idx_social_pub_queue_platforms ON public.social_publish_queue USING gin (target_platforms);
CREATE INDEX IF NOT EXISTS idx_social_pub_queue_scheduled ON public.social_publish_queue (scheduled_at);

-- Video Render Jobs Indexes
CREATE INDEX IF NOT EXISTS idx_video_render_status ON public.video_render_jobs (status);
CREATE INDEX IF NOT EXISTS idx_video_render_content_id ON public.video_render_jobs (content_id);

-- ── ENABLE ROW-LEVEL SECURITY (RLS) ─────────────────────────────────────

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_times ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_publish_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_publish_queue FORCE ROW LEVEL SECURITY;
ALTER TABLE public.video_render_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_render_jobs FORCE ROW LEVEL SECURITY;
ALTER TABLE public.video_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- ── RLS POLICIES FOR PROFILES ───────────────────────────────────────────

-- Allow public read access to profiles
DROP POLICY IF EXISTS "Profiles are public" ON public.profiles;
CREATE POLICY "Profiles are public" ON public.profiles
  FOR SELECT TO anon, authenticated USING (true);

-- Users can update their own profile
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

-- Admins can delete profiles
DROP POLICY IF EXISTS "Only admins can delete profiles" ON public.profiles;
CREATE POLICY "Only admins can delete profiles" ON public.profiles
  FOR DELETE TO authenticated USING (
    (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'admin'
  );

-- ── RLS POLICIES FOR FAVORITES ──────────────────────────────────────────

-- Users see only their own favorites
DROP POLICY IF EXISTS "Users see own favorites" ON public.favorites;
CREATE POLICY "Users see own favorites" ON public.favorites
  FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);

-- Users can create their own favorites
DROP POLICY IF EXISTS "Users create own favorites" ON public.favorites;
CREATE POLICY "Users create own favorites" ON public.favorites
  FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = user_id);

-- Users can delete their own favorites
DROP POLICY IF EXISTS "Users delete own favorites" ON public.favorites;
CREATE POLICY "Users delete own favorites" ON public.favorites
  FOR DELETE TO authenticated USING ((SELECT auth.uid()) = user_id);

-- ── RLS POLICIES FOR READING_PROGRESS ───────────────────────────────────

-- Users see only their own reading progress
DROP POLICY IF EXISTS "Users see own reading progress" ON public.reading_progress;
CREATE POLICY "Users see own reading progress" ON public.reading_progress
  FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);

-- Users can update their own reading progress
DROP POLICY IF EXISTS "Users update own reading progress" ON public.reading_progress;
CREATE POLICY "Users update own reading progress" ON public.reading_progress
  FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- Users can create their own reading progress
DROP POLICY IF EXISTS "Users create own reading progress" ON public.reading_progress;
CREATE POLICY "Users create own reading progress" ON public.reading_progress
  FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = user_id);

-- ── RLS POLICIES FOR PRAYER_TIMES ───────────────────────────────────────

-- Users see only their own prayer times
DROP POLICY IF EXISTS "Users see own prayer times" ON public.prayer_times;
CREATE POLICY "Users see own prayer times" ON public.prayer_times
  FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);

-- Users can create their own prayer times
DROP POLICY IF EXISTS "Users create own prayer times" ON public.prayer_times;
CREATE POLICY "Users create own prayer times" ON public.prayer_times
  FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = user_id);

-- Users can update their own prayer times
DROP POLICY IF EXISTS "Users update own prayer times" ON public.prayer_times;
CREATE POLICY "Users update own prayer times" ON public.prayer_times
  FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- ── RLS POLICIES FOR ADMIN_LOGS ─────────────────────────────────────────

-- Admins see all logs
DROP POLICY IF EXISTS "Admins see all logs" ON public.admin_logs;
CREATE POLICY "Admins see all logs" ON public.admin_logs
  FOR SELECT USING (
    (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'admin'
  );

-- Users see only their own logs
DROP POLICY IF EXISTS "Users see own logs" ON public.admin_logs;
CREATE POLICY "Users see own logs" ON public.admin_logs
  FOR SELECT TO authenticated USING ((SELECT auth.uid()) = admin_id);

-- ── RLS POLICIES FOR MODERATION_QUEUE ───────────────────────────────────

-- Only admins can access moderation queue
DROP POLICY IF EXISTS "Only admins access moderation" ON public.moderation_queue;
CREATE POLICY "Only admins access moderation" ON public.moderation_queue
  FOR SELECT USING (
    (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'admin'
  );

DROP POLICY IF EXISTS "Only admins update moderation" ON public.moderation_queue;
CREATE POLICY "Only admins update moderation" ON public.moderation_queue
  FOR UPDATE TO authenticated USING (
    (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'admin'
  )
  WITH CHECK (
    (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'admin'
  );


-- ── RLS POLICIES FOR SOCIAL/VIDEO QUEUES ───────────────────────────────

DROP POLICY IF EXISTS "Admins manage social publish queue" ON public.social_publish_queue;
CREATE POLICY "Admins manage social publish queue" ON public.social_publish_queue
  FOR ALL TO authenticated USING (
    (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'admin'
  )
  WITH CHECK (
    (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'admin'
  );

DROP POLICY IF EXISTS "Admins manage video render jobs" ON public.video_render_jobs;
CREATE POLICY "Admins manage video render jobs" ON public.video_render_jobs
  FOR ALL TO authenticated USING (
    (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'admin'
  )
  WITH CHECK (
    (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'admin'
  );

-- ── RLS POLICIES FOR VIDEO CONTENT ─────────────────────────────────────

DROP POLICY IF EXISTS "Public read video categories" ON public.video_categories;
CREATE POLICY "Public read video categories" ON public.video_categories
  FOR SELECT TO anon, authenticated
  USING (published IS TRUE AND is_active IS TRUE);

DROP POLICY IF EXISTS "Admins manage video categories" ON public.video_categories;
CREATE POLICY "Admins manage video categories" ON public.video_categories
  FOR ALL TO authenticated USING (
    (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'admin'
  )
  WITH CHECK (
    (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'admin'
  );

DROP POLICY IF EXISTS "Public read videos" ON public.videos;
CREATE POLICY "Public read videos" ON public.videos
  FOR SELECT TO anon, authenticated
  USING (published IS TRUE);

DROP POLICY IF EXISTS "Admins manage videos" ON public.videos;
CREATE POLICY "Admins manage videos" ON public.videos
  FOR ALL TO authenticated USING (
    (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'admin'
  )
  WITH CHECK (
    (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'admin'
  );

-- ── GRANT PUBLIC ACCESS TO CONTENT TABLES ───────────────────────────────

GRANT SELECT ON public.quran_chapters TO anon;
GRANT SELECT ON public.quran_verses TO anon;
GRANT SELECT ON public.hadith TO anon;
GRANT SELECT ON public.stories TO anon;
GRANT SELECT ON public.adhkar TO anon;
GRANT SELECT ON public.reciters TO anon;
GRANT SELECT ON public.video_categories TO anon;
GRANT SELECT ON public.videos TO anon;

-- ══════════════════════════════════════════════════════════════════════════
-- END OF CONSOLIDATED PRODUCTION BASELINE MIGRATION
-- ══════════════════════════════════════════════════════════════════════════
