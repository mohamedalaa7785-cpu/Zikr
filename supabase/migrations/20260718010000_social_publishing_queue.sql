-- Queue admin-authored content for automatic social publishing.
CREATE TABLE IF NOT EXISTS public.social_publish_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type text NOT NULL,
  content_id text,
  title text NOT NULL,
  body text,
  image_url text,
  video_url text,
  target_platforms text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'queued',
  scheduled_at timestamptz,
  published_at timestamptz,
  error_message text,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS social_publish_queue_status_idx
  ON public.social_publish_queue(status, scheduled_at, created_at);

ALTER TABLE public.social_publish_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_publish_queue FORCE ROW LEVEL SECURITY;

DO $$
BEGIN
  DROP POLICY IF EXISTS social_publish_queue_admin_all ON public.social_publish_queue;
  DROP POLICY IF EXISTS social_publish_queue_anon_deny ON public.social_publish_queue;

  CREATE POLICY social_publish_queue_admin_all ON public.social_publish_queue
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));

  CREATE POLICY social_publish_queue_anon_deny ON public.social_publish_queue
    FOR SELECT TO anon USING (false);
END $$;
