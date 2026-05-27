import { envSchema, validateEnv } from "./env-validation";

const validatedEnv = validateEnv(process.env);

export function getPublicEnv() {
  return {
    NEXT_PUBLIC_SUPABASE_URL: validatedEnv.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: validatedEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SITE_URL: validatedEnv.NEXT_PUBLIC_SITE_URL,
  };
}

export function getServerEnv() {
  return {
    ...getPublicEnv(),
    SUPABASE_SERVICE_ROLE_KEY: validatedEnv.SUPABASE_SERVICE_ROLE_KEY,
    DATABASE_URL: validatedEnv.DATABASE_URL,
    AUTH_CALLBACK_URL: validatedEnv.AUTH_CALLBACK_URL,
    GEMINI_API_KEY: validatedEnv.GEMINI_API_KEY,
    GEMINI_MODEL: validatedEnv.GEMINI_MODEL,
    AWS_S3_ACCESS_KEY_ID: validatedEnv.AWS_S3_ACCESS_KEY_ID,
    AWS_S3_SECRET_ACCESS_KEY: validatedEnv.AWS_S3_SECRET_ACCESS_KEY,
    AWS_S3_BUCKET_NAME: validatedEnv.AWS_S3_BUCKET_NAME,
    AWS_S3_REGION: validatedEnv.AWS_S3_REGION,
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
    ],
    serverOnly: ["SUPABASE_SERVICE_ROLE_KEY"],
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
    ],
  } as const;
}
