# ZIKR Full Audit Evidence — 15 Aug 2026

## Repository and GitHub

- Repository: `mohamedalaa7785-cpu/Zikr`, public, default branch `main`.
- Local source inventory: 678 tracked files, 373 TypeScript/TSX files, 121 SQL migrations, 30 API route handlers, and 73 page components.
- Current remote `main`: `14d6bc9a4883cb0e58695e888e08685bdd9122de`.
- CircleCI bot PR #191 merged into `main` on 2026-08-15 10:22:30 UTC. It changes only `.circleci/config.yml`: `corepack enable` → `sudo corepack enable` for the `cimg/node:22.13` image. Current production deployment is from the merge commit and is READY.
- GitHub Actions permissions: enabled, allowed actions `all`, SHA pinning not required.
- `main` has no branch protection (GitHub REST returned `Branch not protected`, 404).
- Repository security state before repair: secret scanning enabled, push protection enabled, Dependabot security updates disabled. Vulnerability alerts and automated Dependabot security fixes were then enabled successfully through GitHub API. A new `.github/dependabot.yml` was added locally but had not yet been committed at the time this evidence was written.
- GitHub-hosted workflows remain manual-only because previous runs failed at runner startup under the account billing lock. Vercel and CircleCI provide CI verification; Supabase provides production scheduling.

## Supabase project

Project: `Zikr`, ref `eydxvcamhjhajxjrsgym`, region `eu-west-1`, PostgreSQL 17.6.1, status `ACTIVE_HEALTHY`.

- Supabase migration history contains 121 applied versions, including archived legacy markers and the current August 2026 migrations. Repository also contains 121 migration files.
- Deployed Edge Functions: `health` ACTIVE v7 (`verify_jwt=false`), `spiritual-ai` ACTIVE v7 (`verify_jwt=true`), and `prayer-notification-worker` ACTIVE v37 (`verify_jwt=false`). The latter is intentionally scheduler-authenticated by a secret rather than JWT.
- pg_cron has two active jobs, both `* * * * *`, and recent runs for both jobs succeeded once per minute. Job 1 calls the prayer notification worker through `net.http_post`; job 2 calls `https://zikrmediaofficial.vercel.app/api/internal/video-processing` with the scheduler secret.
- Supabase security advisors returned two WARN findings: `pg_net` is installed in the `public` schema, and leaked password protection is disabled in Auth.
- Supabase performance advisors returned many INFO findings for unused indexes. These are candidates for later removal only after workload validation; no destructive index removal has been applied.
- PostgREST logs show repeated `Warp server error: Thread killed by timeout manager` messages throughout 2026-08-15, often at one-minute intervals. The available metadata exposes only system/project identifiers, not request paths, so the responsible request still needs correlation with Vercel/Supabase request logs before changing cron or API code.
- RLS policies are enabled across the audited public tables. Most user-owned tables enforce `auth.uid() = user_id`; published content tables are publicly readable with `published` predicates; admin writes use `private.is_admin_user()`. Duplicate/overlapping owner policies exist on several tables, including `reading_progress`, `recent_recitations`, `reciter_favorites`, `reminders`, `tawasheeh_favorites`, and `tawasheeh_playlists`, and should be normalized carefully rather than removed blindly.
- `public.prayer_times_cache` has a public SELECT policy and an authenticated `ALL` policy with `qual=true`; this is a potential write-integrity concern because authenticated users may be able to modify shared cache rows. It requires a dedicated non-destructive RLS reproduction before repair.
- Generated database types include `battles.date_gregorian` as nullable; the production error was therefore an application-side dereference of an absent record, not evidence that the column is missing.

## Vercel project

- Project: `zikr`, id `prj_3J0vdLIhoMucvZ8o1IZ1yXIRYHCi`, team `team_n5mrLz3A1fUncMocWuhYc2er`, Next.js, Node `24.x`.
- Domains: `zikrmediaofficial.vercel.app`, `zikr-zikr.vercel.app`, and `zikr-git-main-zikr.vercel.app`.
- Latest production deployment: `dpl_CijyKzzY7i1VCZQbf5pwtsrcxZLt`, READY, from GitHub `main` commit `14d6bc9`, with verified GitHub commit metadata. No error/fatal runtime logs were found for this current deployment in the most recent 24-hour query.
- Project deployment protection: password protection disabled, trusted IP protection disabled, Vercel SSO protection enabled for all except custom domains. The production custom domain remains publicly reachable.
- Aggregated Vercel runtime errors over the last 24 hours included errors from older deployments: 48 `/battles/[slug]` errors from dereferencing `date_gregorian` on an undefined object; two old-deployment Supabase DNS failures pointing to `olryzmbomglblauhdexi.supabase.co`; one malformed JSON error each in `/api/kids/track-share`, `/api/poetry-insight`, and `/api/contact`; one `/api/tawasheeh` negative-limit error; and one PKCE verifier-not-found callback error. These must be separated by deployment before declaring current production regressions.

## Local project scripts

`pnpm verify` runs migration checks, migration replay validation, route checks, import checks, mobile readiness, ESLint, TypeScript, unit/integration tests, and production build. The last verified run before this audit passed 56 tests and the production build. It must be rerun after the Dependabot config and any repairs.
