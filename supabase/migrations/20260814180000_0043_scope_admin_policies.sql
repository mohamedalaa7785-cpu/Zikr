-- Restrict admin-only policies that were accidentally granted to public.
-- Public read policies remain unchanged; authenticated admin checks still use
-- private.is_admin_user() and continue to protect writes.

ALTER POLICY battles_admin_write ON public.battles TO authenticated;
ALTER POLICY companions_admin_write ON public.companions TO authenticated;
ALTER POLICY conquests_admin_write ON public.conquests TO authenticated;
ALTER POLICY "Admins can manage render jobs" ON public.render_jobs TO authenticated;
ALTER POLICY "Admins can manage publish log" ON public.video_publish_log TO authenticated;
