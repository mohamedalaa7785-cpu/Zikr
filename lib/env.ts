// ─── Numbered-suffix env var resolution ──────────────────────────────────────
// Vercel integrations expose vars as NAME_19, NAME_22, etc. when multiple
// projects share the same account. We resolve them here so the rest of the
// app always sees bare names.
// Priority: bare name → _19 suffix → _20 suffix → _22 suffix

function r(...keys: Array<string | undefined>): string | undefined {
  return keys.find(v => v !== undefined && v !== "");
}

function appAuthCallbackUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;

  try {
    const url = new URL(value);
    if (
      url.hostname.endsWith(".supabase.co") &&
      url.pathname === "/auth/v1/callback"
    ) {
      return undefined;
    }
  } catch {
    return value;
  }

  return value;
}

const e = process.env;

const rawEnv: Record<string, string | undefined> = {
  ...e,

  // ── PostgreSQL / Database ──────────────────────────────────────────────────
  POSTGRES_URL: r(
    e.POSTGRES_URL,
    e.POSTGRES_URL_19,
    e.POSTGRES_URL_20,
    e.POSTGRES_URL_22
  ),
  POSTGRES_PRISMA_URL: r(
    e.POSTGRES_PRISMA_URL,
    e.POSTGRES_PRISMA_URL_19,
    e.POSTGRES_PRISMA_URL_20,
    e.POSTGRES_PRISMA_URL_22
  ),
  POSTGRES_URL_NON_POOLING: r(
    e.POSTGRES_URL_NON_POOLING,
    e.POSTGRES_URL_NON_POOLING_19,
    e.POSTGRES_URL_NON_POOLING_20,
    e.POSTGRES_URL_NON_POOLING_22
  ),
  POSTGRES_USER: r(
    e.POSTGRES_USER,
    e.POSTGRES_USER_19,
    e.POSTGRES_USER_20,
    e.POSTGRES_USER_22
  ),
  POSTGRES_HOST: r(
    e.POSTGRES_HOST,
    e.POSTGRES_HOST_19,
    e.POSTGRES_HOST_20,
    e.POSTGRES_HOST_22
  ),
  POSTGRES_PASSWORD: r(
    e.POSTGRES_PASSWORD,
    e.POSTGRES_PASSWORD_19,
    e.POSTGRES_PASSWORD_20,
    e.POSTGRES_PASSWORD_22
  ),
  POSTGRES_DATABASE: r(
    e.POSTGRES_DATABASE,
    e.POSTGRES_DATABASE_19,
    // fallback to user name (common in Supabase)
    e.POSTGRES_USER_19,
    e.POSTGRES_USER_20,
    e.POSTGRES_USER_22
  ),

  // ── DATABASE_URL ──────────────────────────────────────────────────────────
  DATABASE_URL: r(
    e.DATABASE_URL,
    e.POSTGRES_URL,
    e.POSTGRES_URL_19,
    e.POSTGRES_URL_20,
    e.POSTGRES_URL_22,
    e.POSTGRES_URL_NON_POOLING,
    e.POSTGRES_URL_NON_POOLING_19,
    e.POSTGRES_URL_NON_POOLING_20,
    e.POSTGRES_URL_NON_POOLING_22,
    e.POSTGRES_PRISMA_URL,
    e.POSTGRES_PRISMA_URL_19,
    e.POSTGRES_PRISMA_URL_20,
    e.POSTGRES_PRISMA_URL_22
  ),

  // ── Supabase ──────────────────────────────────────────────────────────────
  NEXT_PUBLIC_SUPABASE_URL: r(
    e.NEXT_PUBLIC_SUPABASE_URL,
    e.SUPABASE_URL,
    e.SUPABASE_URL_19,
    e.SUPABASE_URL_20,
    e.SUPABASE_URL_22
  ),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: r(
    e.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    e.SUPABASE_ANON_KEY,
    e.SUPABASE_ANON_KEY_19,
    e.SUPABASE_ANON_KEY_20,
    e.SUPABASE_ANON_KEY_22,
    e.SUPABASE_PUBLISHABLE_KEY,
    e.SUPABASE_PUBLISHABLE_KEY_19,
    e.SUPABASE_PUBLISHABLE_KEY_20,
    e.SUPABASE_PUBLISHABLE_KEY_22
  ),
  SUPABASE_URL: r(
    e.SUPABASE_URL,
    e.SUPABASE_URL_19,
    e.SUPABASE_URL_20,
    e.SUPABASE_URL_22
  ),
  SUPABASE_ANON_KEY: r(
    e.SUPABASE_ANON_KEY,
    e.SUPABASE_ANON_KEY_19,
    e.SUPABASE_ANON_KEY_20,
    e.SUPABASE_ANON_KEY_22,
    e.SUPABASE_PUBLISHABLE_KEY_19,
    e.SUPABASE_PUBLISHABLE_KEY_20,
    e.SUPABASE_PUBLISHABLE_KEY_22
  ),
  SUPABASE_SERVICE_ROLE_KEY: r(
    e.SUPABASE_SERVICE_ROLE_KEY,
    e.SUPABASE_SERVICE_ROLE_KEY_19,
    e.SUPABASE_SERVICE_ROLE_KEY_20,
    e.SUPABASE_SERVICE_ROLE_KEY_22,
    e.SUPABASE_SECRET_KEY,
    e.SUPABASE_SECRET_KEY_19,
    e.SUPABASE_SECRET_KEY_20,
    e.SUPABASE_SECRET_KEY_22
  ),
  SUPABASE_JWT_SECRET: r(
    e.SUPABASE_JWT_SECRET,
    e.SUPABASE_JWT_SECRET_19,
    e.SUPABASE_JWT_SECRET_20,
    e.SUPABASE_JWT_SECRET_22
  ),
  SUPABASE_SECRET_KEY: r(
    e.SUPABASE_SECRET_KEY,
    e.SUPABASE_SECRET_KEY_19,
    e.SUPABASE_SECRET_KEY_20,
    e.SUPABASE_SECRET_KEY_22
  ),
  SUPABASE_PUBLISHABLE_KEY: r(
    e.SUPABASE_PUBLISHABLE_KEY,
    e.SUPABASE_PUBLISHABLE_KEY_19,
    e.SUPABASE_PUBLISHABLE_KEY_20,
    e.SUPABASE_PUBLISHABLE_KEY_22
  ),

  // ── Site / Auth ───────────────────────────────────────────────────────────
  // NEXT_PUBLIC_SITE_URL: use the known production URL when the env var is empty
  NEXT_PUBLIC_SITE_URL: r(
    e.NEXT_PUBLIC_SITE_URL,
    e.NEXT_PUBLIC_SITE_URL_19,
    "https://zikrmediaofficial.vercel.app"
  ),
  // AUTH_CALLBACK_URL should point to our app's /auth/callback, not Supabase's
  AUTH_CALLBACK_URL: r(
    appAuthCallbackUrl(e.AUTH_CALLBACK_URL),
    appAuthCallbackUrl(e.AUTH_CALLBACK_URL_19),
    `${r(e.NEXT_PUBLIC_SITE_URL, "https://zikrmediaofficial.vercel.app")}/auth/callback`
  ),

  // ── Google OAuth ──────────────────────────────────────────────────────────
  GOOGLE_CLIENT_ID: r(e.GOOGLE_CLIENT_ID, e.GOOGLE_CLIENT_ID_19),
  GOOGLE_CLIENT_SECRET: r(e.GOOGLE_CLIENT_SECRET, e.GOOGLE_CLIENT_SECRET_19),
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: r(
    e.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    e.GOOGLE_CLIENT_ID,
    e.GOOGLE_CLIENT_ID_19
  ),

  // ── YouTube ───────────────────────────────────────────────────────────────
  YOUTUBE_API_KEY: r(
    e.YOUTUBE_API_KEY,
    e.YOUTUBE_API_KEY_22,
    e.YOUTUBE_API_KEY_20,
    e.YOUTUBE_API_KEY_19
  ),
  YOUTUBE_CHANNEL_ID: r(
    e.YOUTUBE_CHANNEL_ID,
    e.YOUTUBE_CHANNEL_ID_22,
    e.YOUTUBE_CHANNEL_ID_20,
    e.YOUTUBE_CHANNEL_ID_19
  ),
  YOUTUBE_REFRESH_TOKEN: r(e.YOUTUBE_REFRESH_TOKEN, e.YOUTUBE_REFRESH_TOKEN_19),

  // ── Gemini AI ─────────────────────────────────────────────────────────────
  GEMINI_API_KEY: r(e.GEMINI_API_KEY, e.GEMINI_API_KEY_19),
  GEMINI_MODEL: r(e.GEMINI_MODEL, e.GEMINI_MODEL_19, "gemini-2.5-flash"),

  // ── Quran / Islamic content APIs ──────────────────────────────────────────
  QURAN_API_BASE_URL: r(
    e.QURAN_API_BASE_URL,
    e.QURAN_API_BASE_URL_19,
    e.NEXT_PUBLIC_QURAN_API
  ),
  QURAN_AUDIO_CDN_URL: r(
    e.QURAN_AUDIO_CDN_URL,
    e.QURAN_AUDIO_CDN_URL_19,
    "https://cdn.islamic.network/quran/audio"
  ),
  HADITH_API_BASE_URL: r(
    e.HADITH_API_BASE_URL,
    e.HADITH_API_BASE_URL_19,
    e.NEXT_PUBLIC_HADITH_API
  ),
  NEXT_PUBLIC_QURAN_API: r(
    e.NEXT_PUBLIC_QURAN_API,
    e.QURAN_API_BASE_URL_19,
    e.QURAN_API_BASE_URL,
    "https://api.alquran.cloud/v1"
  ),
  NEXT_PUBLIC_HADITH_API: r(
    e.NEXT_PUBLIC_HADITH_API,
    e.HADITH_API_BASE_URL_19,
    e.HADITH_API_BASE_URL,
    "https://hadithapi.com/api"
  ),

  // ── AWS S3 ───────────────────────────────────────────────────────────────
  AWS_S3_ACCESS_KEY_ID: r(
    e.AWS_S3_ACCESS_KEY_ID,
    e.AWS_ACCESS_KEY_ID,
    e.AWS_S3_ACCESS_KEY_ID_19
  ),
  AWS_S3_SECRET_ACCESS_KEY: r(
    e.AWS_S3_SECRET_ACCESS_KEY,
    e.AWS_SECRET_ACCESS_KEY,
    e.AWS_S3_SECRET_ACCESS_KEY_19
  ),
  AWS_S3_BUCKET_NAME: r(e.AWS_S3_BUCKET_NAME, e.AWS_S3_BUCKET_NAME_19),
  AWS_S3_REGION: r(e.AWS_S3_REGION, e.AWS_REGION, e.AWS_S3_REGION_19),
  AWS_S3_PUBLIC_BASE_URL: r(
    e.AWS_S3_PUBLIC_BASE_URL,
    e.AWS_S3_PUBLIC_BASE_URL_19
  ),

  // ── Facebook ──────────────────────────────────────────────────────────────
  FACEBOOK_APP_ID: r(e.FACEBOOK_APP_ID, "1547748713614342"),
  FACEBOOK_APP_SECRET: r(e.FACEBOOK_APP_SECRET, e.FACEBOOK_APP_SECRET_19),
  FACEBOOK_PAGE_ACCESS_TOKEN: r(
    e.FACEBOOK_PAGE_ACCESS_TOKEN,
    e.FACEBOOK_PAGE_ACCESS_TOKEN_19
  ),
  FACEBOOK_PAGE_ID: r(e.FACEBOOK_PAGE_ID, "993431613855177"),
};

const validatedEnv = rawEnv;

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
    QURAN_API_BASE_URL:
      validatedEnv.QURAN_API_BASE_URL || "https://api.alquran.cloud/v1",
    QURAN_AUDIO_CDN_URL:
      validatedEnv.QURAN_AUDIO_CDN_URL ||
      "https://cdn.islamic.network/quran/audio",
    HADITH_API_BASE_URL:
      validatedEnv.HADITH_API_BASE_URL || "https://hadithapi.com/api",
    YOUTUBE_API_KEY: validatedEnv.YOUTUBE_API_KEY || "",
    YOUTUBE_CHANNEL_ID: validatedEnv.YOUTUBE_CHANNEL_ID || "",
    YOUTUBE_REFRESH_TOKEN: validatedEnv.YOUTUBE_REFRESH_TOKEN || "",
    GOOGLE_CLIENT_ID: validatedEnv.GOOGLE_CLIENT_ID || "",
    GOOGLE_CLIENT_SECRET: validatedEnv.GOOGLE_CLIENT_SECRET || "",
    AWS_S3_ACCESS_KEY_ID: validatedEnv.AWS_S3_ACCESS_KEY_ID || "",
    AWS_S3_SECRET_ACCESS_KEY: validatedEnv.AWS_S3_SECRET_ACCESS_KEY || "",
    AWS_S3_BUCKET_NAME: validatedEnv.AWS_S3_BUCKET_NAME || "",
    AWS_S3_REGION: validatedEnv.AWS_S3_REGION || "",
    AWS_S3_PUBLIC_BASE_URL: validatedEnv.AWS_S3_PUBLIC_BASE_URL || "",
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
      "AWS_S3_ACCESS_KEY_ID",
      "AWS_S3_SECRET_ACCESS_KEY",
    ],
    runtimeServer: [
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "NEXT_PUBLIC_SITE_URL",
      "SUPABASE_SERVICE_ROLE_KEY",
      "DATABASE_URL",
      "AUTH_CALLBACK_URL",
      "GEMINI_API_KEY",
      "GEMINI_MODEL",
      "YOUTUBE_API_KEY",
      "YOUTUBE_CHANNEL_ID",
      "YOUTUBE_REFRESH_TOKEN",
      "GOOGLE_CLIENT_ID",
      "GOOGLE_CLIENT_SECRET",
      "AWS_S3_ACCESS_KEY_ID",
      "AWS_S3_SECRET_ACCESS_KEY",
      "AWS_S3_BUCKET_NAME",
      "AWS_S3_REGION",
      "AWS_S3_PUBLIC_BASE_URL",
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
      "AWS_S3_ACCESS_KEY_ID",
      "AWS_S3_SECRET_ACCESS_KEY",
      "AWS_S3_BUCKET_NAME",
      "AWS_S3_REGION",
      "AWS_S3_PUBLIC_BASE_URL",
      "FACEBOOK_APP_ID",
      "FACEBOOK_APP_SECRET",
      "FACEBOOK_PAGE_ACCESS_TOKEN",
      "FACEBOOK_PAGE_ID",
    ],
  } as const;
}
