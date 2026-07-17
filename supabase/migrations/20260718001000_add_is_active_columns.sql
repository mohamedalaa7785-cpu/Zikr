-- Add missing is_active columns to content tables that have them in the Drizzle
-- schema but were absent from the generated Supabase types.
-- Additive/idempotent: uses ADD COLUMN IF NOT EXISTS.

DO $$
BEGIN
  IF to_regclass('public.article_categories') IS NOT NULL THEN
    ALTER TABLE public.article_categories
      ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;
  END IF;

  IF to_regclass('public.dua_categories') IS NOT NULL THEN
    ALTER TABLE public.dua_categories
      ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;
  END IF;

  IF to_regclass('public.video_categories') IS NOT NULL THEN
    ALTER TABLE public.video_categories
      ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;
    -- video_categories.description_ar / description_en also missing from types
    ALTER TABLE public.video_categories
      ADD COLUMN IF NOT EXISTS description_ar text,
      ADD COLUMN IF NOT EXISTS description_en text;
  END IF;

  IF to_regclass('public.tawasheeh_categories') IS NOT NULL THEN
    ALTER TABLE public.tawasheeh_categories
      ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;
  END IF;

  IF to_regclass('public.tawasheeh') IS NOT NULL THEN
    ALTER TABLE public.tawasheeh
      ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;
  END IF;

  IF to_regclass('public.kids_content') IS NOT NULL THEN
    ALTER TABLE public.kids_content
      ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;
  END IF;
END$$;
