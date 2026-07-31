-- Clean up duplicate RLS policies and add missing admin policies

-- ============================================================
-- SECTION 1: Clean duplicate policies (keep the cleaner named ones)
-- ============================================================

-- article_categories: keep public_read_article_categories
DROP POLICY IF EXISTS "Public can read article categories" ON public.article_categories;
DROP POLICY IF EXISTS "public_read_article_categories_anon" ON public.article_categories;

-- battle_events: keep public_read_battle_events
DROP POLICY IF EXISTS "battle_events_public_read" ON public.battle_events;

-- companion_stories: keep public_read_companion_stories
DROP POLICY IF EXISTS "Public can read companion stories" ON public.companion_stories;
DROP POLICY IF EXISTS "companion_stories_public_read" ON public.companion_stories;

-- conquest_events: keep public_read_conquest_events
DROP POLICY IF EXISTS "conquest_events_public_read" ON public.conquest_events;

-- battles: keep public_read_battles and battles_admin_write
DROP POLICY IF EXISTS "Public can read battles" ON public.battles;
DROP POLICY IF EXISTS "battles_public_read" ON public.battles;

-- conquests: keep public_read_conquests
DROP POLICY IF EXISTS "Public can read conquests" ON public.conquests;
DROP POLICY IF EXISTS "conquests_public_read" ON public.conquests;

-- contacts: remove duplicate insert
DROP POLICY IF EXISTS "contacts_insert_authenticated" ON public.contacts;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.contacts;

-- dua_categories: keep public_read_dua_categories
DROP POLICY IF EXISTS "Public can read dua categories" ON public.dua_categories;
DROP POLICY IF EXISTS "public_read_dua_categories_anon" ON public.dua_categories;

-- duas: keep public_read_duas
DROP POLICY IF EXISTS "Allow public read access on duas" ON public.duas;
DROP POLICY IF EXISTS "Public can read duas" ON public.duas;
DROP POLICY IF EXISTS "public_read_duas_anon" ON public.duas;

-- favorites: keep users_own_favorites
DROP POLICY IF EXISTS "favorites_owner_all" ON public.favorites;

-- hadith_books: keep public_read_hadith_books
DROP POLICY IF EXISTS "Public can read hadith books" ON public.hadith_books;
DROP POLICY IF EXISTS "public_read_hadith_books_anon" ON public.hadith_books;

-- hadith_explanations: keep public_read_hadith_explanations
DROP POLICY IF EXISTS "public_read_hadith_explanations_anon" ON public.hadith_explanations;

-- hadiths: keep public_read_hadiths
DROP POLICY IF EXISTS "Public can read hadiths" ON public.hadiths;
DROP POLICY IF EXISTS "public_read_hadiths_anon" ON public.hadiths;

-- companions: keep public_read_companions
DROP POLICY IF EXISTS "Public can read companions" ON public.companions;
DROP POLICY IF EXISTS "companions_public_read" ON public.companions;

-- bookmarks: keep users_own_bookmarks
DROP POLICY IF EXISTS "bookmarks: users own their rows" ON public.bookmarks;

-- favorite_recitations: keep favorite_recitations_owner
DROP POLICY IF EXISTS "favorite_recitations_user_access" ON public.favorite_recitations;

-- favorite_surahs: keep favorite_surahs_owner
DROP POLICY IF EXISTS "favorite_surahs_user_access" ON public.favorite_surahs;

-- memorization_attempts: keep memorization_attempts_owner
DROP POLICY IF EXISTS "memorization_attempts_user_access" ON public.memorization_attempts;

-- memorization_progress: keep memorization_progress_owner
DROP POLICY IF EXISTS "users_own_memorization_progress" ON public.memorization_progress;

-- notifications: keep notifications_owner
DROP POLICY IF EXISTS "users_own_notifications" ON public.notifications;

-- kids_content: consolidate to single read policy and admin policy
DROP POLICY IF EXISTS "Allow public read access on kids_content" ON public.kids_content;
DROP POLICY IF EXISTS "Public can read kids content" ON public.kids_content;
DROP POLICY IF EXISTS "kids_content_public_read" ON public.kids_content;
DROP POLICY IF EXISTS "public_read_kids_content" ON public.kids_content;
DROP POLICY IF EXISTS "public_read_kids_content_anon" ON public.kids_content;
DROP POLICY IF EXISTS "kids_content_admin_all" ON public.kids_content;

-- articles: remove duplicates, keep articles_select_all and articles_admin_all
DROP POLICY IF EXISTS "Public can read articles" ON public.articles;
DROP POLICY IF EXISTS "public_read_articles" ON public.articles;
DROP POLICY IF EXISTS "public_read_articles_anon" ON public.articles;
DROP POLICY IF EXISTS "admin_write_content" ON public.articles;

-- videos: remove duplicates
DROP POLICY IF EXISTS "Public can read videos" ON public.videos;
DROP POLICY IF EXISTS "public_read_videos_anon" ON public.videos;

-- video_categories: remove duplicates
DROP POLICY IF EXISTS "Public can read video categories" ON public.video_categories;
DROP POLICY IF EXISTS "public_read_video_categories_anon" ON public.video_categories;

-- profiles: consolidate
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_anon_no_access" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "users_own_profiles" ON public.profiles;

-- pinned_messages: consolidate
DROP POLICY IF EXISTS "Admins can manage pinned messages" ON public.pinned_messages;
DROP POLICY IF EXISTS "Public can read active pinned messages" ON public.pinned_messages;
DROP POLICY IF EXISTS "pinned_messages_service_write" ON public.pinned_messages;
DROP POLICY IF EXISTS "pinned_messages_public_select" ON public.pinned_messages;

-- scholars: consolidate
DROP POLICY IF EXISTS "scholars_public_read" ON public.scholars;
DROP POLICY IF EXISTS "public_read_scholars_anon" ON public.scholars;
DROP POLICY IF EXISTS "Public can read scholars" ON public.scholars;
DROP POLICY IF EXISTS "content_admin_write_scholars" ON public.scholars;

-- prophets: consolidate
DROP POLICY IF EXISTS "Allow public read access on prophets" ON public.prophets;
DROP POLICY IF EXISTS "Public can read prophets" ON public.prophets;
DROP POLICY IF EXISTS "public_read_prophets_anon" ON public.prophets;

-- prophet_sections: consolidate
DROP POLICY IF EXISTS "Public can read prophet sections" ON public.prophet_sections;
DROP POLICY IF EXISTS "public_read_prophet_sections_anon" ON public.prophet_sections;

-- quran_surahs: consolidate
DROP POLICY IF EXISTS "Public can read surahs" ON public.quran_surahs;
DROP POLICY IF EXISTS "public_read_quran_surahs_anon" ON public.quran_surahs;

-- quran_ayahs: consolidate
DROP POLICY IF EXISTS "Public can read ayahs" ON public.quran_ayahs;
DROP POLICY IF EXISTS "public_read_quran_ayahs_anon" ON public.quran_ayahs;

-- quran_reciters: consolidate
DROP POLICY IF EXISTS "public_read_quran_reciters_anon" ON public.quran_reciters;

-- quran_tafsir: consolidate
DROP POLICY IF EXISTS "public_read_quran_tafsir_anon" ON public.quran_tafsir;

-- prayer_preferences: remove owner_all duplicate
DROP POLICY IF EXISTS "users_own_prayer_preferences" ON public.prayer_preferences;

-- prayer_locations: remove owner_all duplicate
DROP POLICY IF EXISTS "users_own_prayer_locations" ON public.prayer_locations;

-- tawasheeh: consolidate
DROP POLICY IF EXISTS "tawasheeh_admin_write" ON public.tawasheeh;
DROP POLICY IF EXISTS "tawasheeh_public_read" ON public.tawasheeh;
DROP POLICY IF EXISTS "tawasheeh_categories_admin_write" ON public.tawasheeh_categories;
DROP POLICY IF EXISTS "tawasheeh_categories_public_read" ON public.tawasheeh_categories;
DROP POLICY IF EXISTS "tawasheeh_playlists_admin_write" ON public.tawasheeh_playlists;

-- story_progress: consolidate
DROP POLICY IF EXISTS "story_progress_public_read" ON public.story_progress;

-- story_favorites: consolidate
DROP POLICY IF EXISTS "story_favorites_public_read" ON public.story_favorites;
DROP POLICY IF EXISTS "story_favorites_user_access" ON public.story_favorites;

-- story_reads: consolidate
DROP POLICY IF EXISTS "story_reads_user_access" ON public.story_reads;

-- story_ratings: consolidate
DROP POLICY IF EXISTS "story_ratings_user_access" ON public.story_ratings;

-- user_subscriptions: consolidate
DROP POLICY IF EXISTS "user_subscriptions_public_insert" ON public.user_subscriptions;
DROP POLICY IF EXISTS "user_subscriptions_admin_read" ON public.user_subscriptions;

-- subscriptions: consolidate
DROP POLICY IF EXISTS "subscriptions_admin_read" ON public.subscriptions;

-- site_settings: consolidate
DROP POLICY IF EXISTS "site_settings_admin_read" ON public.site_settings;
DROP POLICY IF EXISTS "site_settings_public_read" ON public.site_settings;
DROP POLICY IF EXISTS "site_settings_service_write" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can manage site settings" ON public.site_settings;

-- social_publish_queue: remove anon deny
DROP POLICY IF EXISTS "social_publish_queue_anon_deny" ON public.social_publish_queue;

-- Storage RLS duplicates
DROP POLICY IF EXISTS "public_assets_admin_write" ON storage.objects;
DROP POLICY IF EXISTS "public_assets_object_read_only" ON storage.objects;
DROP POLICY IF EXISTS "public_read_uploads" ON storage.objects;
DROP POLICY IF EXISTS "public_read_avatars" ON storage.objects;
DROP POLICY IF EXISTS "admin_write_all_buckets" ON storage.objects;

-- Generated research: remove owner_all (per-operation policies exist)
DROP POLICY IF EXISTS "generated_research_owner_all" ON public.generated_research;

-- tawasheeh_playlist_items: remove owner_all (per-operation policies exist)
DROP POLICY IF EXISTS "tawasheeh_playlist_items_owner_all" ON public.tawasheeh_playlist_items;

-- ============================================================
-- SECTION 2: Create consolidated replacement policies
-- ============================================================

-- Articles admin policy
CREATE POLICY IF NOT EXISTS "articles_admin_all" ON public.articles
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = (SELECT auth.uid()) AND profiles.role = 'admin')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = (SELECT auth.uid()) AND profiles.role = 'admin')
  );

-- Kids content admin policy
CREATE POLICY IF NOT EXISTS "admin_all_kids_content" ON public.kids_content
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = (SELECT auth.uid()) AND profiles.role = 'admin')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = (SELECT auth.uid()) AND profiles.role = 'admin')
  );

-- Profiles consolidated policies
CREATE POLICY IF NOT EXISTS "profiles_public_read" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "profiles_authenticated_update" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY IF NOT EXISTS "profiles_authenticated_delete" ON public.profiles
  FOR DELETE TO authenticated
  USING (id = auth.uid());

-- Social publish queue: service role access for cron
CREATE POLICY IF NOT EXISTS "social_publish_queue_service_role_all" ON public.social_publish_queue
  FOR ALL
  USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text)
  WITH CHECK ((auth.jwt() ->> 'role'::text) = 'service_role'::text);

-- Companion stories admin
CREATE POLICY IF NOT EXISTS "admin_all_companion_stories" ON public.companion_stories
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = (SELECT auth.uid()) AND profiles.role = 'admin')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = (SELECT auth.uid()) AND profiles.role = 'admin')
  );

-- Conquest events admin
CREATE POLICY IF NOT EXISTS "admin_all_conquest_events" ON public.conquest_events
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = (SELECT auth.uid()) AND profiles.role = 'admin')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = (SELECT auth.uid()) AND profiles.role = 'admin')
  );

-- Article categories admin
CREATE POLICY IF NOT EXISTS "admin_all_article_categories" ON public.article_categories
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = (SELECT auth.uid()) AND profiles.role = 'admin')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = (SELECT auth.uid()) AND profiles.role = 'admin')
  );

-- Video publishing config admin
DROP POLICY IF EXISTS "Authenticated users can view video config" ON public.video_publishing_config;
CREATE POLICY IF NOT EXISTS "admin_all_video_publishing_config" ON public.video_publishing_config
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = (SELECT auth.uid()) AND profiles.role = 'admin')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = (SELECT auth.uid()) AND profiles.role = 'admin')
  );

-- Site settings: admin write + public read
CREATE POLICY IF NOT EXISTS "admin_all_site_settings" ON public.site_settings
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = (SELECT auth.uid()) AND profiles.role = 'admin')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = (SELECT auth.uid()) AND profiles.role = 'admin')
  );

CREATE POLICY IF NOT EXISTS "site_settings_public_select" ON public.site_settings
  FOR SELECT USING (true);

-- Pinned messages: public read active + admin all
CREATE POLICY IF NOT EXISTS "pinned_messages_admin_all" ON public.pinned_messages
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = (SELECT auth.uid()) AND profiles.role = 'admin')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = (SELECT auth.uid()) AND profiles.role = 'admin')
  );

CREATE POLICY IF NOT EXISTS "public_read_pinned_messages" ON public.pinned_messages
  FOR SELECT USING ((is_active = true) AND ((start_at IS NULL) OR (start_at <= now())) AND ((end_at IS NULL) OR (end_at >= now())));

-- ============================================================
-- SECTION 3: Auth trigger for auto-profile creation
-- ============================================================

-- Ensure handle_new_user function exists and trigger is set up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Auto-profile on login if missing
CREATE OR REPLACE FUNCTION public.create_profile_on_login()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO UPDATE SET
    last_login_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_login ON auth.users;
CREATE TRIGGER on_auth_user_login
  AFTER UPDATE OF last_sign_in_at ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_profile_on_login();
