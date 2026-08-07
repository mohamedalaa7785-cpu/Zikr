// Validates the full Supabase migration chain against an in-memory Postgres
// (PGlite) with Supabase auth/storage schemas stubbed. Catches ordering bugs
// like "column searchable does not exist" before they hit production.
//
// Usage: node scripts/validate-migrations.mjs
// Requires: npm install @electric-sql/pglite (dev-only, any scratch dir works
// via NODE_PATH; CI installs it ad hoc).
import { PGlite } from '@electric-sql/pglite';
import { pg_trgm } from '@electric-sql/pglite/contrib/pg_trgm';
import { uuid_ossp } from '@electric-sql/pglite/contrib/uuid_ossp';
import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MIG_DIR = join(ROOT, 'supabase', 'migrations');

const db = new PGlite({ extensions: { pg_trgm, uuid_ossp } });

// ---- Supabase environment stubs (auth, storage, roles) ----
const stubs = `
CREATE SCHEMA IF NOT EXISTS auth;
CREATE TABLE IF NOT EXISTS auth.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text,
  raw_user_meta_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);
CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS
  $$ SELECT NULL::uuid $$;
CREATE OR REPLACE FUNCTION auth.role() RETURNS text LANGUAGE sql STABLE AS
  $$ SELECT 'authenticated'::text $$;
CREATE OR REPLACE FUNCTION auth.jwt() RETURNS jsonb LANGUAGE sql STABLE AS
  $$ SELECT '{}'::jsonb $$;

CREATE SCHEMA IF NOT EXISTS storage;
CREATE TABLE IF NOT EXISTS storage.buckets (
  id text PRIMARY KEY,
  name text NOT NULL,
  public boolean DEFAULT false,
  file_size_limit bigint,
  allowed_mime_types text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS storage.objects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket_id text REFERENCES storage.buckets(id),
  name text,
  owner uuid,
  metadata jsonb,
  path_tokens text[],
  created_at timestamptz DEFAULT now()
);
CREATE OR REPLACE FUNCTION storage.foldername(name text) RETURNS text[] LANGUAGE sql AS
  $$ SELECT string_to_array(name, '/') $$;

DO $do$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN CREATE ROLE authenticated; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN CREATE ROLE anon; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN CREATE ROLE service_role; END IF;
END $do$;
`;

await db.exec(stubs);
console.log('Supabase stubs installed');

// SIMULATE_LEGACY=1 reproduces the production drift that caused
// `column "searchable" does not exist`: content tables pre-existing from the
// legacy schema WITHOUT the generated tsvector column. The migration chain
// must handle this via its ADD COLUMN IF NOT EXISTS guards.
if (process.env.SIMULATE_LEGACY === '1') {
  await db.exec(`
    CREATE TABLE quran_surahs (
      id int PRIMARY KEY, name_ar text NOT NULL, name_en text NOT NULL,
      ayah_count int NOT NULL, revelation_place text NOT NULL,
      "order" int NOT NULL, slug text UNIQUE NOT NULL
    );
    CREATE TABLE quran_ayahs (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      surah_id int NOT NULL REFERENCES quran_surahs(id) ON DELETE CASCADE,
      ayah_number int NOT NULL, text_uthmani text NOT NULL, text_simple text NOT NULL,
      page int, juz int, hizb int, rub int, sajda boolean DEFAULT false,
      UNIQUE(surah_id, ayah_number)
    );
    CREATE TABLE hadith_books (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), slug text UNIQUE NOT NULL,
      name_ar text NOT NULL, name_en text, source text NOT NULL
    );
    CREATE TABLE hadiths (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      book_id uuid NOT NULL REFERENCES hadith_books(id) ON DELETE CASCADE,
      hadith_number text NOT NULL, text_ar text NOT NULL,
      narrator text, grade text, chapter text, ref text,
      UNIQUE(book_id, hadith_number)
    );
  `);
  console.log('Legacy drift simulated: quran_ayahs/hadiths WITHOUT searchable');
}

const files = readdirSync(MIG_DIR).filter((f) => f.endsWith('.sql')).sort();
const versions = new Map();
for (const file of files) {
  const match = /^(\\d+)_/.exec(file);
  if (match && versions.has(match[1])) {
    throw new Error(`Duplicate migration version ${match[1]}: ${versions.get(match[1])} and ${file}`);
  }
  if (match) versions.set(match[1], file);
}
if (files.length === 0) throw new Error(`No migrations found in ${MIG_DIR}`);
console.log('Applying', files.length, 'migrations in order');

let failed = 0;
for (const f of files) {
  // pgcrypto is not shipped with PGlite, but gen_random_uuid() is built in.
  const sql = readFileSync(join(MIG_DIR, f), 'utf8')
    .replace(/create extension if not exists "?pgcrypto"?;?/gi, '');
  try {
    await db.exec(sql);
    console.log('OK  ', f);
  } catch (e) {
    failed++;
    console.log('FAIL', f);
    console.log('     ', e.message.split('\n')[0]);
  }
}

// ---- Verify FTS objects exist ----
const res = await db.query(`
  SELECT c.relname AS index, t.relname AS table
  FROM pg_index i
  JOIN pg_class c ON c.oid = i.indexrelid
  JOIN pg_class t ON t.oid = i.indrelid
  JOIN pg_am am ON am.oid = c.relam
  WHERE am.amname = 'gin' AND t.relname IN ('quran_ayahs','hadiths','duas','articles')
  ORDER BY 2,1
`);
console.log('GIN indexes:', JSON.stringify(res.rows));

const cols = await db.query(`
  SELECT table_name, column_name, is_generated
  FROM information_schema.columns
  WHERE column_name = 'searchable' AND table_schema='public'
  ORDER BY table_name
`);
console.log('searchable columns:', JSON.stringify(cols.rows));

console.log(failed === 0 ? 'ALL_MIGRATIONS_PASSED' : `${failed} MIGRATIONS FAILED`);
process.exit(failed === 0 ? 0 : 1);
