-- Fix articles table schema - remove redundant 'title' column
-- The articles table should use title_ar (Arabic) and title_en (English)
-- not a generic 'title' column

BEGIN;

-- Drop the old title column and create a computed column if needed
ALTER TABLE public.articles
DROP COLUMN IF EXISTS title;

-- Ensure title_ar is NOT NULL (it should be the primary title)
ALTER TABLE public.articles
ALTER COLUMN title_ar SET NOT NULL;

-- Ensure title_en is also NOT NULL for consistency
ALTER TABLE public.articles
ALTER COLUMN title_en SET NOT NULL;

-- Similarly for content columns
ALTER TABLE public.articles
ALTER COLUMN content_ar SET NOT NULL;

ALTER TABLE public.articles
ALTER COLUMN content_en SET NOT NULL;

COMMIT;
