-- Align kids_content legacy seed columns with the current application schema.
-- Some production databases contain the older content_type/age_min/age_max
-- shape, while the app reads type/age_group. Keep both shapes synchronized so
-- public kids pages stay visible during rolling deployments and migrations.

DO $$
BEGIN
  IF to_regclass('public.kids_content') IS NOT NULL THEN
    ALTER TABLE public.kids_content
      ADD COLUMN IF NOT EXISTS type text DEFAULT 'story',
      ADD COLUMN IF NOT EXISTS content_type text,
      ADD COLUMN IF NOT EXISTS summary_ar text,
      ADD COLUMN IF NOT EXISTS summary_en text,
      ADD COLUMN IF NOT EXISTS age_group text DEFAULT '6-8',
      ADD COLUMN IF NOT EXISTS age_min integer,
      ADD COLUMN IF NOT EXISTS age_max integer,
      ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false,
      ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;

    UPDATE public.kids_content
      SET type = COALESCE(NULLIF(content_type, ''), NULLIF(type, ''), 'story'),
          content_type = COALESCE(NULLIF(content_type, ''), NULLIF(type, ''), 'story'),
          age_group = COALESCE(
            NULLIF(age_group, ''),
            CASE
              WHEN COALESCE(age_max, age_min, 8) <= 5 THEN '3-5'
              WHEN COALESCE(age_min, age_max, 6) <= 8 AND COALESCE(age_max, age_min, 8) <= 10 THEN '6-8'
              WHEN COALESCE(age_min, age_max, 9) <= 12 AND COALESCE(age_max, age_min, 12) <= 12 THEN '9-12'
              ELSE '13-15'
            END,
            '6-8'
          ),
          age_min = COALESCE(
            age_min,
            CASE age_group
              WHEN '3-5' THEN 3
              WHEN '6-8' THEN 6
              WHEN '9-12' THEN 9
              WHEN '13-15' THEN 13
              ELSE 6
            END
          ),
          age_max = COALESCE(
            age_max,
            CASE age_group
              WHEN '3-5' THEN 5
              WHEN '6-8' THEN 8
              WHEN '9-12' THEN 12
              WHEN '13-15' THEN 15
              ELSE 8
            END
          ),
          content_ar = COALESCE(content_ar, summary_ar),
          content_en = COALESCE(content_en, summary_en),
          is_active = COALESCE(is_active, true);

    ALTER TABLE public.kids_content
      ALTER COLUMN type SET NOT NULL,
      ALTER COLUMN age_group SET NOT NULL,
      ALTER COLUMN is_active SET NOT NULL;

    CREATE INDEX IF NOT EXISTS kids_content_public_legacy_idx
      ON public.kids_content(published, is_active, age_group, type, content_type);
  END IF;
END$$;
