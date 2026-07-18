-- Schema sync: add unique constraints matching drizzle/schema.ts
-- Additive and idempotent — uses IF NOT EXISTS guards.

-- 1. saved_stories: prevent duplicate saves for the same user+story
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'saved_stories_user_id_story_id_key'
      AND conrelid = 'public.saved_stories'::regclass
  ) THEN
    ALTER TABLE public.saved_stories
      ADD CONSTRAINT saved_stories_user_id_story_id_key UNIQUE (user_id, story_id);
  END IF;
END $$;

-- 2. story_progress: prevent duplicate progress rows for the same user+story
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'story_progress_user_id_story_id_key'
      AND conrelid = 'public.story_progress'::regclass
  ) THEN
    ALTER TABLE public.story_progress
      ADD CONSTRAINT story_progress_user_id_story_id_key UNIQUE (user_id, story_id);
  END IF;
END $$;

-- 3. Ensure push_token index on profiles for efficient FCM lookups
CREATE INDEX IF NOT EXISTS profiles_push_token_idx ON public.profiles (push_token)
  WHERE push_token IS NOT NULL;
