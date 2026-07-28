-- ============================================================================
-- ZIKR MEDIA - FIX SUBSCRIPTIONS SCHEMA DRIFT
-- Date: 2026-07-29
-- Purpose: Align the 'subscriptions' table schema with Drizzle and the
--          20260727000000_schema_reconciliation.sql migration.
-- ============================================================================

DO $$ BEGIN
  -- Drop columns that are not in Drizzle or the reconciliation migration
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='subscriptions' AND column_name='name') THEN
    ALTER TABLE public.subscriptions DROP COLUMN name;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='subscriptions' AND column_name='status') THEN
    ALTER TABLE public.subscriptions DROP COLUMN status;
  END IF;

  -- Add columns that are in Drizzle and the reconciliation migration but might be missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='subscriptions' AND column_name='language') THEN
    ALTER TABLE public.subscriptions ADD COLUMN language text NOT NULL DEFAULT 'ar';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='subscriptions' AND column_name='verified') THEN
    ALTER TABLE public.subscriptions ADD COLUMN verified boolean NOT NULL DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='subscriptions' AND column_name='verification_token') THEN
    ALTER TABLE public.subscriptions ADD COLUMN verification_token text;
  END IF;

  -- Ensure email is unique and not null
  ALTER TABLE public.subscriptions ALTER COLUMN email SET NOT NULL;
  ALTER TABLE public.subscriptions ADD CONSTRAINT subscriptions_email_unique UNIQUE (email);
END $$;
