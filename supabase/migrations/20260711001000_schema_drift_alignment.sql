-- Align Drizzle schema and application queries with the Supabase database.
-- Additive/idempotent only: no data deletion and no destructive rewrites.

DO $$
BEGIN
  IF to_regclass('public.companions') IS NOT NULL THEN
    ALTER TABLE public.companions ADD COLUMN IF NOT EXISTS title_ar text;
    ALTER TABLE public.companions ADD COLUMN IF NOT EXISTS birth_place_ar text;
    ALTER TABLE public.companions ADD COLUMN IF NOT EXISTS death_place_ar text;
    ALTER TABLE public.companions ADD COLUMN IF NOT EXISTS death_year text;
    CREATE INDEX IF NOT EXISTS companions_published_category_idx ON public.companions(published, category);
  END IF;

  IF to_regclass('public.battles') IS NOT NULL THEN
    ALTER TABLE public.battles ADD COLUMN IF NOT EXISTS year_hijri integer;
    UPDATE public.battles
      SET year_hijri = NULLIF(regexp_replace(date_hijri, '[^0-9]', '', 'g'), '')::integer
      WHERE year_hijri IS NULL
        AND date_hijri IS NOT NULL
        AND NULLIF(regexp_replace(date_hijri, '[^0-9]', '', 'g'), '') IS NOT NULL;
    CREATE INDEX IF NOT EXISTS battles_published_year_hijri_idx ON public.battles(published, year_hijri);
  END IF;
END$$;
