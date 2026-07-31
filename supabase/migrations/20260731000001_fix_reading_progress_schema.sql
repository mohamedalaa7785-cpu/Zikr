-- Fix reading_progress table to match code expectations
-- The code expects: user_id, content_type, content_id, position, metadata
-- Table currently has: user_id, scope, ref, progress_json
-- Add missing columns and migrate data

-- Add missing columns
ALTER TABLE public.reading_progress
  ADD COLUMN IF NOT EXISTS content_type text,
  ADD COLUMN IF NOT EXISTS content_id text,
  ADD COLUMN IF NOT EXISTS position integer,
  ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;

-- Migrate existing data: scope -> content_type, ref -> content_id, progress_json -> metadata
UPDATE public.reading_progress
SET
  content_type = COALESCE(content_type, scope::text),
  content_id = COALESCE(content_id, ref),
  position = (progress_json->>'ayah_number')::integer,
  metadata = progress_json
WHERE content_type IS NULL;

-- Make content_type and content_id NOT NULL after migration
ALTER TABLE public.reading_progress
  ALTER COLUMN content_type SET NOT NULL,
  ALTER COLUMN content_id SET NOT NULL;

-- Add unique constraint for upsert onConflict
DROP INDEX IF EXISTS reading_progress_user_content_unique;
CREATE UNIQUE INDEX IF NOT EXISTS reading_progress_user_content_unique
  ON public.reading_progress (user_id, content_type, content_id);

-- Keep scope and ref for backward compatibility but make them nullable
ALTER TABLE public.reading_progress
  ALTER COLUMN scope DROP NOT NULL,
  ALTER COLUMN ref DROP NOT NULL;

-- Drop old unique index
DROP INDEX IF EXISTS reading_progress_user_scope_ref_unique;
