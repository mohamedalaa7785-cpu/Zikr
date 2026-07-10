-- =============================================================================
-- Migration: 0022_master_schema.sql
-- Description: Complete, authoritative, fully-idempotent master schema for Zikr.
--   This migration is safe to run on any existing database state.
--   It supersedes all previous fragmented migrations and brings the live
--   Supabase database to exact parity with drizzle/schema.ts.
-- =============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- EXTENSIONS
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------------------------------------
-- ENUM TYPES (guarded)
-- ---------------------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE public.role AS ENUM ('user', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.favorite_item_type AS ENUM ('quran', 'hadith', 'story', 'scholar', 'dua');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.progress_scope AS ENUM ('quran', 'hadith', 'stories');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.reminder_type AS ENUM ('prayer', 'quran', 'adhkar', 'fasting', 'zakat');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.plan AS ENUM ('free', 'pro', 'premium');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.payment_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.status AS ENUM ('pending', 'completed', 'failed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.category AS ENUM ('dark', 'romantic', 'psychological');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------------------------------------------------------------------------
-- USER / AUTH TABLES
-- ---------------------------------------------------------------------------

-- profiles: mirrors auth.users, auto-created by trigger
CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT,
  display_name  TEXT,
  avatar_url    TEXT,
  locale        TEXT NOT NULL DEFAULT 'ar',
  role          public.role NOT NULL DEFAULT 'user',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add email column to profiles if it was created before this migration
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Auto-create profile trigger
CREATE OR REPLACE FUNCTION public.create_profile_for_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture')
  )
  ON CONFLICT (id) DO UPDATE SET
    email        = EXCLUDED.email,
    display_name = COALESCE(EXCLUDED.display_name, profiles.display_name),
    avatar_url   = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
    updated_at   = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_profile_for_new_user();

-- favorites
CREATE TABLE IF NOT EXISTS public.favorites (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  item_type   public.favorite_item_type NOT NULL,
  item_ref    TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS favorites_user_item_unique ON public.favorites (user_id, item_type, item_ref);

-- reading_progress
CREATE TABLE IF NOT EXISTS public.reading_progress (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  scope         public.progress_scope NOT NULL,
  ref           TEXT NOT NULL,
  progress_json JSONB NOT NULL DEFAULT '{}',
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS reading_progress_user_scope_ref_unique ON public.reading_progress (user_id, scope, ref);

-- reminders
CREATE TABLE IF NOT EXISTS public.reminders (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type          public.reminder_type NOT NULL,
  schedule_json JSONB NOT NULL DEFAULT '{}',
  enabled       BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- quran_favorites
CREATE TABLE IF NOT EXISTS public.quran_favorites (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL,
  surah_id    INTEGER NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, surah_id)
);

-- bookmarks
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL,
  item_type   TEXT NOT NULL,
  item_ref    TEXT NOT NULL,
  label       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- search_history
CREATE TABLE IF NOT EXISTS public.search_history (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL,
  query       TEXT NOT NULL,
  searched_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- quran_reads
CREATE TABLE IF NOT EXISTS public.quran_reads (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL,
  surah_id    INTEGER NOT NULL,
  ayah_number INTEGER NOT NULL,
  read_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- story_reads
CREATE TABLE IF NOT EXISTS public.story_reads (
  id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id  UUID NOT NULL,
  story_id UUID NOT NULL,
  read_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, story_id)
);

-- story_ratings
CREATE TABLE IF NOT EXISTS public.story_ratings (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL,
  story_id   UUID NOT NULL,
  rating     SMALLINT NOT NULL,
  comment    TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, story_id)
);

-- story_favorites
CREATE TABLE IF NOT EXISTS public.story_favorites (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL,
  story_id   UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, story_id)
);

-- social_shares
CREATE TABLE IF NOT EXISTS public.social_shares (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL,
  content_type TEXT NOT NULL,
  content_id   TEXT NOT NULL,
  platform     TEXT,
  shared_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- prophet_notes
CREATE TABLE IF NOT EXISTS public.prophet_notes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL,
  prophet_id  TEXT NOT NULL,
  note        TEXT NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, prophet_id)
);

-- notification_settings
CREATE TABLE IF NOT EXISTS public.notification_settings (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID NOT NULL,
  "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
  "pushNotifications"  BOOLEAN NOT NULL DEFAULT true,
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

-- adhkar_completions
CREATE TABLE IF NOT EXISTS public.adhkar_completions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL,
  adhkar_id     TEXT NOT NULL,
  completed_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- adhkar_streaks
CREATE TABLE IF NOT EXISTS public.adhkar_streaks (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL,
  streak            INTEGER NOT NULL DEFAULT 0,
  last_completed_at TIMESTAMPTZ,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

-- app_settings
CREATE TABLE IF NOT EXISTS public.app_settings (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL,
  theme      TEXT NOT NULL DEFAULT 'system',
  "fontSize" TEXT NOT NULL DEFAULT 'medium',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

-- notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL,
  title      TEXT NOT NULL,
  body       TEXT,
  type       TEXT,
  read       BOOLEAN NOT NULL DEFAULT false,
  metadata   JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- prayer_locations
CREATE TABLE IF NOT EXISTS public.prayer_locations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  city        TEXT NOT NULL,
  country     TEXT,
  latitude    NUMERIC,
  longitude   NUMERIC,
  timezone    TEXT,
  is_default  BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- prayer_preferences
CREATE TABLE IF NOT EXISTS public.prayer_preferences (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  calculation_method    TEXT DEFAULT 'umm-al-qura',
  madhab                TEXT DEFAULT 'shafi',
  high_latitude_method  TEXT DEFAULT 'middle-of-night',
  asr_method            TEXT DEFAULT 'shafi',
  midnight_method       TEXT DEFAULT 'standard',
  notifications_enabled BOOLEAN NOT NULL DEFAULT true,
  adhan_enabled         BOOLEAN NOT NULL DEFAULT true,
  adhan_volume          INTEGER NOT NULL DEFAULT 70,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- prayer_notifications
CREATE TABLE IF NOT EXISTS public.prayer_notifications (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  prayer_name       TEXT NOT NULL,
  notification_time TIMESTAMPTZ NOT NULL,
  sent_at           TIMESTAMPTZ,
  status            TEXT DEFAULT 'pending',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- tawasheeh_favorites
CREATE TABLE IF NOT EXISTS public.tawasheeh_favorites (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tawasheeh_id UUID NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- tawasheeh_playlists
CREATE TABLE IF NOT EXISTS public.tawasheeh_playlists (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  is_public   BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- tawasheeh_playlist_items
CREATE TABLE IF NOT EXISTS public.tawasheeh_playlist_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id  UUID NOT NULL REFERENCES public.tawasheeh_playlists(id) ON DELETE CASCADE,
  tawasheeh_id UUID NOT NULL,
  order_num    INTEGER,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- reciter_favorites
CREATE TABLE IF NOT EXISTS public.reciter_favorites (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reciter_id  UUID NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- recent_recitations
CREATE TABLE IF NOT EXISTS public.recent_recitations (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reciter_id        UUID NOT NULL,
  surah_id          INTEGER NOT NULL,
  ayah_number       INTEGER,
  played_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  duration_listened INTEGER,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- user_subscriptions
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan       public.plan NOT NULL DEFAULT 'free',
  credits    INTEGER NOT NULL DEFAULT 20,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- payments
CREATE TABLE IF NOT EXISTS public.payments (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID,
  amount         INTEGER NOT NULL,
  method         TEXT NOT NULL,
  reference_note TEXT NOT NULL,
  screenshot_url TEXT,
  status         public.payment_status NOT NULL DEFAULT 'pending',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- research_requests
CREATE TABLE IF NOT EXISTS public.research_requests (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID,
  title      TEXT NOT NULL,
  field      TEXT NOT NULL,
  pages      INTEGER NOT NULL DEFAULT 3,
  type       TEXT NOT NULL,
  language   TEXT NOT NULL DEFAULT 'en',
  status     public.status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- generated_research
CREATE TABLE IF NOT EXISTS public.generated_research (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES public.research_requests(id) ON DELETE CASCADE,
  content    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- LEGACY / COMPAT TABLES (kept for backward compatibility with old code)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.users (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "openId"       TEXT UNIQUE,
  name           TEXT,
  email          TEXT UNIQUE,
  "loginMethod"  TEXT,
  role           public.role NOT NULL DEFAULT 'user',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_signed_in TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.contacts (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name               TEXT NOT NULL,
  email              TEXT NOT NULL,
  subject            TEXT NOT NULL,
  message            TEXT NOT NULL,
  language           TEXT NOT NULL DEFAULT 'en',
  read               BOOLEAN NOT NULL DEFAULT false,
  "notificationSent" BOOLEAN NOT NULL DEFAULT false,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email               TEXT NOT NULL UNIQUE,
  language            TEXT NOT NULL DEFAULT 'en',
  verified            BOOLEAN NOT NULL DEFAULT false,
  "verificationToken" TEXT,
  subscribed_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  unsubscribed_at     TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.episodes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT NOT NULL UNIQUE,
  "titleEn"       TEXT NOT NULL,
  "titleAr"       TEXT NOT NULL,
  "descriptionEn" TEXT NOT NULL,
  "descriptionAr" TEXT NOT NULL,
  "contentEn"     TEXT NOT NULL,
  "contentAr"     TEXT NOT NULL,
  "keywordsEn"    TEXT,
  "keywordsAr"    TEXT,
  category        TEXT,
  "thumbnailUrl"  TEXT,
  "youtubeVideoId" TEXT,
  published_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.tasks (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  input      TEXT NOT NULL,
  result     TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_behavior (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES public.users(id) ON DELETE CASCADE,
  page         TEXT NOT NULL,
  time_spent   INTEGER NOT NULL DEFAULT 0,
  interaction  TEXT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.stories (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug       TEXT NOT NULL UNIQUE,
  user_id    UUID,
  title      TEXT NOT NULL,
  summary    TEXT,
  content    TEXT NOT NULL,
  mood       TEXT,
  category   TEXT NOT NULL,
  published  BOOLEAN DEFAULT true,
  metadata   JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.saved_stories (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  story_id   UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.story_progress (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  story_id   UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  progress   INTEGER NOT NULL DEFAULT 0,
  completed  BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- QURAN CONTENT TABLES
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.quran_surahs (
  id                INTEGER PRIMARY KEY,
  name_ar           TEXT NOT NULL,
  name_en           TEXT NOT NULL,
  name_translation  TEXT,
  revelation_place  TEXT,
  ayahs_count       INTEGER NOT NULL,
  "order"           INTEGER NOT NULL,
  slug              TEXT NOT NULL UNIQUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.quran_ayahs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  surah_id    INTEGER NOT NULL REFERENCES public.quran_surahs(id) ON DELETE CASCADE,
  ayah_number INTEGER NOT NULL,
  text_ar     TEXT NOT NULL,
  text_en     TEXT,
  audio_url   TEXT,
  text_uthmani TEXT,
  text_simple  TEXT,
  page        INTEGER,
  juz         INTEGER,
  hizb        INTEGER,
  rub         INTEGER,
  sajda       BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (surah_id, ayah_number)
);
-- FTS generated column (idempotent via DO block)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'quran_ayahs' AND column_name = 'searchable'
  ) THEN
    ALTER TABLE public.quran_ayahs
      ADD COLUMN searchable tsvector
      GENERATED ALWAYS AS (
        to_tsvector('arabic', coalesce(text_ar, ''))
      ) STORED;
  END IF;
END $$;
CREATE INDEX IF NOT EXISTS quran_ayahs_searchable_idx ON public.quran_ayahs USING gin(searchable);

CREATE TABLE IF NOT EXISTS public.quran_tafsir (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  surah_id   INTEGER NOT NULL REFERENCES public.quran_surahs(id) ON DELETE CASCADE,
  ayah_number INTEGER NOT NULL,
  tafsir_ar  TEXT NOT NULL,
  tafsir_en  TEXT,
  author     TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (surah_id, ayah_number, author)
);

CREATE TABLE IF NOT EXISTS public.quran_reciters (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar           TEXT NOT NULL,
  name_en           TEXT NOT NULL,
  code              TEXT NOT NULL,
  style             TEXT,
  base_url_template TEXT NOT NULL,
  thumbnail_url     TEXT,
  biography_ar      TEXT,
  biography_en      TEXT,
  recitation_type   TEXT,
  cover_image_url   TEXT,
  country           TEXT,
  is_active         BOOLEAN DEFAULT true,
  metadata          JSONB DEFAULT '{}',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Clean duplicate codes before adding unique index
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'quran_reciters' AND column_name = 'code'
  ) THEN
    WITH dup AS (
      SELECT id, code,
             row_number() OVER (PARTITION BY code ORDER BY created_at) AS rn
      FROM public.quran_reciters
    )
    UPDATE public.quran_reciters r
    SET code = dup.code || '_' || left(r.id::text, 8)
    FROM dup
    WHERE r.id = dup.id AND dup.rn > 1;
  END IF;
END $$;
CREATE UNIQUE INDEX IF NOT EXISTS quran_reciters_code_unique ON public.quran_reciters (code);

CREATE TABLE IF NOT EXISTS public.quran_audio (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  surah_id         INTEGER NOT NULL REFERENCES public.quran_surahs(id) ON DELETE CASCADE,
  reciter_id       UUID NOT NULL REFERENCES public.quran_reciters(id) ON DELETE CASCADE,
  audio_url        TEXT NOT NULL,
  duration         INTEGER,
  ayah_id          INTEGER,
  file_size_bytes  INTEGER,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- HADITH CONTENT TABLES
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.hadith_books (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         TEXT NOT NULL UNIQUE,
  name_ar      TEXT NOT NULL,
  name_en      TEXT NOT NULL,
  source       TEXT NOT NULL,
  author_ar    TEXT,
  author_en    TEXT,
  hadith_count INTEGER,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.hadiths (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id      UUID NOT NULL REFERENCES public.hadith_books(id) ON DELETE CASCADE,
  hadith_number TEXT NOT NULL,
  text_ar      TEXT NOT NULL,
  text_en      TEXT,
  narrator_ar  TEXT,
  narrator_en  TEXT,
  grade_ar     TEXT,
  grade_en     TEXT,
  chapter      TEXT,
  ref          TEXT,
  published    BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (book_id, hadith_number)
);
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'hadiths' AND column_name = 'searchable'
  ) THEN
    ALTER TABLE public.hadiths
      ADD COLUMN searchable tsvector
      GENERATED ALWAYS AS (
        to_tsvector('arabic', coalesce(text_ar, ''))
      ) STORED;
  END IF;
END $$;
CREATE INDEX IF NOT EXISTS hadiths_searchable_idx ON public.hadiths USING gin(searchable);

CREATE TABLE IF NOT EXISTS public.hadith_explanations (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hadith_id      UUID NOT NULL REFERENCES public.hadiths(id) ON DELETE CASCADE,
  explanation_ar TEXT NOT NULL,
  explanation_en TEXT,
  author         TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- SCHOLARS & STORIES (content)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.scholars (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar       TEXT NOT NULL,
  name_en       TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  bio_ar        TEXT,
  bio_en        TEXT,
  thumbnail_url TEXT,
  website_url   TEXT,
  youtube_url   TEXT,
  published     BOOLEAN NOT NULL DEFAULT true,
  metadata      JSONB DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- DUAS
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.dua_categories (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar        TEXT NOT NULL UNIQUE,
  name_en        TEXT NOT NULL,
  slug           TEXT NOT NULL UNIQUE,
  description_ar TEXT,
  description_en TEXT,
  icon           TEXT,
  icon_emoji     TEXT,
  order_index    INTEGER,
  published      BOOLEAN NOT NULL DEFAULT true,
  is_active      BOOLEAN NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.duas (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ar     TEXT NOT NULL,
  title_en     TEXT NOT NULL,
  slug         TEXT NOT NULL UNIQUE,
  text_ar      TEXT NOT NULL,
  text_en      TEXT,
  occasion_ar  TEXT,
  occasion_en  TEXT,
  source_ar    TEXT,
  source_en    TEXT,
  benefits_ar  TEXT,
  benefits_en  TEXT,
  category_id  UUID REFERENCES public.dua_categories(id) ON DELETE SET NULL,
  published    BOOLEAN NOT NULL DEFAULT true,
  metadata     JSONB NOT NULL DEFAULT '{}',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'duas' AND column_name = 'searchable'
  ) THEN
    ALTER TABLE public.duas
      ADD COLUMN searchable tsvector
      GENERATED ALWAYS AS (
        to_tsvector('arabic', coalesce(text_ar, ''))
      ) STORED;
  END IF;
END $$;
CREATE INDEX IF NOT EXISTS duas_searchable_idx ON public.duas USING gin(searchable);

-- ---------------------------------------------------------------------------
-- ARTICLES
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.article_categories (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar        TEXT NOT NULL UNIQUE,
  name_en        TEXT NOT NULL,
  slug           TEXT NOT NULL UNIQUE,
  description_ar TEXT,
  description_en TEXT,
  icon           TEXT,
  icon_emoji     TEXT,
  order_index    INTEGER,
  published      BOOLEAN NOT NULL DEFAULT true,
  is_active      BOOLEAN NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.articles (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id       UUID REFERENCES public.article_categories(id) ON DELETE CASCADE,
  title             TEXT NOT NULL,
  slug              TEXT NOT NULL UNIQUE,
  content           TEXT NOT NULL,
  summary           TEXT,
  author            TEXT,
  tags              TEXT[] DEFAULT '{}',
  featured_image_url TEXT,
  published         BOOLEAN NOT NULL DEFAULT true,
  views             INTEGER NOT NULL DEFAULT 0,
  metadata          JSONB DEFAULT '{}',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'articles' AND column_name = 'searchable'
  ) THEN
    ALTER TABLE public.articles
      ADD COLUMN searchable tsvector
      GENERATED ALWAYS AS (
        to_tsvector('arabic', coalesce(title, '') || ' ' || coalesce(content, ''))
      ) STORED;
  END IF;
END $$;
CREATE INDEX IF NOT EXISTS articles_searchable_idx ON public.articles USING gin(searchable);

-- ---------------------------------------------------------------------------
-- VIDEOS
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.video_categories (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar        TEXT NOT NULL,
  name_en        TEXT NOT NULL,
  slug           TEXT NOT NULL UNIQUE,
  description_ar TEXT,
  description_en TEXT,
  icon           TEXT,
  published      BOOLEAN NOT NULL DEFAULT true,
  is_active      BOOLEAN NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.videos (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id   UUID REFERENCES public.video_categories(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  description   TEXT,
  youtube_id    TEXT,
  thumbnail_url TEXT,
  duration      INTEGER,
  views         INTEGER NOT NULL DEFAULT 0,
  published     BOOLEAN NOT NULL DEFAULT true,
  metadata      JSONB DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.video_generation_requests (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  description   TEXT,
  category      TEXT NOT NULL,
  content       JSONB NOT NULL,
  duration      INTEGER,
  thumbnail_url TEXT,
  status        TEXT NOT NULL DEFAULT 'pending',
  youtube_id    TEXT,
  facebook_id   TEXT,
  error_message TEXT,
  error_details TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.video_generation_requests ADD COLUMN IF NOT EXISTS error_message TEXT;
ALTER TABLE public.video_generation_requests ADD COLUMN IF NOT EXISTS error_details TEXT;

CREATE TABLE IF NOT EXISTS public.video_publishing_config (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  youtube_enabled   BOOLEAN NOT NULL DEFAULT false,
  youtube_channel_id TEXT,
  facebook_enabled  BOOLEAN NOT NULL DEFAULT false,
  facebook_page_id  TEXT,
  auto_publish      BOOLEAN NOT NULL DEFAULT false,
  publish_schedule  TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- KIDS CONTENT
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.kids_content (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ar           TEXT NOT NULL,
  title_en           TEXT NOT NULL,
  slug               TEXT NOT NULL UNIQUE,
  type               TEXT NOT NULL,
  content_ar         TEXT,
  content_en         TEXT,
  age_group          TEXT NOT NULL,
  featured_image_url TEXT,
  video_url          TEXT,
  quiz_data          JSONB,
  published          BOOLEAN NOT NULL DEFAULT true,
  is_active          BOOLEAN NOT NULL DEFAULT true,
  metadata           JSONB DEFAULT '{}',
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- PROPHETS
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.prophets (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar           TEXT NOT NULL,
  name_en           TEXT NOT NULL,
  slug              TEXT NOT NULL UNIQUE,
  bio_ar            TEXT,
  bio_en            TEXT,
  birth_place_ar    TEXT,
  death_place_ar    TEXT,
  featured_image_url TEXT,
  thumbnail_url     TEXT,
  order_num         INTEGER NOT NULL DEFAULT 0,
  published         BOOLEAN NOT NULL DEFAULT true,
  metadata          JSONB NOT NULL DEFAULT '{}',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.prophet_sections (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prophet_id   UUID NOT NULL REFERENCES public.prophets(id) ON DELETE CASCADE,
  title_ar     TEXT NOT NULL,
  title_en     TEXT,
  content_ar   TEXT NOT NULL,
  content_en   TEXT,
  section_type TEXT,
  order_num    INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- COMPANIONS
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.companions (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar            TEXT NOT NULL,
  name_en            TEXT NOT NULL,
  slug               TEXT NOT NULL UNIQUE,
  bio_ar             TEXT,
  bio_en             TEXT,
  category           TEXT,
  thumbnail_url      TEXT,
  featured_image_url TEXT,
  order_num          INTEGER,
  published          BOOLEAN NOT NULL DEFAULT true,
  metadata           JSONB DEFAULT '{}',
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.companion_stories (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  companion_id UUID NOT NULL REFERENCES public.companions(id) ON DELETE CASCADE,
  title_ar     TEXT NOT NULL,
  title_en     TEXT NOT NULL,
  content_ar   TEXT NOT NULL,
  content_en   TEXT,
  story_type   TEXT,
  order_num    INTEGER,
  "references" TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- BATTLES & CONQUESTS
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.battles (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar            TEXT NOT NULL,
  name_en            TEXT NOT NULL,
  slug               TEXT NOT NULL UNIQUE,
  description_ar     TEXT,
  description_en     TEXT,
  date_hijri         TEXT,
  date_gregorian     TEXT,
  location_ar        TEXT,
  location_en        TEXT,
  thumbnail_url      TEXT,
  featured_image_url TEXT,
  order_num          INTEGER,
  published          BOOLEAN NOT NULL DEFAULT true,
  metadata           JSONB DEFAULT '{}',
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.battle_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  battle_id   UUID NOT NULL REFERENCES public.battles(id) ON DELETE CASCADE,
  title_ar    TEXT NOT NULL,
  title_en    TEXT NOT NULL,
  content_ar  TEXT NOT NULL,
  content_en  TEXT,
  event_type  TEXT,
  order_num   INTEGER,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.conquests (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar            TEXT NOT NULL,
  name_en            TEXT NOT NULL,
  slug               TEXT NOT NULL UNIQUE,
  description_ar     TEXT,
  description_en     TEXT,
  date_hijri         TEXT,
  date_gregorian     TEXT,
  location_ar        TEXT,
  location_en        TEXT,
  leader_ar          TEXT,
  leader_en          TEXT,
  thumbnail_url      TEXT,
  featured_image_url TEXT,
  order_num          INTEGER,
  published          BOOLEAN NOT NULL DEFAULT true,
  metadata           JSONB DEFAULT '{}',
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.conquest_events (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conquest_id  UUID NOT NULL REFERENCES public.conquests(id) ON DELETE CASCADE,
  title_ar     TEXT NOT NULL,
  title_en     TEXT NOT NULL,
  content_ar   TEXT NOT NULL,
  content_en   TEXT,
  event_type   TEXT,
  order_num    INTEGER,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- TAWASHEEH (ANASHEED)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.tawasheeh_categories (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar        TEXT NOT NULL,
  name_en        TEXT NOT NULL,
  slug           TEXT NOT NULL UNIQUE,
  description_ar TEXT,
  description_en TEXT,
  icon           TEXT,
  order_num      INTEGER,
  published      BOOLEAN NOT NULL DEFAULT true,
  is_active      BOOLEAN NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.tawasheeh (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ar       TEXT NOT NULL,
  title_en       TEXT NOT NULL,
  slug           TEXT NOT NULL UNIQUE,
  description_ar TEXT,
  description_en TEXT,
  artist_ar      TEXT,
  artist_en      TEXT,
  category_id    UUID REFERENCES public.tawasheeh_categories(id) ON DELETE SET NULL,
  audio_url      TEXT,
  thumbnail_url  TEXT,
  duration       INTEGER,
  views          INTEGER NOT NULL DEFAULT 0,
  published      BOOLEAN NOT NULL DEFAULT true,
  featured       BOOLEAN NOT NULL DEFAULT false,
  is_active      BOOLEAN NOT NULL DEFAULT true,
  metadata       JSONB DEFAULT '{}',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add FK to tawasheeh_favorites now that tawasheeh table exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'tawasheeh_favorites_tawasheeh_id_fkey'
    AND table_name = 'tawasheeh_favorites'
  ) THEN
    ALTER TABLE public.tawasheeh_favorites
      ADD CONSTRAINT tawasheeh_favorites_tawasheeh_id_fkey
      FOREIGN KEY (tawasheeh_id) REFERENCES public.tawasheeh(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'tawasheeh_playlist_items_tawasheeh_id_fkey'
    AND table_name = 'tawasheeh_playlist_items'
  ) THEN
    ALTER TABLE public.tawasheeh_playlist_items
      ADD CONSTRAINT tawasheeh_playlist_items_tawasheeh_id_fkey
      FOREIGN KEY (tawasheeh_id) REFERENCES public.tawasheeh(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'reciter_favorites_reciter_id_fkey'
    AND table_name = 'reciter_favorites'
  ) THEN
    ALTER TABLE public.reciter_favorites
      ADD CONSTRAINT reciter_favorites_reciter_id_fkey
      FOREIGN KEY (reciter_id) REFERENCES public.quran_reciters(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'recent_recitations_reciter_id_fkey'
    AND table_name = 'recent_recitations'
  ) THEN
    ALTER TABLE public.recent_recitations
      ADD CONSTRAINT recent_recitations_reciter_id_fkey
      FOREIGN KEY (reciter_id) REFERENCES public.quran_reciters(id) ON DELETE CASCADE;
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- ADMIN / SITE TABLES
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.site_settings (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key        TEXT NOT NULL UNIQUE,
  value      JSONB NOT NULL DEFAULT '{}',
  is_active  BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.competitions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  description TEXT,
  prize       TEXT,
  starts_at   TIMESTAMPTZ,
  ends_at     TIMESTAMPTZ,
  published   BOOLEAN NOT NULL DEFAULT false,
  metadata    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.pinned_messages (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title      TEXT,
  body       TEXT,
  type       TEXT,
  is_active  BOOLEAN NOT NULL DEFAULT true,
  start_at   TIMESTAMPTZ,
  end_at     TIMESTAMPTZ,
  priority   INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.memorization_plans (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  cadence       TEXT NOT NULL DEFAULT 'daily',
  target_ref    TEXT,
  prompt        TEXT,
  tajweed_focus TEXT,
  published     BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.memorization_progress (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL,
  surah_number     INTEGER NOT NULL,
  surah_name       TEXT NOT NULL,
  total_ayahs      INTEGER NOT NULL,
  memorized_ayahs  INTEGER NOT NULL DEFAULT 0,
  last_reviewed_at TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT memorization_progress_user_surah UNIQUE (user_id, surah_number)
);

-- ---------------------------------------------------------------------------
-- RLS: ENABLE ON ALL TABLES
-- ---------------------------------------------------------------------------

DO $$ DECLARE r RECORD;
BEGIN
  FOR r IN
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename NOT IN ('schema_migrations')
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', r.tablename);
  END LOOP;
END $$;

-- ---------------------------------------------------------------------------
-- RLS POLICIES
-- ---------------------------------------------------------------------------

-- Public content: anyone can read
DO $$ BEGIN
  CREATE POLICY "public_read_quran_surahs" ON public.quran_surahs FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "public_read_quran_ayahs" ON public.quran_ayahs FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "public_read_quran_reciters" ON public.quran_reciters FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "public_read_quran_audio" ON public.quran_audio FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "public_read_quran_tafsir" ON public.quran_tafsir FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "public_read_hadiths" ON public.hadiths FOR SELECT USING (published = true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "public_read_hadith_books" ON public.hadith_books FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "public_read_hadith_explanations" ON public.hadith_explanations FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "public_read_scholars" ON public.scholars FOR SELECT USING (published = true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "public_read_duas" ON public.duas FOR SELECT USING (published = true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "public_read_dua_categories" ON public.dua_categories FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "public_read_articles" ON public.articles FOR SELECT USING (published = true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "public_read_article_categories" ON public.article_categories FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "public_read_videos" ON public.videos FOR SELECT USING (published = true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "public_read_video_categories" ON public.video_categories FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "public_read_kids_content" ON public.kids_content FOR SELECT USING (published = true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "public_read_prophets" ON public.prophets FOR SELECT USING (published = true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "public_read_prophet_sections" ON public.prophet_sections FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "public_read_companions" ON public.companions FOR SELECT USING (published = true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "public_read_companion_stories" ON public.companion_stories FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "public_read_battles" ON public.battles FOR SELECT USING (published = true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "public_read_battle_events" ON public.battle_events FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "public_read_conquests" ON public.conquests FOR SELECT USING (published = true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "public_read_conquest_events" ON public.conquest_events FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "public_read_tawasheeh" ON public.tawasheeh FOR SELECT USING (published = true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "public_read_tawasheeh_categories" ON public.tawasheeh_categories FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "public_read_competitions" ON public.competitions FOR SELECT USING (published = true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "public_read_pinned_messages" ON public.pinned_messages FOR SELECT USING (is_active = true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "public_read_memorization_plans" ON public.memorization_plans FOR SELECT USING (published = true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "public_read_stories" ON public.stories FOR SELECT USING (published = true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- User-owned tables: users can CRUD their own data
DO $$ BEGIN
  CREATE POLICY "users_own_profiles" ON public.profiles
    FOR ALL USING (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "users_own_favorites" ON public.favorites
    FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "users_own_reading_progress" ON public.reading_progress
    FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "users_own_reminders" ON public.reminders
    FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "users_own_bookmarks" ON public.bookmarks
    FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "users_own_notifications" ON public.notifications
    FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "users_own_memorization_progress" ON public.memorization_progress
    FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "users_own_prayer_locations" ON public.prayer_locations
    FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "users_own_prayer_preferences" ON public.prayer_preferences
    FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "users_own_tawasheeh_favorites" ON public.tawasheeh_favorites
    FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "users_own_tawasheeh_playlists" ON public.tawasheeh_playlists
    FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "users_own_reciter_favorites" ON public.reciter_favorites
    FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Admin-only write policies for content tables
DO $$ BEGIN
  CREATE POLICY "admin_write_content" ON public.articles
    FOR ALL USING (
      EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------------------------------------------------------------------------
-- PERFORMANCE INDEXES
-- ---------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_profiles_role          ON public.profiles (role);
CREATE INDEX IF NOT EXISTS idx_hadiths_book_id        ON public.hadiths (book_id);
CREATE INDEX IF NOT EXISTS idx_hadiths_published      ON public.hadiths (published);
CREATE INDEX IF NOT EXISTS idx_articles_category      ON public.articles (category_id);
CREATE INDEX IF NOT EXISTS idx_articles_published     ON public.articles (published);
CREATE INDEX IF NOT EXISTS idx_articles_slug          ON public.articles (slug);
CREATE INDEX IF NOT EXISTS idx_videos_category        ON public.videos (category_id);
CREATE INDEX IF NOT EXISTS idx_videos_published       ON public.videos (published);
CREATE INDEX IF NOT EXISTS idx_duas_category          ON public.duas (category_id);
CREATE INDEX IF NOT EXISTS idx_companions_published   ON public.companions (published);
CREATE INDEX IF NOT EXISTS idx_prophets_published     ON public.prophets (published);
CREATE INDEX IF NOT EXISTS idx_battles_published      ON public.battles (published);
CREATE INDEX IF NOT EXISTS idx_conquests_published    ON public.conquests (published);
CREATE INDEX IF NOT EXISTS idx_tawasheeh_category     ON public.tawasheeh (category_id);
CREATE INDEX IF NOT EXISTS idx_tawasheeh_published    ON public.tawasheeh (published);
CREATE INDEX IF NOT EXISTS idx_kids_content_published ON public.kids_content (published);
CREATE INDEX IF NOT EXISTS idx_favorites_user         ON public.favorites (user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user     ON public.notifications (user_id);
CREATE INDEX IF NOT EXISTS idx_quran_ayahs_surah      ON public.quran_ayahs (surah_id);
CREATE INDEX IF NOT EXISTS idx_quran_tafsir_surah     ON public.quran_tafsir (surah_id);
CREATE INDEX IF NOT EXISTS idx_video_gen_status       ON public.video_generation_requests (status);
CREATE INDEX IF NOT EXISTS idx_scholars_published     ON public.scholars (published);
CREATE INDEX IF NOT EXISTS idx_stories_published      ON public.stories (published);

COMMIT;
