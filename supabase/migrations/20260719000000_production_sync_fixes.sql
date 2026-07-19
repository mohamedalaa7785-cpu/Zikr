-- Production synchronization and hardening fixes
-- Part 1: Fix missing updated_at triggers for all relevant tables

-- Ensure the helper function exists
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tables identified as missing them
DO $$
DECLARE
  t text;
  tables text[] := ARRAY[
    'dua_categories', 'stories', 'story_progress', 'quran_surahs', 'quran_ayahs', 
    'scholars', 'hadith_explanations', 'hadiths', 'reading_progress', 'reminders', 
    'profiles', 'competitions', 'video_categories', 'prophets', 'kids_content', 
    'prophet_sections', 'articles', 'article_categories', 'duas', 'videos', 
    'quran_tafsir', 'quran_reciters', 'hadith_books', 'memorization_progress', 
    'contacts', 'user_settings', 'episodes', 'user_subscriptions', 'subscriptions', 
    'story_ratings', 'prophet_notes', 'notification_settings', 'adhkar_streaks', 
    'app_settings', 'users', 'video_publishing_config', 'video_generation_requests', 
    'social_publish_queue'
  ];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS set_updated_at ON public.%I', t);
    EXECUTE format('CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at()', t);
  END LOOP;
END $$;

-- Part 2: Tighten permissive RLS policies identified by advisors

-- Fix subscriptions: Anyone can subscribe policy (tighten to authenticated or specific logic if needed)
-- If it's for anonymous subscriptions, we might want to keep it but the advisor warns about 'true' check.
-- Let's change it to check if email is provided at least.
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.subscriptions;
CREATE POLICY "Anyone can subscribe" ON public.subscriptions 
FOR INSERT WITH CHECK (email IS NOT NULL);

-- Fix video_categories: update_video_categories (restrict to admins)
DROP POLICY IF EXISTS "update_video_categories" ON public.video_categories;
CREATE POLICY "update_video_categories" ON public.video_categories
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Fix videos: delete_videos and insert_videos (restrict to admins)
DROP POLICY IF EXISTS "delete_videos" ON public.videos;
CREATE POLICY "delete_videos" ON public.videos
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

DROP POLICY IF EXISTS "insert_videos" ON public.videos;
CREATE POLICY "insert_videos" ON public.videos
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

DROP POLICY IF EXISTS "update_videos" ON public.videos;
CREATE POLICY "update_videos" ON public.videos
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Part 3: Fix Security Definer functions search_path
ALTER FUNCTION public.create_profile_for_new_user() SET search_path = public;
ALTER FUNCTION public.ensure_profile_for_user() SET search_path = public;
ALTER FUNCTION public.is_admin_user() SET search_path = public;
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
ALTER FUNCTION public.handle_updated_at() SET search_path = public;
