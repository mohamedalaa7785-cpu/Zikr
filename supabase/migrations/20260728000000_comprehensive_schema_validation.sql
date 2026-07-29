-- ============================================================================
-- ZIKR MEDIA - COMPREHENSIVE SCHEMA VALIDATION AND REPAIR
-- Date: 2026-07-28
-- Purpose: Ensure all tables have correct schemas and relationships
-- Status: Fully idempotent and safe
-- ============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- ARTICLES TABLE - ENSURE BILINGUAL COLUMNS
-- ─────────────────────────────────────────────────────────────────────────────

DO $$ BEGIN
  -- Ensure title_ar column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'articles' AND column_name = 'title_ar'
  ) THEN
    ALTER TABLE public.articles ADD COLUMN title_ar text NOT NULL DEFAULT '';
    UPDATE public.articles SET title_ar = title WHERE title_ar = '';
  END IF;

  -- Ensure title_en column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'articles' AND column_name = 'title_en'
  ) THEN
    ALTER TABLE public.articles ADD COLUMN title_en text;
  END IF;

  -- Ensure content_ar column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'articles' AND column_name = 'content_ar'
  ) THEN
    ALTER TABLE public.articles ADD COLUMN content_ar text NOT NULL DEFAULT '';
    UPDATE public.articles SET content_ar = content WHERE content_ar = '';
  END IF;

  -- Ensure content_en column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'articles' AND column_name = 'content_en'
  ) THEN
    ALTER TABLE public.articles ADD COLUMN content_en text;
  END IF;

  -- Ensure summary_ar column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'articles' AND column_name = 'summary_ar'
  ) THEN
    ALTER TABLE public.articles ADD COLUMN summary_ar text;
    UPDATE public.articles SET summary_ar = summary WHERE summary_ar IS NULL AND summary IS NOT NULL;
  END IF;

  -- Ensure summary_en column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'articles' AND column_name = 'summary_en'
  ) THEN
    ALTER TABLE public.articles ADD COLUMN summary_en text;
  END IF;

  -- Ensure featured column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'articles' AND column_name = 'featured'
  ) THEN
    ALTER TABLE public.articles ADD COLUMN featured boolean NOT NULL DEFAULT false;
  END IF;

EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Error adding columns to articles: %', SQLERRM;
END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- CREATE INDEXES FOR PERFORMANCE
-- ─────────────────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_articles_published_featured 
  ON public.articles(published, featured) 
  WHERE published = true;

CREATE INDEX IF NOT EXISTS idx_articles_category_published 
  ON public.articles(category_id, published) 
  WHERE published = true;

CREATE INDEX IF NOT EXISTS idx_articles_slug 
  ON public.articles(slug);

CREATE INDEX IF NOT EXISTS idx_articles_title_ar 
  ON public.articles USING GIN (to_tsvector('arabic', title_ar));

CREATE INDEX IF NOT EXISTS idx_articles_content_ar 
  ON public.articles USING GIN (to_tsvector('arabic', content_ar));

-- ─────────────────────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS articles_select_all ON public.articles;
DROP POLICY IF EXISTS articles_admin_all ON public.articles;

-- Public read access to published articles
CREATE POLICY articles_select_all ON public.articles
  FOR SELECT TO anon, authenticated
  USING (published = true);

-- Admin full access
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

-- ─────────────────────────────────────────────────────────────────────────────
-- VERIFY SCHEMA AND LOG STATUS
-- ─────────────────────────────────────────────────────────────────────────────

DO $$ 
DECLARE
  v_missing_columns INTEGER;
BEGIN
  -- Check if all required columns exist
  SELECT COUNT(*) INTO v_missing_columns
  FROM information_schema.columns
  WHERE table_schema = 'public' 
    AND table_name = 'articles'
    AND column_name IN ('title_ar', 'content_ar', 'featured');
  
  IF v_missing_columns = 3 THEN
    RAISE NOTICE 'Schema validation PASSED: All required columns exist in articles table';
  ELSE
    RAISE WARNING 'Schema validation WARNING: Missing % required columns in articles table', 3 - v_missing_columns;
  END IF;

  -- Log schema version
  RAISE NOTICE 'Articles table schema version: 2.1 (Bilingual Support)';
  RAISE NOTICE 'Schema validation completed at %', NOW();
END $$;
