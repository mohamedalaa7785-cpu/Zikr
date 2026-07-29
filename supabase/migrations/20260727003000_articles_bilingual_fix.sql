-- ============================================================================
-- ZIKR MEDIA - ARTICLES BILINGUAL FIX
-- Date: 2026-07-27 (Part 3)
-- Purpose: Add missing bilingual columns to articles table, fix schema drift
-- Status: Fully idempotent
-- ============================================================================

-- Add missing columns to articles table
DO $$ BEGIN
  -- title_ar
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'articles' AND column_name = 'title_ar'
  ) THEN
    ALTER TABLE public.articles ADD COLUMN title_ar text;
    UPDATE public.articles SET title_ar = title WHERE title_ar IS NULL;
    ALTER TABLE public.articles ALTER COLUMN title_ar SET NOT NULL;
  END IF;

  -- title_en
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'articles' AND column_name = 'title_en'
  ) THEN
    ALTER TABLE public.articles ADD COLUMN title_en text;
  END IF;

  -- summary_ar
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'articles' AND column_name = 'summary_ar'
  ) THEN
    ALTER TABLE public.articles ADD COLUMN summary_ar text;
    UPDATE public.articles SET summary_ar = summary WHERE summary_ar IS NULL AND summary IS NOT NULL;
  END IF;

  -- summary_en
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'articles' AND column_name = 'summary_en'
  ) THEN
    ALTER TABLE public.articles ADD COLUMN summary_en text;
  END IF;

  -- content_ar
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'articles' AND column_name = 'content_ar'
  ) THEN
    ALTER TABLE public.articles ADD COLUMN content_ar text;
    UPDATE public.articles SET content_ar = content WHERE content_ar IS NULL;
    ALTER TABLE public.articles ALTER COLUMN content_ar SET NOT NULL;
  END IF;

  -- content_en
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'articles' AND column_name = 'content_en'
  ) THEN
    ALTER TABLE public.articles ADD COLUMN content_en text;
  END IF;

  -- featured (for consistency with seed data)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'articles' AND column_name = 'featured'
  ) THEN
    ALTER TABLE public.articles ADD COLUMN featured boolean NOT NULL DEFAULT false;
  END IF;
END $$;

-- Rename old single-language columns to _legacy if needed
DO $$ BEGIN
  -- Don't rename title/content yet — keep for backward compatibility
  -- The app uses title/content, and we want them as fallbacks
  -- But ensure they're populated from bilingual versions on INSERT/UPDATE
END $$;

-- Create index for published and featured for better query performance
CREATE INDEX IF NOT EXISTS idx_articles_published_featured ON public.articles(published, featured);
CREATE INDEX IF NOT EXISTS idx_articles_category_published ON public.articles(category_id, published);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);

-- Ensure RLS is enabled on articles
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Read-only policy for everyone
DROP POLICY IF EXISTS articles_select_all ON public.articles;
CREATE POLICY articles_select_all ON public.articles
  FOR SELECT TO anon, authenticated
  USING (published = true);

-- Admin can insert/update/delete
DROP POLICY IF EXISTS articles_admin_all ON public.articles;
CREATE POLICY articles_admin_all ON public.articles
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  );

-- Refresh materialized views if they exist
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.views
    WHERE table_schema = 'public' AND table_name = 'articles_search_view'
  ) THEN
    REFRESH MATERIALIZED VIEW CONCURRENTLY public.articles_search_view;
  END IF;
END $$;

-- Log completion
DO $$ BEGIN
  RAISE NOTICE 'Articles bilingual fix completed successfully';
END $$;
