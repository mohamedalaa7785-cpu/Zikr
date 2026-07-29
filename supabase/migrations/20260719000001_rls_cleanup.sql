-- Cleanup redundant and duplicate RLS policies

-- Video Categories Cleanup
DROP POLICY IF EXISTS "Public can read video categories" ON public.video_categories;
DROP POLICY IF EXISTS "public_read_video_categories_anon" ON public.video_categories;
DROP POLICY IF EXISTS "select_video_categories" ON public.video_categories;
DROP POLICY IF EXISTS "select_video_categories_anon" ON public.video_categories;
DROP POLICY IF EXISTS "public_read_video_categories" ON public.video_categories;

CREATE POLICY "public_read_video_categories" ON public.video_categories
FOR SELECT TO anon, authenticated USING (true);

-- Videos Cleanup
DROP POLICY IF EXISTS "Public can read videos" ON public.videos;
DROP POLICY IF EXISTS "public_read_videos_anon" ON public.videos;
DROP POLICY IF EXISTS "select_videos" ON public.videos;
DROP POLICY IF EXISTS "select_videos_anon" ON public.videos;
DROP POLICY IF EXISTS "public_read_videos" ON public.videos;
DROP POLICY IF EXISTS "Admins can manage videos" ON public.videos;

CREATE POLICY "public_read_videos" ON public.videos
FOR SELECT TO anon, authenticated USING (published IS TRUE);

-- Consolidate admin policies for videos
DROP POLICY IF EXISTS "delete_videos" ON public.videos;
DROP POLICY IF EXISTS "insert_videos" ON public.videos;
DROP POLICY IF EXISTS "update_videos" ON public.videos;

CREATE POLICY "admin_all_videos" ON public.videos
FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = (SELECT auth.uid()) AND profiles.role = 'admin'
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = (SELECT auth.uid()) AND profiles.role = 'admin'
  )
);

-- Consolidate admin policies for video_categories
DROP POLICY IF EXISTS "delete_video_categories" ON public.video_categories;
DROP POLICY IF EXISTS "insert_video_categories" ON public.video_categories;
DROP POLICY IF EXISTS "update_video_categories" ON public.video_categories;

CREATE POLICY "admin_all_video_categories" ON public.video_categories
FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = (SELECT auth.uid()) AND profiles.role = 'admin'
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = (SELECT auth.uid()) AND profiles.role = 'admin'
  )
);
