import { defineConfig } from "drizzle-kit";

function resolveEnv(name: string): string | undefined {
  return (
    process.env[name] ||
    process.env[`${name}_19`] ||
    process.env[`${name}_20`] ||
    process.env[`${name}_22`]
  );
}

// For Supabase + Drizzle migrations, use the non-pooling (direct) connection URL.
// Supabase's Vercel integration may expose numbered env vars when multiple
// projects are linked to the same account, so keep this resolver aligned with
// lib/env.ts and scripts/validate-deployment-env.mjs.
const connectionString =
  resolveEnv("POSTGRES_URL_NON_POOLING") ||
  resolveEnv("DATABASE_URL") ||
  resolveEnv("POSTGRES_URL") ||
  resolveEnv("POSTGRES_PRISMA_URL");

if (!connectionString) {
  throw new Error(
    "A database connection URL is required. Set POSTGRES_URL_NON_POOLING (or DATABASE_URL / POSTGRES_URL)."
  );
}

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString,
  },
});
