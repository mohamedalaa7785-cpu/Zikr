-- Migration: fix column names and add push token support
-- Fixes: notification_settings camelCase → snake_case column names
--        app_settings font_size column rename
--        profiles push token columns for mobile notifications
-- Approach: additive — rename columns, no data loss

-- 1. notification_settings: rename camelCase SQL columns to snake_case
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'notification_settings'
      AND column_name  = 'emailNotifications'
  ) THEN
    ALTER TABLE public.notification_settings
      RENAME COLUMN "emailNotifications" TO email_notifications;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'notification_settings'
      AND column_name  = 'pushNotifications'
  ) THEN
    ALTER TABLE public.notification_settings
      RENAME COLUMN "pushNotifications" TO push_notifications;
  END IF;
END $$;

-- 2. app_settings: rename fontSize → font_size
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'app_settings'
      AND column_name  = 'fontSize'
  ) THEN
    ALTER TABLE public.app_settings
      RENAME COLUMN "fontSize" TO font_size;
  END IF;
END $$;

-- 3. stories: normalise timestamps to timestamptz (additive — cast is safe)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'stories'
      AND column_name  = 'created_at'
      AND data_type    = 'timestamp without time zone'
  ) THEN
    ALTER TABLE public.stories
      ALTER COLUMN created_at TYPE timestamptz USING created_at AT TIME ZONE 'UTC',
      ALTER COLUMN updated_at TYPE timestamptz USING updated_at AT TIME ZONE 'UTC';
  END IF;
END $$;

-- 4. profiles: add push-notification token columns for Capacitor FCM/APNs
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS push_token    text,
  ADD COLUMN IF NOT EXISTS push_platform text CHECK (push_platform IN ('android', 'ios'));

-- 5. Ensure RLS is enabled on notification_settings (was previously unchecked)
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'notification_settings'
      AND policyname = 'Users can manage their own notification settings'
  ) THEN
    CREATE POLICY "Users can manage their own notification settings"
      ON public.notification_settings
      FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;
