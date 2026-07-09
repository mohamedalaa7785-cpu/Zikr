import { z } from "zod";

export const envSchema = z.object({
  // PostgreSQL Database
  POSTGRES_URL: z.string().optional().or(z.literal("")),
  POSTGRES_PRISMA_URL: z.string().optional().or(z.literal("")),
  POSTGRES_URL_NON_POOLING: z.string().optional().or(z.literal("")),
  POSTGRES_USER: z.string().optional(),
  POSTGRES_HOST: z.string().optional(),
  POSTGRES_PASSWORD: z.string().optional(),
  POSTGRES_DATABASE: z.string().optional(),

  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional().or(z.literal("")),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_URL: z.string().url().optional().or(z.literal("")),
  SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_PUBLISHABLE_KEY: z.string().optional(),
  SUPABASE_SECRET_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  SUPABASE_JWT_SECRET: z.string().optional(),

  // Database
  DATABASE_URL: z.string().optional().or(z.literal("")),

  // Site Configuration
  NEXT_PUBLIC_SITE_URL: z.string().url().optional().or(z.literal("")),
  AUTH_CALLBACK_URL: z.string().url().optional().or(z.literal("")),

  // YouTube Integration
  YOUTUBE_REFRESH_TOKEN: z.string().optional(),
  YOUTUBE_API_KEY: z.string().optional(),
  YOUTUBE_CHANNEL_ID: z.string().optional(),

  // Google OAuth & Services
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_SHEETS_API_KEY: z.string().optional(),
  GOOGLE_TRANSLATE_API_KEY: z.string().optional(),

  // Facebook Integration
  FACEBOOK_APP_ID: z.string().optional(),
  FACEBOOK_APP_SECRET: z.string().optional(),
  FACEBOOK_PAGE_ACCESS_TOKEN: z.string().optional(),
  FACEBOOK_PAGE_ID: z.string().optional(),

  // HeyGen Video Generation
  HEYGEN_API_KEY: z.string().optional(),
  HEYGEN_AVATAR_ID: z.string().optional(),

  // Email Service
  SENDGRID_API_KEY: z.string().optional(),
  SENDGRID_FROM_EMAIL: z.string().optional(),

  // Stripe (Optional Payments)
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  // Quran & Islamic Content APIs
  NEXT_PUBLIC_QURAN_API: z.string().optional(),
  NEXT_PUBLIC_MP3QURAN_API: z.string().url().optional(),
  NEXT_PUBLIC_QURAN_FOUNDATION_API: z.string().url().optional(),
  NEXT_PUBLIC_HADITH_API: z.string().optional(),
  NEXT_PUBLIC_TAFSIR_API: z.string().url().optional(),
  NEXT_PUBLIC_AZKAR_API: z.string().url().optional(),
  HADITH_API_BASE_URL: z.string().optional(),
  QURAN_API_BASE_URL: z.string().optional(),
  QURAN_AUDIO_CDN_URL: z.string().optional(),

  // Gemini AI
  GEMINI_MODEL: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(env: Record<string, string | undefined>): Env {
  const parsed = envSchema.safeParse(env);

  if (!parsed.success) {
    const nodeEnv = process.env.NODE_ENV;
    const missing = Object.keys(parsed.error.flatten().fieldErrors);

    // ALWAYS log errors loudly but NEVER throw at module load time
    // This prevents site-wide blank screens when optional vars are missing
    if (nodeEnv === "production") {
      console.error("[env] Production runtime validation issues found:");
      console.error("[env] Missing/invalid variables:", missing.join(", "));
      console.error(
        "[env] Site will continue to load, but specific features may fail."
      );
    } else {
      console.warn("[env] Environment validation issues:", missing.join(", "));
    }

    // Return the raw env object as Env type to allow partial access
    return env as Env;
  }

  return parsed.data;
}
