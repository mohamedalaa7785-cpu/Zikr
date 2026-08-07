-- ============================================================
-- 1. Move pg_trgm and unaccent extensions out of the public schema
-- ============================================================
-- Both extensions are relocatable. We create a dedicated schema
-- and move them there so their objects no longer live in `public`,
-- which is exposed via the Data API.

CREATE SCHEMA IF NOT EXISTS extensions;

ALTER EXTENSION pg_trgm  SET SCHEMA extensions;
ALTER EXTENSION unaccent SET SCHEMA extensions;

-- ============================================================
-- 2. Lock down trigger SECURITY DEFINER functions
-- ============================================================
-- create_profile_for_new_user, create_profile_on_login, and
-- ensure_profile_for_user are trigger functions called by triggers
-- on auth.users. They must run as SECURITY DEFINER (the table owner)
-- to insert into public.profiles, but they should NOT be callable as
-- RPC endpoints by anon/authenticated roles. Revoke EXECUTE from
-- PUBLIC (inherited by anon and authenticated) so they can only be
-- invoked by the trigger mechanism.

REVOKE EXECUTE ON FUNCTION public.create_profile_for_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.create_profile_on_login()    FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.ensure_profile_for_user()    FROM PUBLIC;

-- ============================================================
-- 3. Switch is_admin_user to SECURITY INVOKER + restrict EXECUTE
-- ============================================================
-- is_admin_user() is a helper that checks the profiles table for an
-- 'admin' role. As SECURITY DEFINER it ran as the owner and was
-- callable by anyone via the Data API. The profiles table has a
-- public SELECT policy, so an INVOKER function can read it fine.
-- We also restrict EXECUTE to authenticated only, since anon has no
-- valid auth.uid() and should not be probing for admin accounts.

CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = (SELECT auth.uid())
      AND role = 'admin'
  );
$function$;

REVOKE EXECUTE ON FUNCTION public.is_admin_user() FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.is_admin_user() TO authenticated;
