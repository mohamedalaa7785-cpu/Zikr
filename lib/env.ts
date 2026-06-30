import { envSchema, validateEnv } from "./env-validation";

// Vercel Supabase integration exposes POSTGRES_URL but the app expects DATABASE_URL.
// Fall back transparently so drizzle-kit and server actions both work.
const rawEnv: Record<string, string | undefined> = {
  ...process.env,
  DATABASE_URL: process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING,
};

const validatedEnv = validateEnv(rawEnv);

export function getPublicEnv() {
  return {
    NEXT_PUBLIC_SUPABASE_URL: validatedEnv.NEXT_PUBLIC_SUPABASE_URL || '',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: validatedEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    NEXT_PUBLIC_SITE_URL: validatedEnv.NEXT_PUBLIC_SITE_URL || '',
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: validatedEnv.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
  };
}

export function getServerEnv() {
  return {
    ...getPublicEnv(),
    SUPABASE_SERVICE_ROLE_KEY: validatedEnv.SUPABASE_SERVICE_ROLE_KEY || '',
    DATABASE_URL: validatedEnv.DATABASE_URL || '',
    AUTH_CALLBACK_URL: validatedEnv.AUTH_CALLBACK_URL || '',
    GEMINI_API_KEY: validatedEnv.GEMINI_API_KEY || '',
    GEMINI_MODEL: validatedEnv.GEMINI_MODEL || 'gemini-2.5-flash',
    AWS_S3_ACCESS_KEY_ID: validatedEnv.AWS_S3_ACCESS_KEY_ID || '',
    AWS_S3_SECRET_ACCESS_KEY: validatedEnv.AWS_S3_SECRET_ACCESS_KEY || '',
    AWS_S3_BUCKET_NAME: validatedEnv.AWS_S3_BUCKET_NAME || '',
    AWS_S3_REGION: validatedEnv.AWS_S3_REGION || '',
    QURAN_API_BASE_URL: validatedEnv.QURAN_API_BASE_URL || '',
    QURAN_AUDIO_CDN_URL: validatedEnv.QURAN_AUDIO_CDN_URL || '',
    HADITH_API_BASE_URL: validatedEnv.HADITH_API_BASE_URL || '',
    YOUTUBE_API_KEY: validatedEnv.YOUTUBE_API_KEY || '',
    YOUTUBE_CHANNEL_ID: validatedEnv.YOUTUBE_CHANNEL_ID || '',
    YOUTUBE_PLAYLIST_ID: validatedEnv.YOUTUBE_PLAYLIST_ID || '',
    GOOGLE_CLIENT_ID: validatedEnv.GOOGLE_CLIENT_ID || '',
    GOOGLE_CLIENT_SECRET: validatedEnv.GOOGLE_CLIENT_SECRET || '',
  };
}

export function getScriptEnv() {
  return {
    DATABASE_URL: validatedEnv.DATABASE_URL,
  };
}

export function getEnvAudit() {
  return {
    public: [
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "NEXT_PUBLIC_SITE_URL",
      "NEXT_PUBLIC_GOOGLE_CLIENT_ID",
    ],
    serverOnly: ["SUPABASE_SERVICE_ROLE_KEY", "GOOGLE_CLIENT_SECRET"],
    runtimeServer: [
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "NEXT_PUBLIC_SITE_URL",
      "SUPABASE_SERVICE_ROLE_KEY",
      "DATABASE_URL",
      "AUTH_CALLBACK_URL",
      "GEMINI_API_KEY",
      "GEMINI_MODEL",
      "AWS_S3_ACCESS_KEY_ID",
      "AWS_S3_SECRET_ACCESS_KEY",
      "AWS_S3_BUCKET_NAME",
      "AWS_S3_REGION",
      "GOOGLE_CLIENT_ID",
      "GOOGLE_CLIENT_SECRET",
    ],
    scriptsOnly: ["DATABASE_URL"],
    optionalIntegrations: [
      "QURAN_API_BASE_URL",
      "QURAN_AUDIO_CDN_URL",
      "HADITH_API_BASE_URL",
      "YOUTUBE_API_KEY",
      "YOUTUBE_CHANNEL_ID",
      "YOUTUBE_PLAYLIST_ID",
      "GEMINI_API_KEY",
      "GEMINI_MODEL",
      "AWS_S3_ACCESS_KEY_ID",
      "AWS_S3_SECRET_ACCESS_KEY",
      "AWS_S3_BUCKET_NAME",
      "AWS_S3_REGION",
      "GOOGLE_CLIENT_ID",
      "GOOGLE_CLIENT_SECRET",
    ],
  } as const;
}
