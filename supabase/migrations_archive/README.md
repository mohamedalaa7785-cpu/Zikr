# Archived Migrations

These files were removed from `supabase/migrations/` because they are legacy,
conflicting, or superseded. They are kept here for historical reference only.
**Do not apply them.**

## Why each file was archived

| File | Reason |
| --- | --- |
| `20240705000001_create_category_type.sql` | Duplicate version key with `20240705000001_missing_tables.sql` (breaks `supabase db push`). Unguarded `CREATE TYPE` fails on re-run. Superseded by the guarded 2026 chain. |
| `20240705000001_missing_tables.sql` | Duplicate version key (see above). Tables now created by `20260530000000_0000_young_rattler.sql` onward. |
| `20240705000002_seed_content.sql` | Legacy seed superseded by later seed migrations. |
| `20240705000003_fix_duplicate_migration.sql` | Duplicate version key with `20240705000003_seed_stories_articles.sql`. Contains a manual `DELETE FROM supabase_migrations.schema_migrations` hot-patch that must never be replayed. |
| `20240705000003_seed_stories_articles.sql` | Duplicate version key (see above). Superseded by `20260530000600_0006_phase4_scholars_stories.sql`. |
| `20250705000001_initial_schema.sql` | Superseded by `20260705070523_initial_schema.sql` (guarded, idempotent version of the same schema). |
| `20250705000002_rls_triggers_storage.sql` | Superseded by `20260705070652_rls_triggers_storage.sql`. |

## Canonical migration chain

The authoritative schema-changing history is the ordered 2026 chain in
`supabase/migrations/`, starting at `20260530000000_0000_young_rattler.sql`.
The directory also keeps small `*_remote_history_placeholder.sql` no-op files for
legacy versions that are already recorded in the linked Supabase project. These
placeholders prevent Supabase Preview from failing with "Remote migration versions
not found in local migrations directory" while avoiding replay of superseded SQL
on fresh databases.

## If `supabase db push` reports history mismatch

If Supabase Preview reports a remote version missing locally, add a no-op
placeholder with that exact numeric version instead of restoring archived legacy
SQL. Do not run migration repair against production unless you have a verified
backup and explicitly intend to rewrite migration history.
