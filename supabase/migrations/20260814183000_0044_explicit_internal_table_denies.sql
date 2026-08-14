-- These tables are intentionally service-role-only. Explicit deny policies
-- document that decision and keep the public/authenticated roles blocked.

CREATE POLICY prayer_schedule_cache_no_public_access
  ON public.prayer_schedule_cache
  FOR ALL
  TO public
  USING (false)
  WITH CHECK (false);

CREATE POLICY push_runtime_settings_no_public_access
  ON public.push_runtime_settings
  FOR ALL
  TO public
  USING (false)
  WITH CHECK (false);
