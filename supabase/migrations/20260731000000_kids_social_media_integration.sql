-- Kids content social media integration
-- Add Facebook and YouTube support for kids content

DO $$
BEGIN
  IF to_regclass('public.kids_content') IS NOT NULL THEN
    -- Add social media related columns if they don't exist
    ALTER TABLE public.kids_content
      ADD COLUMN IF NOT EXISTS youtube_video_id text,
      ADD COLUMN IF NOT EXISTS facebook_share_enabled boolean NOT NULL DEFAULT true,
      ADD COLUMN IF NOT EXISTS likes integer NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS shares integer NOT NULL DEFAULT 0;

    -- Add comment if social columns were added
    COMMENT ON COLUMN public.kids_content.youtube_video_id IS 'YouTube video ID for embedded videos';
    COMMENT ON COLUMN public.kids_content.facebook_share_enabled IS 'Allow sharing on Facebook';
    COMMENT ON COLUMN public.kids_content.likes IS 'Number of likes for the content';
    COMMENT ON COLUMN public.kids_content.shares IS 'Number of shares for the content';

    -- Create index for social media queries
    CREATE INDEX IF NOT EXISTS kids_content_social_stats_idx
      ON public.kids_content(facebook_share_enabled, published, likes, shares)
      WHERE published = true AND is_active = true;
      
    -- Update metadata JSONB to include share messages if needed
    UPDATE public.kids_content
      SET metadata = COALESCE(metadata, '{}'::jsonb) || '{"shareMessage": "شارك هذا المحتوى التعليمي الرائع!"}'::jsonb
      WHERE metadata IS NULL OR NOT metadata ? 'shareMessage';
  END IF;
END$$;

-- Add RLS policy for kids content shares
DO $$
BEGIN
  IF to_regclass('public.kids_content') IS NOT NULL THEN
    -- Enable RLS if not already enabled
    ALTER TABLE public.kids_content ENABLE ROW LEVEL SECURITY;

    -- Policy to allow public read access to published content
    CREATE POLICY IF NOT EXISTS "Allow public read access to published kids content"
      ON public.kids_content
      FOR SELECT
      USING (published = true AND is_active = true);

    -- Policy to allow service role to update social stats
    CREATE POLICY IF NOT EXISTS "Allow service role to update social stats"
      ON public.kids_content
      FOR UPDATE
      USING (auth.jwt() ->> 'role' = 'service_role')
      WITH CHECK (auth.jwt() ->> 'role' = 'service_role');
  END IF;
END$$;
