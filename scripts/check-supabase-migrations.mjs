import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(new URL("..", import.meta.url).pathname);
const migrationsDir = join(root, "supabase", "migrations");
const archiveDir = join(root, "supabase", "migrations_archive");
const files = readdirSync(migrationsDir).filter((file) => file.endsWith(".sql")).sort();
const errors = [];
const versions = new Map();

if (files.length === 0) errors.push("supabase/migrations is empty");

for (const file of files) {
  const match = /^(\d+)_/.exec(file);
  if (!match) errors.push(`${file}: migration filename must start with a numeric version`);
  else if (versions.has(match[1])) errors.push(`duplicate migration version ${match[1]}: ${versions.get(match[1])}, ${file}`);
  else versions.set(match[1], file);

  const path = join(migrationsDir, file);
  if (statSync(path).size === 0) errors.push(`${file}: migration is empty`);
  const sql = readFileSync(path, "utf8");
  if (/SUPABASE_SERVICE_ROLE_KEY|service_role_secret/i.test(sql) && !/CREATE ROLE service_role/i.test(sql)) {
    errors.push(`${file}: service-role secret must not be stored in SQL`);
  }
}

const forbiddenLegacyReplays = [
  "20260705070523_initial_schema",
  "20260705070652_rls_triggers_storage",
];
if (files.some((file) => forbiddenLegacyReplays.some((legacyName) => file.includes(legacyName)))) {
  errors.push("legacy duplicate initial/RLS migrations must remain in migrations_archive only; use no-op remote history placeholders instead");
}

const remoteHistoryPlaceholders = [
  "20240705000001_remote_history_placeholder.sql",
  "20240705000002_remote_history_placeholder.sql",
  "20240705000003_remote_history_placeholder.sql",
  "20250705000001_remote_history_placeholder.sql",
  "20250705000002_remote_history_placeholder.sql",
  "20260705070523_remote_history_placeholder.sql",
  "20260705070652_remote_history_placeholder.sql",
];
for (const placeholder of remoteHistoryPlaceholders) {
  if (!files.includes(placeholder)) {
    errors.push(`${placeholder}: required so Supabase Preview can match linked-project migration history`);
  }
}

if (!statSync(archiveDir).isDirectory()) errors.push("supabase/migrations_archive is missing");

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(`Supabase migration check passed: ${files.length} canonical migrations, no duplicate versions.`);
