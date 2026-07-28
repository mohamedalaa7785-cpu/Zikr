-- ============================================================================
-- ZIKR MEDIA - SCHEMA RECONCILIATION MIGRATION
-- Date: 2026-07-27
-- Purpose: Create all Drizzle-defined tables missing from Supabase, add
--          missing columns to existing tables, and apply correct RLS policies.
-- Status: Fully idempotent - safe to re-run.
-- ============================================================================

-- ── STEP 1: ADD MISSING COLUMNS TO EXISTING TABLES ──────────────────────────

-- stories: Drizzle schema has slug/published/mood but NOT is_approved.
-- The consolidated baseline incorrectly referenced is_approved.
-- Add it defensively so both old and new code works.
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'stories' AND column_name = 'is_approved'
  ) THEN
    ALTER TABLE public.stories ADD COLUMN is_approved boolean NOT NULL DEFAULT true;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'stories' AND column_name = 'slug'
  ) THEN
    ALTER TABLE public.stories ADD COLUMN slug text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'stories' AND column_name = 'published'
  ) THEN
    ALTER TABLE public.stories ADD COLUMN published boolean NOT NULL DEFAULT true;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'stories' AND column_name = 'mood'
  ) THEN
    ALTER TABLE public.stories ADD COLUMN mood text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'stories' AND column_name = 'summary'
  ) THEN
    ALTER TABLE public.stories ADD COLUMN summary text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'stories' AND column_name = 'metadata'
  ) THEN
    ALTER TABLE public.stories ADD COLUMN metadata jsonb NOT NULL DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- Now safe to create the index that previously failed
CREATE INDEX IF NOT EXISTS idx_stories_approved ON public.stories (is_approved);
CREATE INDEX IF NOT EXISTS idx_stories_published ON public.stories (published);

-- hadith: add missing columns
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'hadith' AND column_name = 'published'
  ) THEN
    ALTER TABLE public.hadith ADD COLUMN published boolean NOT NULL DEFAULT true;
  END IF;
END $$;

-- profiles: add locale + display_name if missing
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'locale'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN locale text NOT NULL DEFAULT 'ar';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'display_name'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN display_name text;
  END IF;
END $$;

-- ── STEP 2: CREATE NEW CONTENT TABLES ────────────────────────────────────────

-- Quran Surahs (Drizzle table: quran_surahs — different from quran_chapters)
CREATE TABLE IF NOT EXISTS public.quran_surahs (
  id integer NOT NULL PRIMARY KEY,
  name_ar text NOT NULL,
  name_en text NOT NULL,
  name_translation text,
  revelation_place text,
  ayahs_count integer NOT NULL,
  "order" integer NOT NULL,
  slug text NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Quran Ayahs
CREATE TABLE IF NOT EXISTS public.quran_ayahs (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  surah_id integer NOT NULL REFERENCES public.quran_surahs (id) ON DELETE CASCADE,
  ayah_number integer NOT NULL,
  text_ar text NOT NULL,
  text_en text,
  audio_url text,
  text_uthmani text,
  text_simple text,
  page integer,
  juz integer,
  hizb integer,
  rub integer,
  sajda boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT quran_ayahs_unique UNIQUE (surah_id, ayah_number)
);

-- Quran Tafsir
CREATE TABLE IF NOT EXISTS public.quran_tafsir (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  surah_id integer NOT NULL REFERENCES public.quran_surahs (id) ON DELETE CASCADE,
  ayah_number integer NOT NULL,
  tafsir_ar text NOT NULL,
  tafsir_en text,
  author text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT quran_tafsir_unique UNIQUE (surah_id, ayah_number, author)
);

-- Quran Reciters (Drizzle table: quran_reciters)
CREATE TABLE IF NOT EXISTS public.quran_reciters (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar text NOT NULL,
  name_en text NOT NULL,
  code text NOT NULL UNIQUE,
  style text,
  base_url_template text NOT NULL,
  thumbnail_url text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Quran Audio
CREATE TABLE IF NOT EXISTS public.quran_audio (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  surah_id integer NOT NULL REFERENCES public.quran_surahs (id),
  reciter_id uuid NOT NULL REFERENCES public.quran_reciters (id),
  audio_url text NOT NULL,
  duration integer
);

-- Hadith Books
CREATE TABLE IF NOT EXISTS public.hadith_books (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name_ar text NOT NULL,
  name_en text NOT NULL,
  source text NOT NULL,
  author_ar text,
  author_en text,
  hadith_count integer,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Hadiths (new normalized table)
CREATE TABLE IF NOT EXISTS public.hadiths (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id uuid NOT NULL REFERENCES public.hadith_books (id) ON DELETE CASCADE,
  hadith_number text NOT NULL,
  text_ar text NOT NULL,
  text_en text,
  narrator_ar text,
  narrator_en text,
  grade_ar text,
  grade_en text,
  chapter text,
  ref text,
  published boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT hadiths_book_number_unique UNIQUE (book_id, hadith_number)
);

-- Hadith Explanations
CREATE TABLE IF NOT EXISTS public.hadith_explanations (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  hadith_id uuid NOT NULL REFERENCES public.hadiths (id) ON DELETE CASCADE,
  explanation_ar text NOT NULL,
  explanation_en text,
  author text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Scholars
CREATE TABLE IF NOT EXISTS public.scholars (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar text NOT NULL,
  name_en text NOT NULL,
  slug text NOT NULL UNIQUE,
  bio_ar text,
  bio_en text,
  thumbnail_url text,
  website_url text,
  youtube_url text,
  published boolean NOT NULL DEFAULT true,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Prophets
CREATE TABLE IF NOT EXISTS public.prophets (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar text NOT NULL,
  name_en text NOT NULL,
  slug text NOT NULL UNIQUE,
  bio_ar text,
  bio_en text,
  birth_place_ar text,
  death_place_ar text,
  featured_image_url text,
  thumbnail_url text,
  order_num integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Prophet Sections
CREATE TABLE IF NOT EXISTS public.prophet_sections (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  prophet_id uuid NOT NULL REFERENCES public.prophets (id) ON DELETE CASCADE,
  title_ar text NOT NULL,
  title_en text,
  content_ar text NOT NULL,
  content_en text,
  section_type text,
  order_num integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Companions (Sahaba)
CREATE TABLE IF NOT EXISTS public.companions (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar text NOT NULL,
  name_en text NOT NULL,
  slug text NOT NULL UNIQUE,
  bio_ar text,
  bio_en text,
  title_ar text,
  birth_place_ar text,
  death_place_ar text,
  death_year text,
  category text,
  thumbnail_url text,
  featured_image_url text,
  order_num integer,
  published boolean NOT NULL DEFAULT true,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Companion Stories
CREATE TABLE IF NOT EXISTS public.companion_stories (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  companion_id uuid NOT NULL REFERENCES public.companions (id) ON DELETE CASCADE,
  title_ar text NOT NULL,
  title_en text NOT NULL,
  content_ar text NOT NULL,
  content_en text,
  story_type text,
  order_num integer,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Battles
CREATE TABLE IF NOT EXISTS public.battles (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar text NOT NULL,
  name_en text NOT NULL,
  slug text NOT NULL UNIQUE,
  description_ar text,
  description_en text,
  date_hijri text,
  year_hijri integer,
  date_gregorian text,
  location_ar text,
  location_en text,
  thumbnail_url text,
  featured_image_url text,
  order_num integer,
  published boolean NOT NULL DEFAULT true,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Battle Events
CREATE TABLE IF NOT EXISTS public.battle_events (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  battle_id uuid NOT NULL REFERENCES public.battles (id) ON DELETE CASCADE,
  title_ar text NOT NULL,
  title_en text NOT NULL,
  content_ar text NOT NULL,
  content_en text,
  event_type text,
  order_num integer,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Conquests
CREATE TABLE IF NOT EXISTS public.conquests (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar text NOT NULL,
  name_en text NOT NULL,
  slug text NOT NULL UNIQUE,
  description_ar text,
  description_en text,
  date_hijri text,
  date_gregorian text,
  location_ar text,
  location_en text,
  leader_ar text,
  leader_en text,
  thumbnail_url text,
  featured_image_url text,
  order_num integer,
  published boolean NOT NULL DEFAULT true,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Conquest Events
CREATE TABLE IF NOT EXISTS public.conquest_events (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  conquest_id uuid NOT NULL REFERENCES public.conquests (id) ON DELETE CASCADE,
  title_ar text NOT NULL,
  title_en text NOT NULL,
  content_ar text NOT NULL,
  content_en text,
  event_type text,
  order_num integer,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Dua Categories
CREATE TABLE IF NOT EXISTS public.dua_categories (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar text NOT NULL,
  name_en text NOT NULL,
  slug text NOT NULL UNIQUE,
  icon text,
  published boolean NOT NULL DEFAULT true,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Duas
CREATE TABLE IF NOT EXISTS public.duas (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ar text NOT NULL,
  title_en text NOT NULL,
  slug text NOT NULL UNIQUE,
  text_ar text NOT NULL,
  text_en text,
  occasion_ar text,
  occasion_en text,
  source_ar text,
  source_en text,
  benefits_ar text,
  benefits_en text,
  category_id uuid REFERENCES public.dua_categories (id) ON DELETE SET NULL,
  published boolean NOT NULL DEFAULT true,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Article Categories
CREATE TABLE IF NOT EXISTS public.article_categories (
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

-- Articles
CREATE TABLE IF NOT EXISTS public.articles (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES public.article_categories (id) ON DELETE CASCADE,
  title text NOT NULL,
  title_ar text NOT NULL,
  title_en text,
  slug text NOT NULL UNIQUE,
  content text NOT NULL,
  content_ar text NOT NULL,
  content_en text,
  summary text,
  summary_ar text,
  summary_en text,
  author text,
  tags text[] DEFAULT '{}',
  featured_image_url text,
  featured boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT true,
  views integer NOT NULL DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Kids Content
CREATE TABLE IF NOT EXISTS public.kids_content (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ar text NOT NULL,
  title_en text NOT NULL,
  slug text NOT NULL UNIQUE,
  type text NOT NULL,
  content_ar text,
  content_en text,
  age_group text NOT NULL,
  featured_image_url text,
  video_url text,
  quiz_data jsonb,
  published boolean NOT NULL DEFAULT true,
  is_active boolean NOT NULL DEFAULT true,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Tawasheeh Categories
CREATE TABLE IF NOT EXISTS public.tawasheeh_categories (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar text NOT NULL,
  name_en text NOT NULL,
  slug text NOT NULL UNIQUE,
  description_ar text,
  description_en text,
  icon text,
  order_num integer,
  published boolean NOT NULL DEFAULT true,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Tawasheeh
CREATE TABLE IF NOT EXISTS public.tawasheeh (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ar text NOT NULL,
  title_en text NOT NULL,
  slug text NOT NULL UNIQUE,
  description_ar text,
  description_en text,
  artist_ar text,
  artist_en text,
  category_id uuid REFERENCES public.tawasheeh_categories (id) ON DELETE SET NULL,
  audio_url text,
  thumbnail_url text,
  duration integer,
  views integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  featured boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Tawasheeh Favorites
CREATE TABLE IF NOT EXISTS public.tawasheeh_favorites (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  tawasheeh_id uuid NOT NULL REFERENCES public.tawasheeh (id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Tawasheeh Playlists
CREATE TABLE IF NOT EXISTS public.tawasheeh_playlists (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  is_public boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Tawasheeh Playlist Items
CREATE TABLE IF NOT EXISTS public.tawasheeh_playlist_items (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id uuid NOT NULL REFERENCES public.tawasheeh_playlists (id) ON DELETE CASCADE,
  tawasheeh_id uuid NOT NULL REFERENCES public.tawasheeh (id) ON DELETE CASCADE,
  order_num integer,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Reciter Favorites
CREATE TABLE IF NOT EXISTS public.reciter_favorites (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  reciter_id uuid NOT NULL REFERENCES public.quran_reciters (id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Recent Recitations
CREATE TABLE IF NOT EXISTS public.recent_recitations (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  reciter_id uuid NOT NULL REFERENCES public.quran_reciters (id) ON DELETE CASCADE,
  surah_id integer NOT NULL,
  ayah_number integer,
  played_at timestamp with time zone NOT NULL DEFAULT now(),
  duration_listened integer,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Prayer Locations
CREATE TABLE IF NOT EXISTS public.prayer_locations (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  city text NOT NULL,
  country text,
  latitude numeric,
  longitude numeric,
  timezone text,
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Prayer Preferences
CREATE TABLE IF NOT EXISTS public.prayer_preferences (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES public.profiles (id) ON DELETE CASCADE,
  calculation_method text DEFAULT 'umm-al-qura',
  madhab text DEFAULT 'shafi',
  high_latitude_method text DEFAULT 'middle-of-night',
  asr_method text DEFAULT 'shafi',
  midnight_method text DEFAULT 'standard',
  notifications_enabled boolean NOT NULL DEFAULT true,
  adhan_enabled boolean NOT NULL DEFAULT true,
  adhan_volume integer NOT NULL DEFAULT 70,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Prayer Notifications
CREATE TABLE IF NOT EXISTS public.prayer_notifications (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  prayer_name text NOT NULL,
  notification_time timestamp with time zone NOT NULL,
  sent_at timestamp with time zone,
  status text DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Memorization Plans
CREATE TABLE IF NOT EXISTS public.memorization_plans (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  cadence text NOT NULL DEFAULT 'daily',
  target_ref text,
  prompt text,
  tajweed_focus text,
  published boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Memorization Progress
CREATE TABLE IF NOT EXISTS public.memorization_progress (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  surah_number integer NOT NULL,
  surah_name text NOT NULL,
  total_ayahs integer NOT NULL,
  memorized_ayahs integer NOT NULL DEFAULT 0,
  last_reviewed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT memorization_progress_user_surah UNIQUE (user_id, surah_number)
);

-- Competition
CREATE TABLE IF NOT EXISTS public.competitions (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  prize text,
  starts_at timestamp with time zone,
  ends_at timestamp with time zone,
  published boolean NOT NULL DEFAULT false,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Pinned Messages
CREATE TABLE IF NOT EXISTS public.pinned_messages (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  body text,
  type text,
  is_active boolean NOT NULL DEFAULT true,
  start_at timestamp with time zone,
  end_at timestamp with time zone,
  priority integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Site Settings
CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- User Subscriptions
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles (id),
  plan text NOT NULL DEFAULT 'free',
  credits integer NOT NULL DEFAULT 20,
  expires_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Payments
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles (id),
  amount integer NOT NULL,
  method text NOT NULL,
  reference_note text NOT NULL,
  screenshot_url text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Contacts
CREATE TABLE IF NOT EXISTS public.contacts (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  language text NOT NULL DEFAULT 'ar',
  read boolean NOT NULL DEFAULT false,
  notification_sent boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Episodes
CREATE TABLE IF NOT EXISTS public.episodes (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title_en text NOT NULL,
  title_ar text NOT NULL,
  description_en text NOT NULL,
  description_ar text NOT NULL,
  content_en text NOT NULL,
  content_ar text NOT NULL,
  keywords_en text,
  keywords_ar text,
  category text,
  thumbnail_url text,
  youtube_video_id text,
  published_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Subscriptions (email newsletter)
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  language text NOT NULL DEFAULT 'ar',
  verified boolean NOT NULL DEFAULT false,
  verification_token text,
  subscribed_at timestamp with time zone NOT NULL DEFAULT now(),
  unsubscribed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Bookmarks
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  item_type text NOT NULL,
  item_ref text NOT NULL,
  label text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Search History
CREATE TABLE IF NOT EXISTS public.search_history (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  query text NOT NULL,
  searched_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  title text NOT NULL,
  body text,
  type text,
  read boolean NOT NULL DEFAULT false,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Quran Reads
CREATE TABLE IF NOT EXISTS public.quran_reads (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  surah_id integer NOT NULL,
  ayah_number integer NOT NULL,
  read_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Story Reads
CREATE TABLE IF NOT EXISTS public.story_reads (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  story_id uuid NOT NULL REFERENCES public.stories (id) ON DELETE CASCADE,
  read_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT story_reads_unique UNIQUE (user_id, story_id)
);

-- Story Ratings
CREATE TABLE IF NOT EXISTS public.story_ratings (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  story_id uuid NOT NULL REFERENCES public.stories (id) ON DELETE CASCADE,
  rating smallint NOT NULL,
  comment text,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT story_ratings_unique UNIQUE (user_id, story_id)
);

-- Story Favorites
CREATE TABLE IF NOT EXISTS public.story_favorites (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  story_id uuid NOT NULL REFERENCES public.stories (id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT story_favorites_unique UNIQUE (user_id, story_id)
);

-- Saved Stories
CREATE TABLE IF NOT EXISTS public.saved_stories (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles (id),
  story_id uuid NOT NULL REFERENCES public.stories (id),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Story Progress
CREATE TABLE IF NOT EXISTS public.story_progress (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles (id),
  story_id uuid NOT NULL REFERENCES public.stories (id),
  progress integer NOT NULL DEFAULT 0,
  completed boolean NOT NULL DEFAULT false,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Reminders
CREATE TABLE IF NOT EXISTS public.reminders (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  type text NOT NULL,
  schedule_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Quran Favorites
CREATE TABLE IF NOT EXISTS public.quran_favorites (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  surah_id integer NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT quran_favorites_unique UNIQUE (user_id, surah_id)
);

-- Adhkar Completions
CREATE TABLE IF NOT EXISTS public.adhkar_completions (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  adhkar_id text NOT NULL,
  completed_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Adhkar Streaks
CREATE TABLE IF NOT EXISTS public.adhkar_streaks (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  streak integer NOT NULL DEFAULT 0,
  last_completed_at timestamp with time zone,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT adhkar_streaks_user_unique UNIQUE (user_id)
);

-- Notification Settings
CREATE TABLE IF NOT EXISTS public.notification_settings (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  email_notifications boolean NOT NULL DEFAULT true,
  push_notifications boolean NOT NULL DEFAULT true,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT notification_settings_user_unique UNIQUE (user_id)
);

-- App Settings
CREATE TABLE IF NOT EXISTS public.app_settings (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  theme text NOT NULL DEFAULT 'system',
  font_size text NOT NULL DEFAULT 'medium',
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT app_settings_user_unique UNIQUE (user_id)
);

-- Prophet Notes
CREATE TABLE IF NOT EXISTS public.prophet_notes (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  prophet_id text NOT NULL,
  note text NOT NULL,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT prophet_notes_user_prophet_unique UNIQUE (user_id, prophet_id)
);

-- Social Shares
CREATE TABLE IF NOT EXISTS public.social_shares (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  content_type text NOT NULL,
  content_id text NOT NULL,
  platform text,
  shared_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Video Generation Requests
CREATE TABLE IF NOT EXISTS public.video_generation_requests (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL,
  content jsonb NOT NULL,
  duration integer,
  thumbnail_url text,
  status text NOT NULL DEFAULT 'pending',
  youtube_id text,
  facebook_id text,
  video_url text,
  error_message text,
  error_details text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Video Publish Log
CREATE TABLE IF NOT EXISTS public.video_publish_log (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id uuid REFERENCES public.video_generation_requests (id) ON DELETE SET NULL,
  youtube_id text,
  facebook_id text,
  status text NOT NULL DEFAULT 'success',
  published_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Video Publishing Config
CREATE TABLE IF NOT EXISTS public.video_publishing_config (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  youtube_enabled boolean NOT NULL DEFAULT false,
  youtube_channel_id text,
  facebook_enabled boolean NOT NULL DEFAULT false,
  facebook_page_id text,
  auto_publish boolean NOT NULL DEFAULT false,
  publish_schedule text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Research Requests
CREATE TABLE IF NOT EXISTS public.research_requests (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles (id),
  title text NOT NULL,
  field text NOT NULL,
  pages integer NOT NULL DEFAULT 3,
  type text NOT NULL,
  language text NOT NULL DEFAULT 'en',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Generated Research
CREATE TABLE IF NOT EXISTS public.generated_research (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid REFERENCES public.research_requests (id),
  content text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- ── STEP 3: INDEXES FOR NEW TABLES ───────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_quran_surahs_order ON public.quran_surahs ("order");
CREATE INDEX IF NOT EXISTS idx_quran_ayahs_surah ON public.quran_ayahs (surah_id);
CREATE INDEX IF NOT EXISTS idx_quran_ayahs_page ON public.quran_ayahs (page);
CREATE INDEX IF NOT EXISTS idx_quran_ayahs_juz ON public.quran_ayahs (juz);
CREATE INDEX IF NOT EXISTS idx_hadiths_book ON public.hadiths (book_id);
CREATE INDEX IF NOT EXISTS idx_hadiths_published ON public.hadiths (published);
CREATE INDEX IF NOT EXISTS idx_prophets_slug ON public.prophets (slug);
CREATE INDEX IF NOT EXISTS idx_prophets_order ON public.prophets (order_num);
CREATE INDEX IF NOT EXISTS idx_companions_slug ON public.companions (slug);
CREATE INDEX IF NOT EXISTS idx_companions_published ON public.companions (published);
CREATE INDEX IF NOT EXISTS idx_battles_slug ON public.battles (slug);
CREATE INDEX IF NOT EXISTS idx_conquests_slug ON public.conquests (slug);
CREATE INDEX IF NOT EXISTS idx_duas_slug ON public.duas (slug);
CREATE INDEX IF NOT EXISTS idx_duas_category ON public.duas (category_id);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles (slug);
CREATE INDEX IF NOT EXISTS idx_articles_published ON public.articles (published);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles (category_id);
CREATE INDEX IF NOT EXISTS idx_kids_content_slug ON public.kids_content (slug);
CREATE INDEX IF NOT EXISTS idx_kids_content_type ON public.kids_content (type);
CREATE INDEX IF NOT EXISTS idx_tawasheeh_slug ON public.tawasheeh (slug);
CREATE INDEX IF NOT EXISTS idx_tawasheeh_featured ON public.tawasheeh (featured);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON public.bookmarks (user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications (user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications (read);
CREATE INDEX IF NOT EXISTS idx_memorization_progress_user ON public.memorization_progress (user_id);
CREATE INDEX IF NOT EXISTS idx_prayer_locations_user ON public.prayer_locations (user_id);
CREATE INDEX IF NOT EXISTS idx_quran_reads_user ON public.quran_reads (user_id);
CREATE INDEX IF NOT EXISTS idx_recent_recitations_user ON public.recent_recitations (user_id);

-- ── STEP 4: ENABLE RLS ON ALL NEW TABLES ─────────────────────────────────────

-- Public content tables (RLS enabled but world-readable)
ALTER TABLE public.quran_surahs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quran_ayahs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quran_tafsir ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quran_reciters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quran_audio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hadith_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hadiths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hadith_explanations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prophets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prophet_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companion_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.battles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.battle_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conquests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conquest_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dua_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.duas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kids_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tawasheeh_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tawasheeh ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pinned_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memorization_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.episodes ENABLE ROW LEVEL SECURITY;

-- User-owned tables
ALTER TABLE public.quran_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quran_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adhkar_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adhkar_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prophet_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tawasheeh_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tawasheeh_playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tawasheeh_playlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reciter_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recent_recitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memorization_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_research ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_generation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_publish_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_publishing_config ENABLE ROW LEVEL SECURITY;

-- ── STEP 5: RLS POLICIES ─────────────────────────────────────────────────────

-- Public read policies for content tables
DO $$
DECLARE
  tbl text;
  public_tables text[] := ARRAY[
    'quran_surahs', 'quran_ayahs', 'quran_tafsir', 'quran_reciters', 'quran_audio',
    'hadith_books', 'hadiths', 'hadith_explanations', 'scholars',
    'prophets', 'prophet_sections', 'companions', 'companion_stories',
    'battles', 'battle_events', 'conquests', 'conquest_events',
    'dua_categories', 'duas', 'article_categories', 'articles',
    'kids_content', 'tawasheeh_categories', 'tawasheeh',
    'competitions', 'pinned_messages', 'memorization_plans', 'episodes'
  ];
BEGIN
  FOREACH tbl IN ARRAY public_tables LOOP
    EXECUTE format('DROP POLICY IF EXISTS "public_read_%s" ON public.%I', tbl, tbl);
    EXECUTE format(
      'CREATE POLICY "public_read_%s" ON public.%I FOR SELECT TO anon, authenticated USING (true)',
      tbl, tbl
    );
  END LOOP;
END $$;

-- Admin write policies for content tables
DO $$
DECLARE
  tbl text;
  content_tables text[] := ARRAY[
    'quran_surahs', 'quran_ayahs', 'quran_tafsir', 'quran_reciters', 'quran_audio',
    'hadith_books', 'hadiths', 'hadith_explanations', 'scholars',
    'prophets', 'prophet_sections', 'companions', 'companion_stories',
    'battles', 'battle_events', 'conquests', 'conquest_events',
    'dua_categories', 'duas', 'article_categories', 'articles',
    'kids_content', 'tawasheeh_categories', 'tawasheeh',
    'competitions', 'pinned_messages', 'memorization_plans',
    'site_settings', 'video_generation_requests', 'video_publish_log',
    'video_publishing_config'
  ];
BEGIN
  FOREACH tbl IN ARRAY content_tables LOOP
    EXECUTE format('DROP POLICY IF EXISTS "admin_write_%s" ON public.%I', tbl, tbl);
    EXECUTE format(
      $policy$
        CREATE POLICY "admin_write_%s" ON public.%I
        FOR ALL TO authenticated
        USING (
          EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = (SELECT auth.uid()) AND profiles.role = 'admin'
          )
        )
        WITH CHECK (
          EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = (SELECT auth.uid()) AND profiles.role = 'admin'
          )
        )
      $policy$,
      tbl, tbl
    );
  END LOOP;
END $$;

-- User-owned table policies (select/insert/update/delete scoped to user_id)
DO $$
DECLARE
  tbl text;
  user_tables text[] := ARRAY[
    'quran_favorites', 'bookmarks', 'search_history', 'notifications',
    'quran_reads', 'story_reads', 'story_ratings', 'story_favorites',
    'saved_stories', 'story_progress', 'reminders', 'adhkar_completions',
    'adhkar_streaks', 'notification_settings', 'app_settings', 'prophet_notes',
    'social_shares', 'tawasheeh_favorites', 'tawasheeh_playlists',
    'reciter_favorites', 'recent_recitations',
    'prayer_locations', 'prayer_preferences', 'prayer_notifications',
    'memorization_progress', 'user_subscriptions', 'payments',
    'research_requests'
  ];
BEGIN
  FOREACH tbl IN ARRAY user_tables LOOP
    EXECUTE format('DROP POLICY IF EXISTS "user_select_%s" ON public.%I', tbl, tbl);
    EXECUTE format('DROP POLICY IF EXISTS "user_insert_%s" ON public.%I', tbl, tbl);
    EXECUTE format('DROP POLICY IF EXISTS "user_update_%s" ON public.%I', tbl, tbl);
    EXECUTE format('DROP POLICY IF EXISTS "user_delete_%s" ON public.%I', tbl, tbl);

    EXECUTE format(
      'CREATE POLICY "user_select_%s" ON public.%I FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id)',
      tbl, tbl
    );
    EXECUTE format(
      'CREATE POLICY "user_insert_%s" ON public.%I FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = user_id)',
      tbl, tbl
    );
    EXECUTE format(
      'CREATE POLICY "user_update_%s" ON public.%I FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id)',
      tbl, tbl
    );
    EXECUTE format(
      'CREATE POLICY "user_delete_%s" ON public.%I FOR DELETE TO authenticated USING ((SELECT auth.uid()) = user_id)',
      tbl, tbl
    );
  END LOOP;
END $$;

-- Tawasheeh playlist items are owned through their parent playlist.
DROP POLICY IF EXISTS "user_select_tawasheeh_playlist_items" ON public.tawasheeh_playlist_items;
DROP POLICY IF EXISTS "user_insert_tawasheeh_playlist_items" ON public.tawasheeh_playlist_items;
DROP POLICY IF EXISTS "user_update_tawasheeh_playlist_items" ON public.tawasheeh_playlist_items;
DROP POLICY IF EXISTS "user_delete_tawasheeh_playlist_items" ON public.tawasheeh_playlist_items;

CREATE POLICY "user_select_tawasheeh_playlist_items" ON public.tawasheeh_playlist_items
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.tawasheeh_playlists p
      WHERE p.id = playlist_id AND p.user_id = (SELECT auth.uid())
    )
  );
CREATE POLICY "user_insert_tawasheeh_playlist_items" ON public.tawasheeh_playlist_items
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.tawasheeh_playlists p
      WHERE p.id = playlist_id AND p.user_id = (SELECT auth.uid())
    )
  );
CREATE POLICY "user_update_tawasheeh_playlist_items" ON public.tawasheeh_playlist_items
  FOR UPDATE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.tawasheeh_playlists p
      WHERE p.id = playlist_id AND p.user_id = (SELECT auth.uid())
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.tawasheeh_playlists p
      WHERE p.id = playlist_id AND p.user_id = (SELECT auth.uid())
    )
  );
CREATE POLICY "user_delete_tawasheeh_playlist_items" ON public.tawasheeh_playlist_items
  FOR DELETE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.tawasheeh_playlists p
      WHERE p.id = playlist_id AND p.user_id = (SELECT auth.uid())
    )
  );

-- Generated research is owned through its parent research request.
DROP POLICY IF EXISTS "user_select_generated_research" ON public.generated_research;
DROP POLICY IF EXISTS "user_insert_generated_research" ON public.generated_research;
DROP POLICY IF EXISTS "user_update_generated_research" ON public.generated_research;
DROP POLICY IF EXISTS "user_delete_generated_research" ON public.generated_research;

CREATE POLICY "user_select_generated_research" ON public.generated_research
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.research_requests r
      WHERE r.id = request_id AND r.user_id = (SELECT auth.uid())
    )
  );
CREATE POLICY "user_insert_generated_research" ON public.generated_research
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.research_requests r
      WHERE r.id = request_id AND r.user_id = (SELECT auth.uid())
    )
  );
CREATE POLICY "user_update_generated_research" ON public.generated_research
  FOR UPDATE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.research_requests r
      WHERE r.id = request_id AND r.user_id = (SELECT auth.uid())
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.research_requests r
      WHERE r.id = request_id AND r.user_id = (SELECT auth.uid())
    )
  );
CREATE POLICY "user_delete_generated_research" ON public.generated_research
  FOR DELETE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.research_requests r
      WHERE r.id = request_id AND r.user_id = (SELECT auth.uid())
    )
  );

-- Contacts: any authenticated user can insert, admins can read all
DROP POLICY IF EXISTS "contacts_insert" ON public.contacts;
CREATE POLICY "contacts_insert" ON public.contacts
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "contacts_admin_read" ON public.contacts;
CREATE POLICY "contacts_admin_read" ON public.contacts
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = (SELECT auth.uid()) AND profiles.role = 'admin')
  );

-- Subscriptions: public insert
DROP POLICY IF EXISTS "subscriptions_public_insert" ON public.subscriptions;
CREATE POLICY "subscriptions_public_insert" ON public.subscriptions
  FOR INSERT TO anon, authenticated WITH CHECK (email IS NOT NULL);

DROP POLICY IF EXISTS "subscriptions_admin_read" ON public.subscriptions;
CREATE POLICY "subscriptions_admin_read" ON public.subscriptions
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = (SELECT auth.uid()) AND profiles.role = 'admin')
  );

-- ── STEP 6: GRANT SELECT ON ALL PUBLIC CONTENT TABLES ────────────────────────

GRANT SELECT ON public.quran_surahs TO anon;
GRANT SELECT ON public.quran_ayahs TO anon;
GRANT SELECT ON public.quran_tafsir TO anon;
GRANT SELECT ON public.quran_reciters TO anon;
GRANT SELECT ON public.quran_audio TO anon;
GRANT SELECT ON public.hadith_books TO anon;
GRANT SELECT ON public.hadiths TO anon;
GRANT SELECT ON public.hadith_explanations TO anon;
GRANT SELECT ON public.scholars TO anon;
GRANT SELECT ON public.prophets TO anon;
GRANT SELECT ON public.prophet_sections TO anon;
GRANT SELECT ON public.companions TO anon;
GRANT SELECT ON public.companion_stories TO anon;
GRANT SELECT ON public.battles TO anon;
GRANT SELECT ON public.battle_events TO anon;
GRANT SELECT ON public.conquests TO anon;
GRANT SELECT ON public.conquest_events TO anon;
GRANT SELECT ON public.dua_categories TO anon;
GRANT SELECT ON public.duas TO anon;
GRANT SELECT ON public.article_categories TO anon;
GRANT SELECT ON public.articles TO anon;
GRANT SELECT ON public.kids_content TO anon;
GRANT SELECT ON public.tawasheeh_categories TO anon;
GRANT SELECT ON public.tawasheeh TO anon;
GRANT SELECT ON public.competitions TO anon;
GRANT SELECT ON public.pinned_messages TO anon;
GRANT SELECT ON public.memorization_plans TO anon;
GRANT SELECT ON public.episodes TO anon;

-- ══════════════════════════════════════════════════════════════════════════════
-- END OF SCHEMA RECONCILIATION MIGRATION
-- ══════════════════════════════════════════════════════════════════════════════
