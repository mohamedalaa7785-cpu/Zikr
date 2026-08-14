-- Remove duplicate foreign keys created by earlier schema reconciliation passes.
-- Keep one canonical constraint per relationship; application code does not depend on names.

ALTER TABLE public.stories
  DROP CONSTRAINT IF EXISTS stories_user_id_profiles_id_fk;

ALTER TABLE public.story_progress
  DROP CONSTRAINT IF EXISTS story_progress_user_id_profiles_id_fk;

ALTER TABLE public.saved_stories
  DROP CONSTRAINT IF EXISTS saved_stories_user_id_profiles_id_fk;

ALTER TABLE public.tasks
  DROP CONSTRAINT IF EXISTS tasks_user_id_profiles_fkey;

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_id_auth_users_fk;
