-- RLS hardening for tables that are part of the current Drizzle schema.
-- Every table is guarded with to_regclass so this migration remains safe for
-- optional tables that may not exist in older or partially migrated databases.

-- Profiles: users can read and update their own profile.
DO $$
BEGIN
    IF to_regclass('public.profiles') IS NOT NULL THEN
        EXECUTE 'ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY';

        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'profiles_select_own') THEN
            EXECUTE 'CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id)';
        END IF;

        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'profiles_update_own') THEN
            EXECUTE 'CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id)';
        END IF;
    END IF;
END $$;

-- Favorites: users can manage their own favorites.
DO $$
BEGIN
    IF to_regclass('public.favorites') IS NOT NULL THEN
        EXECUTE 'ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY';

        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'favorites' AND policyname = 'favorites_owner_all') THEN
            EXECUTE 'CREATE POLICY "favorites_owner_all" ON public.favorites FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)';
        END IF;
    END IF;
END $$;

-- Reading progress: users can manage their own progress rows.
DO $$
BEGIN
    IF to_regclass('public.reading_progress') IS NOT NULL THEN
        EXECUTE 'ALTER TABLE public.reading_progress ENABLE ROW LEVEL SECURITY';

        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'reading_progress' AND policyname = 'reading_progress_owner_all') THEN
            EXECUTE 'CREATE POLICY "reading_progress_owner_all" ON public.reading_progress FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)';
        END IF;
    END IF;
END $$;

-- Reminders: users can manage their own reminders.
DO $$
BEGIN
    IF to_regclass('public.reminders') IS NOT NULL THEN
        EXECUTE 'ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY';

        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'reminders' AND policyname = 'reminders_owner_all') THEN
            EXECUTE 'CREATE POLICY "reminders_owner_all" ON public.reminders FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)';
        END IF;
    END IF;
END $$;

-- Quran surahs: public read-only content.
DO $$
BEGIN
    IF to_regclass('public.quran_surahs') IS NOT NULL THEN
        EXECUTE 'ALTER TABLE public.quran_surahs ENABLE ROW LEVEL SECURITY';

        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'quran_surahs' AND policyname = 'public_read_quran_surahs') THEN
            EXECUTE 'CREATE POLICY "public_read_quran_surahs" ON public.quran_surahs FOR SELECT USING (true)';
        END IF;
    END IF;
END $$;

-- Quran ayahs: public read-only content.
DO $$
BEGIN
    IF to_regclass('public.quran_ayahs') IS NOT NULL THEN
        EXECUTE 'ALTER TABLE public.quran_ayahs ENABLE ROW LEVEL SECURITY';

        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'quran_ayahs' AND policyname = 'public_read_quran_ayahs') THEN
            EXECUTE 'CREATE POLICY "public_read_quran_ayahs" ON public.quran_ayahs FOR SELECT USING (true)';
        END IF;
    END IF;
END $$;

-- Quran tafsir: public read-only content.
DO $$
BEGIN
    IF to_regclass('public.quran_tafsir') IS NOT NULL THEN
        EXECUTE 'ALTER TABLE public.quran_tafsir ENABLE ROW LEVEL SECURITY';

        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'quran_tafsir' AND policyname = 'public_read_quran_tafsir') THEN
            EXECUTE 'CREATE POLICY "public_read_quran_tafsir" ON public.quran_tafsir FOR SELECT USING (true)';
        END IF;
    END IF;
END $$;

-- Quran reciters: public read-only content.
DO $$
BEGIN
    IF to_regclass('public.quran_reciters') IS NOT NULL THEN
        EXECUTE 'ALTER TABLE public.quran_reciters ENABLE ROW LEVEL SECURITY';

        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'quran_reciters' AND policyname = 'public_read_quran_reciters') THEN
            EXECUTE 'CREATE POLICY "public_read_quran_reciters" ON public.quran_reciters FOR SELECT USING (true)';
        END IF;
    END IF;
END $$;

-- Hadith books: public read-only content.
DO $$
BEGIN
    IF to_regclass('public.hadith_books') IS NOT NULL THEN
        EXECUTE 'ALTER TABLE public.hadith_books ENABLE ROW LEVEL SECURITY';

        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'hadith_books' AND policyname = 'public_read_hadith_books') THEN
            EXECUTE 'CREATE POLICY "public_read_hadith_books" ON public.hadith_books FOR SELECT USING (true)';
        END IF;
    END IF;
END $$;

-- Hadiths: public can read published hadiths.
DO $$
BEGIN
    IF to_regclass('public.hadiths') IS NOT NULL THEN
        EXECUTE 'ALTER TABLE public.hadiths ENABLE ROW LEVEL SECURITY';

        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'hadiths' AND policyname = 'public_read_hadiths') THEN
            EXECUTE 'CREATE POLICY "public_read_hadiths" ON public.hadiths FOR SELECT USING (published = true)';
        END IF;
    END IF;
END $$;

-- Hadith explanations: public read-only content.
DO $$
BEGIN
    IF to_regclass('public.hadith_explanations') IS NOT NULL THEN
        EXECUTE 'ALTER TABLE public.hadith_explanations ENABLE ROW LEVEL SECURITY';

        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'hadith_explanations' AND policyname = 'public_read_hadith_explanations') THEN
            EXECUTE 'CREATE POLICY "public_read_hadith_explanations" ON public.hadith_explanations FOR SELECT USING (true)';
        END IF;
    END IF;
END $$;

-- Scholars: public can read published scholars.
DO $$
BEGIN
    IF to_regclass('public.scholars') IS NOT NULL THEN
        EXECUTE 'ALTER TABLE public.scholars ENABLE ROW LEVEL SECURITY';

        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'scholars' AND policyname = 'public_read_scholars') THEN
            EXECUTE 'CREATE POLICY "public_read_scholars" ON public.scholars FOR SELECT USING (published = true)';
        END IF;
    END IF;
END $$;

-- Stories: public can read published stories.
DO $$
BEGIN
    IF to_regclass('public.stories') IS NOT NULL THEN
        EXECUTE 'ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY';

        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'stories' AND policyname = 'public_read_stories') THEN
            EXECUTE 'CREATE POLICY "public_read_stories" ON public.stories FOR SELECT USING (published = true)';
        END IF;
    END IF;
END $$;

-- User subscriptions: users can manage their own subscriptions.
DO $$
BEGIN
    IF to_regclass('public.user_subscriptions') IS NOT NULL THEN
        EXECUTE 'ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY';

        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_subscriptions' AND policyname = 'user_subscriptions_owner_all') THEN
            EXECUTE 'CREATE POLICY "user_subscriptions_owner_all" ON public.user_subscriptions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)';
        END IF;
    END IF;
END $$;

-- Payments: users can manage their own payment rows.
DO $$
BEGIN
    IF to_regclass('public.payments') IS NOT NULL THEN
        EXECUTE 'ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY';

        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'payments' AND policyname = 'payments_owner_all') THEN
            EXECUTE 'CREATE POLICY "payments_owner_all" ON public.payments FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)';
        END IF;
    END IF;
END $$;

-- Research requests: users can manage their own requests.
DO $$
BEGIN
    IF to_regclass('public.research_requests') IS NOT NULL THEN
        EXECUTE 'ALTER TABLE public.research_requests ENABLE ROW LEVEL SECURITY';

        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'research_requests' AND policyname = 'research_requests_owner_all') THEN
            EXECUTE 'CREATE POLICY "research_requests_owner_all" ON public.research_requests FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)';
        END IF;
    END IF;
END $$;

-- Generated research: users can access generated content for their own requests.
DO $$
BEGIN
    IF to_regclass('public.generated_research') IS NOT NULL THEN
        EXECUTE 'ALTER TABLE public.generated_research ENABLE ROW LEVEL SECURITY';

        IF to_regclass('public.research_requests') IS NOT NULL
            AND NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'generated_research' AND policyname = 'generated_research_request_owner_all') THEN
            EXECUTE 'CREATE POLICY "generated_research_request_owner_all" ON public.generated_research FOR ALL USING (EXISTS (SELECT 1 FROM public.research_requests rr WHERE rr.id = request_id AND rr.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.research_requests rr WHERE rr.id = request_id AND rr.user_id = auth.uid()))';
        END IF;
    END IF;
END $$;

-- Site settings: public read, admin write.
DO $$
BEGIN
    IF to_regclass('public.site_settings') IS NOT NULL THEN
        EXECUTE 'ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY';

        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'site_settings' AND policyname = 'public_read_site_settings') THEN
            EXECUTE 'CREATE POLICY "public_read_site_settings" ON public.site_settings FOR SELECT USING (true)';
        END IF;

        IF to_regclass('public.profiles') IS NOT NULL
            AND NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'site_settings' AND policyname = 'site_settings_admin_all') THEN
            EXECUTE 'CREATE POLICY "site_settings_admin_all" ON public.site_settings FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = ''admin'')) WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = ''admin''))';
        END IF;
    END IF;
END $$;

-- Competitions: public can read published competitions, admins can manage all rows.
DO $$
BEGIN
    IF to_regclass('public.competitions') IS NOT NULL THEN
        EXECUTE 'ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY';

        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'competitions' AND policyname = 'public_read_published_competitions') THEN
            EXECUTE 'CREATE POLICY "public_read_published_competitions" ON public.competitions FOR SELECT USING (published = true)';
        END IF;

        IF to_regclass('public.profiles') IS NOT NULL
            AND NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'competitions' AND policyname = 'competitions_admin_all') THEN
            EXECUTE 'CREATE POLICY "competitions_admin_all" ON public.competitions FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = ''admin'')) WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = ''admin''))';
        END IF;
    END IF;
END $$;

-- Pinned messages: public can read published messages, admins can manage all rows.
DO $$
BEGIN
    IF to_regclass('public.pinned_messages') IS NOT NULL THEN
        EXECUTE 'ALTER TABLE public.pinned_messages ENABLE ROW LEVEL SECURITY';

        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'pinned_messages' AND policyname = 'public_read_published_pinned_messages') THEN
            EXECUTE 'CREATE POLICY "public_read_published_pinned_messages" ON public.pinned_messages FOR SELECT USING (published = true)';
        END IF;

        IF to_regclass('public.profiles') IS NOT NULL
            AND NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'pinned_messages' AND policyname = 'pinned_messages_admin_all') THEN
            EXECUTE 'CREATE POLICY "pinned_messages_admin_all" ON public.pinned_messages FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = ''admin'')) WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = ''admin''))';
        END IF;
    END IF;
END $$;

-- Memorization plans: public can read published plans, admins can manage all rows.
DO $$
BEGIN
    IF to_regclass('public.memorization_plans') IS NOT NULL THEN
        EXECUTE 'ALTER TABLE public.memorization_plans ENABLE ROW LEVEL SECURITY';

        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'memorization_plans' AND policyname = 'public_read_published_memorization_plans') THEN
            EXECUTE 'CREATE POLICY "public_read_published_memorization_plans" ON public.memorization_plans FOR SELECT USING (published = true)';
        END IF;

        IF to_regclass('public.profiles') IS NOT NULL
            AND NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'memorization_plans' AND policyname = 'memorization_plans_admin_all') THEN
            EXECUTE 'CREATE POLICY "memorization_plans_admin_all" ON public.memorization_plans FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = ''admin'')) WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = ''admin''))';
        END IF;
    END IF;
END $$;
