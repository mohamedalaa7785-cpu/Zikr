-- Cover foreign keys reported by Supabase's performance advisor.
-- IF NOT EXISTS keeps this safe to replay across environments.
CREATE INDEX IF NOT EXISTS ai_history_user_id_idx ON public.ai_history (user_id);
CREATE INDEX IF NOT EXISTS favorite_recitations_reciter_id_idx ON public.favorite_recitations (reciter_id);
CREATE INDEX IF NOT EXISTS memorization_attempts_user_id_idx ON public.memorization_attempts (user_id);
CREATE INDEX IF NOT EXISTS recent_recitations_reciter_id_idx ON public.recent_recitations (reciter_id);
CREATE INDEX IF NOT EXISTS reciter_favorites_reciter_id_idx ON public.reciter_favorites (reciter_id);
CREATE INDEX IF NOT EXISTS story_favorites_story_id_idx ON public.story_favorites (story_id);
CREATE INDEX IF NOT EXISTS story_reads_story_id_idx ON public.story_reads (story_id);
CREATE INDEX IF NOT EXISTS tawasheeh_favorites_tawasheeh_id_idx ON public.tawasheeh_favorites (tawasheeh_id);
CREATE INDEX IF NOT EXISTS tawasheeh_playlist_items_tawasheeh_id_idx ON public.tawasheeh_playlist_items (tawasheeh_id);
CREATE INDEX IF NOT EXISTS user_settings_default_reciter_id_idx ON public.user_settings (default_reciter_id);
