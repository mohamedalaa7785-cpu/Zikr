-- Production Supabase hardening for auth, RLS, storage, and schema drift.
-- This migration is additive/idempotent and does not delete application data.

-- Required auth/profile safety: profiles must map 1:1 to auth.users.
DO $$
BEGIN
  IF to_regclass('public.profiles') IS NOT NULL THEN
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;

    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint
      WHERE conname = 'profiles_id_auth_users_fk'
        AND conrelid = 'public.profiles'::regclass
    ) THEN
      ALTER TABLE public.profiles
        ADD CONSTRAINT profiles_id_auth_users_fk
        FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
  END IF;
END$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    display_name = COALESCE(public.profiles.display_name, EXCLUDED.display_name),
    avatar_url = COALESCE(public.profiles.avatar_url, EXCLUDED.avatar_url),
    updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Replace broad profile policies with explicit role-scoped policies.
DO $$
BEGIN
  IF to_regclass('public.profiles') IS NOT NULL THEN
    DROP POLICY IF EXISTS profiles_select_own ON public.profiles;
    DROP POLICY IF EXISTS profiles_insert_own ON public.profiles;
    DROP POLICY IF EXISTS profiles_update_own ON public.profiles;
    DROP POLICY IF EXISTS profiles_delete_own ON public.profiles;
    DROP POLICY IF EXISTS profiles_anon_no_access ON public.profiles;

    CREATE POLICY profiles_select_own ON public.profiles
      FOR SELECT TO authenticated
      USING ((SELECT auth.uid()) = id);
    CREATE POLICY profiles_insert_own ON public.profiles
      FOR INSERT TO authenticated
      WITH CHECK ((SELECT auth.uid()) = id);
    CREATE POLICY profiles_update_own ON public.profiles
      FOR UPDATE TO authenticated
      USING ((SELECT auth.uid()) = id)
      WITH CHECK ((SELECT auth.uid()) = id);
    CREATE POLICY profiles_delete_own ON public.profiles
      FOR DELETE TO authenticated
      USING ((SELECT auth.uid()) = id);
    CREATE POLICY profiles_anon_no_access ON public.profiles
      FOR SELECT TO anon
      USING (false);

    CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles(role);
    CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email);
  END IF;
END$$;

-- Prayer tables: split FOR ALL owner policies into per-operation authenticated policies.
DO $$
BEGIN
  IF to_regclass('public.prayer_locations') IS NOT NULL THEN
    ALTER TABLE public.prayer_locations ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.prayer_locations FORCE ROW LEVEL SECURITY;
    CREATE INDEX IF NOT EXISTS prayer_locations_rls_user_id_idx ON public.prayer_locations(user_id);
    DROP POLICY IF EXISTS prayer_locations_owner_all ON public.prayer_locations;
    DROP POLICY IF EXISTS prayer_locations_select_own ON public.prayer_locations;
    DROP POLICY IF EXISTS prayer_locations_insert_own ON public.prayer_locations;
    DROP POLICY IF EXISTS prayer_locations_update_own ON public.prayer_locations;
    DROP POLICY IF EXISTS prayer_locations_delete_own ON public.prayer_locations;
    DROP POLICY IF EXISTS prayer_locations_anon_no_access ON public.prayer_locations;
    CREATE POLICY prayer_locations_select_own ON public.prayer_locations FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);
    CREATE POLICY prayer_locations_insert_own ON public.prayer_locations FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = user_id);
    CREATE POLICY prayer_locations_update_own ON public.prayer_locations FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
    CREATE POLICY prayer_locations_delete_own ON public.prayer_locations FOR DELETE TO authenticated USING ((SELECT auth.uid()) = user_id);
    CREATE POLICY prayer_locations_anon_no_access ON public.prayer_locations FOR SELECT TO anon USING (false);
  END IF;

  IF to_regclass('public.prayer_preferences') IS NOT NULL THEN
    ALTER TABLE public.prayer_preferences ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.prayer_preferences FORCE ROW LEVEL SECURITY;
    CREATE INDEX IF NOT EXISTS prayer_preferences_rls_user_id_idx ON public.prayer_preferences(user_id);
    DROP POLICY IF EXISTS prayer_preferences_owner_all ON public.prayer_preferences;
    DROP POLICY IF EXISTS prayer_preferences_select_own ON public.prayer_preferences;
    DROP POLICY IF EXISTS prayer_preferences_insert_own ON public.prayer_preferences;
    DROP POLICY IF EXISTS prayer_preferences_update_own ON public.prayer_preferences;
    DROP POLICY IF EXISTS prayer_preferences_delete_own ON public.prayer_preferences;
    DROP POLICY IF EXISTS prayer_preferences_anon_no_access ON public.prayer_preferences;
    CREATE POLICY prayer_preferences_select_own ON public.prayer_preferences FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);
    CREATE POLICY prayer_preferences_insert_own ON public.prayer_preferences FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = user_id);
    CREATE POLICY prayer_preferences_update_own ON public.prayer_preferences FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
    CREATE POLICY prayer_preferences_delete_own ON public.prayer_preferences FOR DELETE TO authenticated USING ((SELECT auth.uid()) = user_id);
    CREATE POLICY prayer_preferences_anon_no_access ON public.prayer_preferences FOR SELECT TO anon USING (false);
  END IF;

  IF to_regclass('public.prayer_notifications') IS NOT NULL THEN
    ALTER TABLE public.prayer_notifications ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.prayer_notifications FORCE ROW LEVEL SECURITY;
    CREATE INDEX IF NOT EXISTS prayer_notifications_rls_user_id_idx ON public.prayer_notifications(user_id);
    DROP POLICY IF EXISTS prayer_notifications_owner_read ON public.prayer_notifications;
    DROP POLICY IF EXISTS prayer_notifications_owner_insert ON public.prayer_notifications;
    DROP POLICY IF EXISTS prayer_notifications_select_own ON public.prayer_notifications;
    DROP POLICY IF EXISTS prayer_notifications_insert_own ON public.prayer_notifications;
    DROP POLICY IF EXISTS prayer_notifications_update_own ON public.prayer_notifications;
    DROP POLICY IF EXISTS prayer_notifications_delete_own ON public.prayer_notifications;
    DROP POLICY IF EXISTS prayer_notifications_anon_no_access ON public.prayer_notifications;
    CREATE POLICY prayer_notifications_select_own ON public.prayer_notifications FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);
    CREATE POLICY prayer_notifications_insert_own ON public.prayer_notifications FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = user_id);
    CREATE POLICY prayer_notifications_update_own ON public.prayer_notifications FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
    CREATE POLICY prayer_notifications_delete_own ON public.prayer_notifications FOR DELETE TO authenticated USING ((SELECT auth.uid()) = user_id);
    CREATE POLICY prayer_notifications_anon_no_access ON public.prayer_notifications FOR SELECT TO anon USING (false);
  END IF;
END$$;

-- Storage: ensure avatars bucket exists and writes are user-scoped.
DO $$
DECLARE
  can_manage_storage_objects boolean := false;
BEGIN
  IF to_regclass('storage.buckets') IS NOT NULL THEN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg','image/png','image/webp','image/gif'])
    ON CONFLICT (id) DO UPDATE SET
      public = EXCLUDED.public,
      file_size_limit = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;
  END IF;

  SELECT COALESCE(pg_has_role(c.relowner, 'MEMBER'), false)
  INTO can_manage_storage_objects
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'storage'
    AND c.relname = 'objects';

  IF can_manage_storage_objects THEN
    DROP POLICY IF EXISTS avatars_public_select ON storage.objects;
    DROP POLICY IF EXISTS avatars_authenticated_insert_own ON storage.objects;
    DROP POLICY IF EXISTS avatars_authenticated_update_own ON storage.objects;
    DROP POLICY IF EXISTS avatars_authenticated_delete_own ON storage.objects;

    CREATE POLICY avatars_public_select ON storage.objects
      FOR SELECT TO anon, authenticated
      USING (bucket_id = 'avatars');
    CREATE POLICY avatars_authenticated_insert_own ON storage.objects
      FOR INSERT TO authenticated
      WITH CHECK (bucket_id = 'avatars' AND (SELECT auth.uid())::text = (storage.foldername(name))[1]);
    CREATE POLICY avatars_authenticated_update_own ON storage.objects
      FOR UPDATE TO authenticated
      USING (bucket_id = 'avatars' AND (SELECT auth.uid())::text = (storage.foldername(name))[1])
      WITH CHECK (bucket_id = 'avatars' AND (SELECT auth.uid())::text = (storage.foldername(name))[1]);
    CREATE POLICY avatars_authenticated_delete_own ON storage.objects
      FOR DELETE TO authenticated
      USING (bucket_id = 'avatars' AND (SELECT auth.uid())::text = (storage.foldername(name))[1]);

    CREATE INDEX IF NOT EXISTS storage_objects_bucket_name_idx ON storage.objects(bucket_id, name);
  ELSIF to_regclass('storage.objects') IS NOT NULL THEN
    RAISE NOTICE 'Skipping storage.objects policy/index changes because % is not the table owner', current_user;
  END IF;
END$$;
