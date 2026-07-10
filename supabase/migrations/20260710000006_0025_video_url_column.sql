-- 0025: video_url + publish log status values
-- lib/services/video-automation.ts persists the generated video URL so a
-- retry never regenerates or re-publishes an already-published asset.
-- Idempotent: safe to run multiple times.

ALTER TABLE public.video_generation_requests
  ADD COLUMN IF NOT EXISTS video_url TEXT;

-- video_publish_log.status now records 'success' | 'partial' | 'failed'
-- (column is already TEXT with a default of 'success' — no change needed,
-- documented here for schema traceability).
