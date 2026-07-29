-- Strengthen admin controls and align kids_content with application fields.
-- Idempotent and additive: keeps existing content intact while closing RLS gaps.

CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = (SELECT auth.uid())
      AND role = 'admin'
  );
$$;

DO $$
BEGIN
  IF to_regclass('public.kids_content') IS NOT NULL THEN
    ALTER TABLE public.kids_content
      ADD COLUMN IF NOT EXISTS title_en text,
      ADD COLUMN IF NOT EXISTS content_en text,
      ADD COLUMN IF NOT EXISTS video_url text,
      ADD COLUMN IF NOT EXISTS quiz_data jsonb,
      ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb,
      ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

    UPDATE public.kids_content
      SET title_en = COALESCE(title_en, title_ar),
          metadata = COALESCE(metadata, '{}'::jsonb),
          is_active = COALESCE(is_active, true),
          updated_at = COALESCE(updated_at, created_at, now())
      WHERE title_en IS NULL
         OR metadata IS NULL
         OR is_active IS NULL
         OR updated_at IS NULL;

    ALTER TABLE public.kids_content
      ALTER COLUMN title_en SET NOT NULL,
      ALTER COLUMN is_active SET NOT NULL,
      ALTER COLUMN updated_at SET NOT NULL;

    CREATE UNIQUE INDEX IF NOT EXISTS kids_content_slug_unique_idx ON public.kids_content(slug);
    CREATE INDEX IF NOT EXISTS kids_content_public_idx ON public.kids_content(published, is_active, age_group, type);

    ALTER TABLE public.kids_content ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS kids_content_public_read ON public.kids_content;
    DROP POLICY IF EXISTS kids_content_admin_all ON public.kids_content;

    CREATE POLICY kids_content_public_read ON public.kids_content
      FOR SELECT
      USING (published IS TRUE AND is_active IS TRUE);

    CREATE POLICY kids_content_admin_all ON public.kids_content
      FOR ALL
      USING (public.is_admin_user())
      WITH CHECK (public.is_admin_user());
  END IF;
END$$;
