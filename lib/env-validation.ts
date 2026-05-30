import { z } from 'zod';

export const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string(),
  DATABASE_URL: z.string().url(),
  AUTH_CALLBACK_URL: z.string().url(),
  GEMINI_API_KEY: z.string().optional(),
  GEMINI_MODEL: z.string().optional(),
  AWS_S3_ACCESS_KEY_ID: z.string().optional(),
  AWS_S3_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_S3_BUCKET_NAME: z.string().optional(),
  AWS_S3_REGION: z.string().optional(),
  QURAN_API_BASE_URL: z.string().url().optional(),
  QURAN_AUDIO_CDN_URL: z.string().url().optional(),
  HADITH_API_BASE_URL: z.string().url().optional(),
  YOUTUBE_API_KEY: z.string().optional(),
  YOUTUBE_CHANNEL_ID: z.string().optional(),
  YOUTUBE_PLAYLIST_ID: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(env: Record<string, string | undefined>): Env {
  const parsed = envSchema.safeParse(env);
  if (!parsed.success) {
    console.warn('Environment variable validation failed. This might be expected during build if envs are not set.');
    // In production runtime, we want to fail fast. During build, we might want to continue.
    if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PHASE) {
      console.error('Environment variable validation failed:', parsed.error);
      throw new Error('Invalid environment variables. Please check your .env file and environment configuration.');
    }
    // Return partial or empty object cast to Env for build phase
    return env as Env;
  }
  return parsed.data;
}
