import { defineConfig } from "drizzle-kit";

// Accept DATABASE_URL or the Vercel Supabase integration's POSTGRES_URL fallback.
const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_URL_NON_POOLING;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL (or POSTGRES_URL) is required to run drizzle commands"
  );
}

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString,
  },
});
