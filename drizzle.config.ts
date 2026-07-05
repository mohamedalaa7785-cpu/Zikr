import { defineConfig } from 'drizzle-kit';

// For Supabase + Drizzle migrations, use the non-pooling (direct) connection URL.
// Supabase's Vercel integration exposes POSTGRES_URL_NON_POOLING for this purpose.
const connectionString =
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error(
    'A database connection URL is required. Set POSTGRES_URL_NON_POOLING (or DATABASE_URL / POSTGRES_URL).'
  );
}

export default defineConfig({
  schema: './drizzle/schema.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: connectionString,
  },
});
