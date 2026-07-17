-- Ensure all video automation tables exist with correct columns.
-- Additive/idempotent: uses CREATE TABLE IF NOT EXISTS and ADD COLUMN IF NOT EXISTS.
-- These tables were previously applied directly to the database; this migration
-- guarantees they will be present on any fresh deployment or branch restore.

-- video_generation_requests: core table for the video pipeline
CREATE TABLE IF NOT EXISTS public.video_generation_requests (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title           text NOT NULL,
  description     text,
  category        text NOT NULL,
  content         jsonb NOT NULL DEFAULT '{}',
  duration        integer,
  thumbnail_url   text,
  status          text NOT NULL DEFAULT 'pending',
  youtube_id      text,
  facebook_id     text,
  video_url       text,
  error_message   text,
  error_details   text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- Columns that may be missing on older deployments
ALTER TABLE public.video_generation_requests
  ADD COLUMN IF NOT EXISTS error_message text,
  ADD COLUMN IF NOT EXISTS error_details text;

-- video_publish_log: audit trail for all publish events
CREATE TABLE IF NOT EXISTS public.video_publish_log (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id     uuid REFERENCES public.video_generation_requests(id) ON DELETE SET NULL,
  youtube_id   text,
  facebook_id  text,
  status       text NOT NULL DEFAULT 'success',
  published_at timestamptz NOT NULL DEFAULT now(),
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- video_publishing_config: singleton configuration row
CREATE TABLE IF NOT EXISTS public.video_publishing_config (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  youtube_enabled     boolean NOT NULL DEFAULT false,
  youtube_channel_id  text,
  facebook_enabled    boolean NOT NULL DEFAULT false,
  facebook_page_id    text,
  auto_publish        boolean NOT NULL DEFAULT false,
  publish_schedule    text,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS video_gen_requests_status_idx
  ON public.video_generation_requests(status, created_at);

CREATE INDEX IF NOT EXISTS video_publish_log_video_id_idx
  ON public.video_publish_log(video_id);

-- RLS: only service role and admin users can manage video generation
ALTER TABLE public.video_generation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_generation_requests FORCE ROW LEVEL SECURITY;
ALTER TABLE public.video_publish_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_publish_log FORCE ROW LEVEL SECURITY;
ALTER TABLE public.video_publishing_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_publishing_config FORCE ROW LEVEL SECURITY;

DO $$
BEGIN
  -- video_generation_requests: admin read/write, service role bypasses RLS
  DROP POLICY IF EXISTS video_gen_requests_admin_all   ON public.video_generation_requests;
  DROP POLICY IF EXISTS video_gen_requests_anon_deny   ON public.video_generation_requests;
  CREATE POLICY video_gen_requests_admin_all ON public.video_generation_requests
    FOR ALL TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = (SELECT auth.uid()) AND role = 'admin'
      )
    )
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = (SELECT auth.uid()) AND role = 'admin'
      )
    );
  CREATE POLICY video_gen_requests_anon_deny ON public.video_generation_requests
    FOR SELECT TO anon USING (false);

  -- video_publish_log: admin read-only (writes come from service role)
  DROP POLICY IF EXISTS video_publish_log_admin_select ON public.video_publish_log;
  DROP POLICY IF EXISTS video_publish_log_anon_deny    ON public.video_publish_log;
  CREATE POLICY video_publish_log_admin_select ON public.video_publish_log
    FOR SELECT TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = (SELECT auth.uid()) AND role = 'admin'
      )
    );
  CREATE POLICY video_publish_log_anon_deny ON public.video_publish_log
    FOR SELECT TO anon USING (false);

  -- video_publishing_config: admin all
  DROP POLICY IF EXISTS video_publishing_config_admin_all  ON public.video_publishing_config;
  DROP POLICY IF EXISTS video_publishing_config_anon_deny  ON public.video_publishing_config;
  CREATE POLICY video_publishing_config_admin_all ON public.video_publishing_config
    FOR ALL TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = (SELECT auth.uid()) AND role = 'admin'
      )
    )
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = (SELECT auth.uid()) AND role = 'admin'
      )
    );
  CREATE POLICY video_publishing_config_anon_deny ON public.video_publishing_config
    FOR SELECT TO anon USING (false);
END$$;
