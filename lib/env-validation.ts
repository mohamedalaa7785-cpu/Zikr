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
    const isNextBuild = Boolean(process.env.NEXT_PHASE);
    const nodeEnv = process.env.NODE_ENV;
    const isBuildPhase = nodeEnv === 'production' && isNextBuild;

    // During Next.js build in CI/production, allow partial env so deployment builds 
    // can complete before runtime secrets are injected by Vercel
    if (isBuildPhase) {
      console.warn('[env] Build phase detected: allowing partial environment variables for deployment');
      return env as Env;
    }

    // In production runtime (after build), fail fast
    if (nodeEnv === 'production' && !isNextBuild) {
      console.error('[env] Production runtime validation failed:', parsed.error.flatten());
      throw new Error('Invalid environment variables in production. Required vars: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, AUTH_CALLBACK_URL, NEXT_PUBLIC_SITE_URL');
    }

    // In development, warn but allow partial env
    if (nodeEnv !== 'production') {
      console.warn('[env] Development environment: Some environment variables are not set. This may cause runtime errors.');
      console.warn('[env] Missing/invalid:', 
        Object.keys(parsed.error.flatten().fieldErrors)
          .map(key => `${key}`)
          .join(', ')
      );
    }

    // Return partial object for build/dev phases
    return env as Env;
  }
  return parsed.data;
}
