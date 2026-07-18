-- Align social auto-publishing queue for scheduled Facebook/YouTube processing.
-- Additive/idempotent and safe for existing queue rows.

DO $$
BEGIN
  IF to_regclass('public.social_publish_queue') IS NOT NULL THEN
    ALTER TABLE public.social_publish_queue
      ADD COLUMN IF NOT EXISTS target_platforms text[] NOT NULL DEFAULT '{}',
      ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'queued',
      ADD COLUMN IF NOT EXISTS scheduled_at timestamptz,
      ADD COLUMN IF NOT EXISTS published_at timestamptz,
      ADD COLUMN IF NOT EXISTS error_message text,
      ADD COLUMN IF NOT EXISTS metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
      ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

    UPDATE public.social_publish_queue
      SET status = COALESCE(status, 'queued'),
          target_platforms = COALESCE(target_platforms, '{}'::text[]),
          metadata = COALESCE(metadata, '{}'::jsonb),
          updated_at = COALESCE(updated_at, created_at, now())
      WHERE status IS NULL
         OR target_platforms IS NULL
         OR metadata IS NULL
         OR updated_at IS NULL;

    ALTER TABLE public.social_publish_queue
      DROP CONSTRAINT IF EXISTS social_publish_queue_status_check;
    ALTER TABLE public.social_publish_queue
      ADD CONSTRAINT social_publish_queue_status_check
      CHECK (status IN ('queued', 'processing', 'published', 'partial', 'failed'));

    CREATE INDEX IF NOT EXISTS social_publish_queue_ready_idx
      ON public.social_publish_queue(status, scheduled_at, created_at)
      WHERE status = 'queued';

    CREATE INDEX IF NOT EXISTS social_publish_queue_content_idx
      ON public.social_publish_queue(content_type, content_id);
  END IF;
END$$;
