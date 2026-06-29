import { z } from 'zod';

export const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional().or(z.literal('')),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional().or(z.literal('')),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  DATABASE_URL: z.string().url().optional().or(z.literal('')),
  AUTH_CALLBACK_URL: z.string().url().optional().or(z.literal('')),
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
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(env: Record<string, string | undefined>): Env {
  const parsed = envSchema.safeParse(env);
  
  if (!parsed.success) {
    const nodeEnv = process.env.NODE_ENV;
    const missing = Object.keys(parsed.error.flatten().fieldErrors);

    // ALWAYS log errors loudly but NEVER throw at module load time
    // This prevents site-wide blank screens when optional vars are missing
    if (nodeEnv === 'production') {
      console.error('[env] Production runtime validation issues found:');
      console.error('[env] Missing/invalid variables:', missing.join(', '));
      console.error('[env] Site will continue to load, but specific features may fail.');
    } else {
      console.warn('[env] Environment validation issues:', missing.join(', '));
    }

    // Return the raw env object as Env type to allow partial access
    return env as Env;
  }
  
  return parsed.data;
}
