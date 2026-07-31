-- ============================================================
-- Migration 0014: Auth Triggers and Helper Functions
-- Creates the handle_new_user() function for auto-creating
-- profiles when users sign up, plus set_updated_at() trigger
-- ============================================================

-- ---------------------------------------------------------------------------
-- 1. updated_at trigger function (reusable)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Apply updated_at trigger to all tables that have updated_at
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'profiles', 'users', 'site_settings', 'competitions', 'pinned_messages',
    'memorization_plans', 'contacts', 'subscriptions', 'video_publishing_config',
    'quran_surahs', 'quran_reciters', 'quran_tafsir', 'hadith_books', 'hadiths',
    'hadith_explanations', 'scholars', 'stories', 'prophets', 'prophet_sections',
    'dua_categories', 'duas', 'article_categories', 'articles', 'video_categories',
    'videos', 'video_generation_requests', 'kids_content', 'companions',
    'companion_stories', 'battles', 'battle_events', 'conquests', 'conquest_events',
    'tawasheeh_categories', 'tawasheeh', 'episodes', 'reminders',
    'user_subscriptions', 'prayer_locations', 'prayer_preferences',
    'tawasheeh_playlists', 'reading_progress', 'story_ratings', 'prophet_notes',
    'notification_settings', 'adhkar_streaks', 'app_settings'
  ]
  LOOP
    EXECUTE format(
      'CREATE OR REPLACE TRIGGER trg_%I_updated_at
       BEFORE UPDATE ON public.%I
       FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()',
      t, t
    );
  END LOOP;
END;
$$;

-- ---------------------------------------------------------------------------
-- 2. Auto-create profile on new auth user
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url, locale)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NULL),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL),
    COALESCE(NEW.raw_user_meta_data->>'locale', 'ar')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
