-- 0024: video_publish_log — required by lib/services/video-automation.ts
-- The publishing pipeline logs every successful YouTube/Facebook publish here.
-- Idempotent: safe to run multiple times.

CREATE TABLE IF NOT EXISTS public.video_publish_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID REFERENCES public.video_generation_requests(id) ON DELETE SET NULL,
  youtube_id TEXT,
  facebook_id TEXT,
  status TEXT NOT NULL DEFAULT 'success',
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_video_publish_log_video ON public.video_publish_log (video_id);
CREATE INDEX IF NOT EXISTS idx_video_publish_log_date  ON public.video_publish_log (published_at DESC);

-- RLS: service-role only (written by server cron, read by admin dashboard)
ALTER TABLE public.video_publish_log ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'video_publish_log' AND policyname = 'admin_read_publish_log'
  ) THEN
    CREATE POLICY admin_read_publish_log ON public.video_publish_log
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles p
          WHERE p.id = auth.uid() AND p.role = 'admin'
        )
      );
  END IF;
END $$;
