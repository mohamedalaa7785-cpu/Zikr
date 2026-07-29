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
    IF to_regclass(format('public.%I', t)) IS NOT NULL
       AND EXISTS (
         SELECT 1
         FROM information_schema.columns
         WHERE table_schema = 'public'
           AND table_name = t
           AND column_name = 'updated_at'
       ) THEN
      EXECUTE format('DROP TRIGGER IF EXISTS set_updated_at ON public.%I', t);
      EXECUTE format('CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at()', t);
    END IF;
  END LOOP;
END $$;

-- Part 2: Tighten permissive RLS policies identified by advisors
DO $$
BEGIN
  IF to_regclass('public.subscriptions') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Anyone can subscribe" ON public.subscriptions;
    CREATE POLICY "Anyone can subscribe" ON public.subscriptions
      FOR INSERT WITH CHECK (email IS NOT NULL);
  END IF;

  IF to_regclass('public.video_categories') IS NOT NULL THEN
    DROP POLICY IF EXISTS "update_video_categories" ON public.video_categories;
    CREATE POLICY "update_video_categories" ON public.video_categories
      FOR UPDATE TO authenticated USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.id = (SELECT auth.uid()) AND profiles.role = 'admin'
        )
      ) WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.id = (SELECT auth.uid()) AND profiles.role = 'admin'
        )
      );
  END IF;

  IF to_regclass('public.videos') IS NOT NULL THEN
    DROP POLICY IF EXISTS "delete_videos" ON public.videos;
    CREATE POLICY "delete_videos" ON public.videos
      FOR DELETE TO authenticated USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.id = (SELECT auth.uid()) AND profiles.role = 'admin'
        )
      );

    DROP POLICY IF EXISTS "insert_videos" ON public.videos;
    CREATE POLICY "insert_videos" ON public.videos
      FOR INSERT TO authenticated WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.id = (SELECT auth.uid()) AND profiles.role = 'admin'
        )
      );

    DROP POLICY IF EXISTS "update_videos" ON public.videos;
    CREATE POLICY "update_videos" ON public.videos
      FOR UPDATE TO authenticated USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.id = (SELECT auth.uid()) AND profiles.role = 'admin'
        )
      ) WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.id = (SELECT auth.uid()) AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

-- Part 3: Fix Security Definer functions search_path
DO $$
DECLARE
  fn regprocedure;
BEGIN
  FOREACH fn IN ARRAY ARRAY[
    to_regprocedure('public.create_profile_for_new_user()'),
    to_regprocedure('public.ensure_profile_for_user()'),
    to_regprocedure('public.is_admin_user()'),
    to_regprocedure('public.update_updated_at_column()'),
    to_regprocedure('public.handle_updated_at()')
  ] LOOP
    IF fn IS NOT NULL THEN
      EXECUTE format('ALTER FUNCTION %s SET search_path = public', fn);
    END IF;
  END LOOP;
END $$;
