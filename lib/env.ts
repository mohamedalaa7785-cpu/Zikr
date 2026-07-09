import { envSchema, validateEnv } from "./env-validation";

// Vercel Supabase integration exposes POSTGRES_URL but the app expects DATABASE_URL.
// Fall back transparently so drizzle-kit and server actions both work.
const rawEnv: Record<string, string | undefined> = {
  ...process.env,
  DATABASE_URL:
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.POSTGRES_PRISMA_URL,
  NEXT_PUBLIC_SUPABASE_URL:
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY,
  // Support numbered suffixed env vars (e.g. YOUTUBE_API_KEY_20) as fallback
  YOUTUBE_API_KEY:
    process.env.YOUTUBE_API_KEY ||
    process.env.YOUTUBE_API_KEY_20,
  YOUTUBE_CHANNEL_ID:
    process.env.YOUTUBE_CHANNEL_ID ||
    process.env.YOUTUBE_CHANNEL_ID_20,
};

const validatedEnv = validateEnv(rawEnv);

export function getPublicEnv() {
  return {
    NEXT_PUBLIC_SUPABASE_URL: validatedEnv.NEXT_PUBLIC_SUPABASE_URL || "",
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      validatedEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    NEXT_PUBLIC_SITE_URL: validatedEnv.NEXT_PUBLIC_SITE_URL || "",
    NEXT_PUBLIC_GOOGLE_CLIENT_ID:
      validatedEnv.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
  };
}

export function getServerEnv() {
  return {
    ...getPublicEnv(),
    SUPABASE_SERVICE_ROLE_KEY: validatedEnv.SUPABASE_SERVICE_ROLE_KEY || "",
    DATABASE_URL: validatedEnv.DATABASE_URL || "",
    AUTH_CALLBACK_URL: validatedEnv.AUTH_CALLBACK_URL || "",
    GEMINI_API_KEY: validatedEnv.GEMINI_API_KEY || "",
    GEMINI_MODEL: validatedEnv.GEMINI_MODEL || "gemini-2.5-flash",
    QURAN_API_BASE_URL: validatedEnv.QURAN_API_BASE_URL || "",
    QURAN_AUDIO_CDN_URL: validatedEnv.QURAN_AUDIO_CDN_URL || "",
    HADITH_API_BASE_URL: validatedEnv.HADITH_API_BASE_URL || "",
    YOUTUBE_API_KEY: validatedEnv.YOUTUBE_API_KEY || "",
    YOUTUBE_CHANNEL_ID: validatedEnv.YOUTUBE_CHANNEL_ID || "",
    YOUTUBE_REFRESH_TOKEN: validatedEnv.YOUTUBE_REFRESH_TOKEN || "",
    GOOGLE_CLIENT_ID: validatedEnv.GOOGLE_CLIENT_ID || "",
    GOOGLE_CLIENT_SECRET: validatedEnv.GOOGLE_CLIENT_SECRET || "",
    FACEBOOK_APP_ID: validatedEnv.FACEBOOK_APP_ID || "",
    FACEBOOK_APP_SECRET: validatedEnv.FACEBOOK_APP_SECRET || "",
    FACEBOOK_PAGE_ACCESS_TOKEN: validatedEnv.FACEBOOK_PAGE_ACCESS_TOKEN || "",
    FACEBOOK_PAGE_ID: validatedEnv.FACEBOOK_PAGE_ID || "",
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
    serverOnly: [
      "SUPABASE_SERVICE_ROLE_KEY",
      "SUPABASE_SECRET_KEY",
      "GOOGLE_CLIENT_SECRET",
    ],
    runtimeServer: [
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "NEXT_PUBLIC_SITE_URL",
      "SUPABASE_SERVICE_ROLE_KEY",
      "DATABASE_URL",
      "POSTGRES_URL",
      "POSTGRES_URL_NON_POOLING",
      "POSTGRES_PRISMA_URL",
      "AUTH_CALLBACK_URL",
      "GEMINI_API_KEY",
      "GEMINI_MODEL",
      "YOUTUBE_API_KEY",
      "YOUTUBE_REFRESH_TOKEN",
      "GOOGLE_CLIENT_ID",
      "GOOGLE_CLIENT_SECRET",
      "FACEBOOK_APP_ID",
      "FACEBOOK_APP_SECRET",
      "FACEBOOK_PAGE_ACCESS_TOKEN",
      "FACEBOOK_PAGE_ID",
    ],
    scriptsOnly: ["DATABASE_URL"],
    optionalIntegrations: [
      "QURAN_API_BASE_URL",
      "QURAN_AUDIO_CDN_URL",
      "HADITH_API_BASE_URL",
      "YOUTUBE_API_KEY",
      "YOUTUBE_CHANNEL_ID",
      "YOUTUBE_REFRESH_TOKEN",
      "GEMINI_API_KEY",
      "GEMINI_MODEL",
      "GOOGLE_CLIENT_ID",
      "GOOGLE_CLIENT_SECRET",
      "FACEBOOK_APP_ID",
      "FACEBOOK_APP_SECRET",
      "FACEBOOK_PAGE_ACCESS_TOKEN",
      "FACEBOOK_PAGE_ID",
    ],
  } as const;
}
