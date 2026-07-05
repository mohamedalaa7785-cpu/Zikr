-- Migration: Fix duplicate migration key issue
-- Generated: 2024-07-05
-- Description: This migration removes the duplicate schema_migrations entry if it exists
--              and ensures the category type is properly created.

-- Remove the duplicate migration record if it exists
DELETE FROM supabase_migrations.schema_migrations 
WHERE version = 20240705000001;

-- Ensure the category enum type exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'category' AND typnamespace = 
    (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  ) THEN
    CREATE TYPE public.category AS ENUM (
      'faith',
      'prophets',
      'sahaba',
      'documentaries',
      'history'
    );
  END IF;
END $$;

-- Re-insert the migration records to track that they were applied
INSERT INTO supabase_migrations.schema_migrations (version, name, statements)
VALUES 
  (20240705000001, 'create_category_type', 'CREATE TYPE public.category AS ENUM'),
  (20240705000002, 'seed_content', 'ALTER TYPE category / INSERT INTO')
ON CONFLICT (version) DO NOTHING;
