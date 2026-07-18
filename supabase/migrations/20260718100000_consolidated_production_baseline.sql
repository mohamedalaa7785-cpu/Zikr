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

CREATE TYPE IF NOT EXISTS public.user_role AS ENUM ('user', 'admin');

CREATE TYPE IF NOT EXISTS public.favorite_item_type AS ENUM (
  'quran',
  'hadith',
  'story',
  'scholar',
  'dua'
);

CREATE TYPE IF NOT EXISTS public.progress_scope AS ENUM (
  'quran',
  'hadith',
  'stories'
);

CREATE TYPE IF NOT EXISTS public.reminder_type AS ENUM (
  'prayer',
  'quran',
  'adhkar',
  'fasting',
  'zakat'
);

CREATE TYPE IF NOT EXISTS public.category AS ENUM (
  'dark',
  'romantic',
  'psychological',
  'prophets',
  'stories',
  'duas',
  'hadith',
  'quran'
);

CREATE TYPE IF NOT EXISTS public.payment_status AS ENUM (
  'pending',
  'approved',
  'rejected'
);

CREATE TYPE IF NOT EXISTS public.subscription_plan AS ENUM (
  'free',
  'pro',
  'premium'
);

CREATE TYPE IF NOT EXISTS public.job_status AS ENUM (
  'pending',
  'processing',
  'completed',
  'failed'
);

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

-- Videos
CREATE TABLE IF NOT EXISTS public.videos (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category public.category,
  youtube_url text,
  youtube_id text,
  duration_seconds integer,
  thumbnail_url text,
  view_count integer DEFAULT 0,
  is_published boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
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

-- Social Publishing Queue
CREATE TABLE IF NOT EXISTS public.social_publishing_queue (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id text NOT NULL,
  content_type text NOT NULL,
  platform text NOT NULL,
  status public.job_status DEFAULT 'pending'::public.job_status,
  scheduled_at timestamp with time zone,
  published_at timestamp with time zone,
  publish_result jsonb,
  error_message text,
  is_active boolean DEFAULT true,
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
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles (email);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles (username);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles (role);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription ON public.profiles (subscription_plan);

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
CREATE INDEX IF NOT EXISTS idx_videos_category ON public.videos (category);
CREATE INDEX IF NOT EXISTS idx_videos_published ON public.videos (is_published);
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
CREATE INDEX IF NOT EXISTS idx_social_pub_queue_status ON public.social_publishing_queue (status);
CREATE INDEX IF NOT EXISTS idx_social_pub_queue_platform ON public.social_publishing_queue (platform);
CREATE INDEX IF NOT EXISTS idx_social_pub_queue_scheduled ON public.social_publishing_queue (scheduled_at);

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

-- ── RLS POLICIES FOR PROFILES ───────────────────────────────────────────

-- Allow public read access to profiles
CREATE POLICY IF NOT EXISTS "Profiles are public" ON public.profiles
  FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY IF NOT EXISTS "Users update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can delete profiles
CREATE POLICY IF NOT EXISTS "Only admins can delete profiles" ON public.profiles
  FOR DELETE USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

-- ── RLS POLICIES FOR FAVORITES ──────────────────────────────────────────

-- Users see only their own favorites
CREATE POLICY IF NOT EXISTS "Users see own favorites" ON public.favorites
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own favorites
CREATE POLICY IF NOT EXISTS "Users create own favorites" ON public.favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete their own favorites
CREATE POLICY IF NOT EXISTS "Users delete own favorites" ON public.favorites
  FOR DELETE USING (auth.uid() = user_id);

-- ── RLS POLICIES FOR READING_PROGRESS ───────────────────────────────────

-- Users see only their own reading progress
CREATE POLICY IF NOT EXISTS "Users see own reading progress" ON public.reading_progress
  FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own reading progress
CREATE POLICY IF NOT EXISTS "Users update own reading progress" ON public.reading_progress
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can create their own reading progress
CREATE POLICY IF NOT EXISTS "Users create own reading progress" ON public.reading_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ── RLS POLICIES FOR PRAYER_TIMES ───────────────────────────────────────

-- Users see only their own prayer times
CREATE POLICY IF NOT EXISTS "Users see own prayer times" ON public.prayer_times
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own prayer times
CREATE POLICY IF NOT EXISTS "Users create own prayer times" ON public.prayer_times
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own prayer times
CREATE POLICY IF NOT EXISTS "Users update own prayer times" ON public.prayer_times
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── RLS POLICIES FOR ADMIN_LOGS ─────────────────────────────────────────

-- Admins see all logs
CREATE POLICY IF NOT EXISTS "Admins see all logs" ON public.admin_logs
  FOR SELECT USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

-- Users see only their own logs
CREATE POLICY IF NOT EXISTS "Users see own logs" ON public.admin_logs
  FOR SELECT USING (auth.uid() = admin_id);

-- ── RLS POLICIES FOR MODERATION_QUEUE ───────────────────────────────────

-- Only admins can access moderation queue
CREATE POLICY IF NOT EXISTS "Only admins access moderation" ON public.moderation_queue
  FOR SELECT USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY IF NOT EXISTS "Only admins update moderation" ON public.moderation_queue
  FOR UPDATE USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  )
  WITH CHECK (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

-- ── GRANT PUBLIC ACCESS TO CONTENT TABLES ───────────────────────────────

GRANT SELECT ON public.quran_chapters TO anon;
GRANT SELECT ON public.quran_verses TO anon;
GRANT SELECT ON public.hadith TO anon;
GRANT SELECT ON public.stories TO anon;
GRANT SELECT ON public.adhkar TO anon;
GRANT SELECT ON public.reciters TO anon;
GRANT SELECT ON public.videos TO anon;

-- ══════════════════════════════════════════════════════════════════════════
-- END OF CONSOLIDATED PRODUCTION BASELINE MIGRATION
-- ══════════════════════════════════════════════════════════════════════════
