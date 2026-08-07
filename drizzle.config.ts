import { defineConfig } from "drizzle-kit";

function resolveEnv(name: string): string | undefined {
  const suffixes = ["", "_2", "_3", "_19", "_20", "_22"];
  for (const suffix of suffixes) {
    const value = process.env[`${name}${suffix}`];
    if (value) return value;
  }
  return undefined;
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
