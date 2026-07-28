-- ============================================================================
-- ZIKR MEDIA - ADD MISSING LEGACY TABLES
-- Date: 2026-07-29
-- Purpose: Create user_behavior, tasks, subscriptions tables that are missing
--          from Supabase but defined in Drizzle schema and used in code.
-- Status: Fully idempotent - safe to re-run
-- ============================================================================

-- ── USER BEHAVIOR TABLE ──────────────────────────────────────────────────────
-- This table tracks user interactions and is used by the analytics endpoint

CREATE TABLE IF NOT EXISTS public.user_behavior (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users (id),
  page text NOT NULL,
  time_spent integer NOT NULL DEFAULT 0,
  interaction text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_behavior_user_id ON public.user_behavior (user_id);
CREATE INDEX IF NOT EXISTS idx_user_behavior_created_at ON public.user_behavior (created_at);

-- Enable RLS
ALTER TABLE public.user_behavior ENABLE ROW LEVEL SECURITY;

-- RLS: Authenticated users can insert their own behavior, admins can read all
DROP POLICY IF EXISTS "user_behavior_insert" ON public.user_behavior;
CREATE POLICY "user_behavior_insert" ON public.user_behavior
  FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "user_behavior_select" ON public.user_behavior;
CREATE POLICY "user_behavior_select" ON public.user_behavior
  FOR SELECT TO authenticated USING (
    user_id = (SELECT auth.uid()) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = (SELECT auth.uid()) AND profiles.role = 'admin')
  );

-- ── TASKS TABLE ──────────────────────────────────────────────────────────────
-- Legacy task management table

CREATE TABLE IF NOT EXISTS public.tasks (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles (id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'pending',
  priority text DEFAULT 'medium',
  due_date timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks (user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks (status);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tasks_user_access" ON public.tasks;
CREATE POLICY "tasks_user_access" ON public.tasks
  FOR ALL TO authenticated USING (
    user_id = (SELECT auth.uid()) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = (SELECT auth.uid()) AND profiles.role = 'admin')
  );

-- ── SUBSCRIPTIONS TABLE ──────────────────────────────────────────────────────
-- Email subscriptions

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  name text,
  status text NOT NULL DEFAULT 'active',
  subscribed_at timestamp with time zone NOT NULL DEFAULT now(),
  unsubscribed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_email ON public.subscriptions (email);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions (status);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "subscriptions_public_insert" ON public.subscriptions;
CREATE POLICY "subscriptions_public_insert" ON public.subscriptions
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "subscriptions_admin_read" ON public.subscriptions;
CREATE POLICY "subscriptions_admin_read" ON public.subscriptions
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = (SELECT auth.uid()) AND profiles.role = 'admin')
  );

-- ── SAVED STORIES TABLE ──────────────────────────────────────────────────────
-- User-saved stories for later reading

CREATE TABLE IF NOT EXISTS public.saved_stories (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  story_id uuid NOT NULL REFERENCES public.stories (id) ON DELETE CASCADE,
  saved_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT saved_stories_unique UNIQUE (user_id, story_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_stories_user_id ON public.saved_stories (user_id);

ALTER TABLE public.saved_stories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "saved_stories_user_access" ON public.saved_stories;
CREATE POLICY "saved_stories_user_access" ON public.saved_stories
  FOR ALL TO authenticated USING (user_id = (SELECT auth.uid()));

-- ── STORY PROGRESS TABLE ────────────────────────────────────────────────────
-- Track user progress reading stories

CREATE TABLE IF NOT EXISTS public.story_progress (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  story_id uuid NOT NULL REFERENCES public.stories (id) ON DELETE CASCADE,
  progress_percent integer NOT NULL DEFAULT 0,
  last_read_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT story_progress_unique UNIQUE (user_id, story_id)
);

CREATE INDEX IF NOT EXISTS idx_story_progress_user_id ON public.story_progress (user_id);

ALTER TABLE public.story_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "story_progress_user_access" ON public.story_progress;
CREATE POLICY "story_progress_user_access" ON public.story_progress
  FOR ALL TO authenticated USING (user_id = (SELECT auth.uid()));

-- ── CONTACTS TABLE ENSURE RLS ───────────────────────────────────────────────

ALTER TABLE IF EXISTS public.contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "contacts_insert" ON public.contacts;
CREATE POLICY "contacts_insert" ON public.contacts
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "contacts_admin_read" ON public.contacts;
CREATE POLICY "contacts_admin_read" ON public.contacts
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = (SELECT auth.uid()) AND profiles.role = 'admin')
  );

-- ── EPISODES TABLE ENSURE RLS ───────────────────────────────────────────────

ALTER TABLE IF EXISTS public.episodes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "episodes_select" ON public.episodes;
CREATE POLICY "episodes_select" ON public.episodes
  FOR SELECT TO anon, authenticated USING (true);

-- End of migration
