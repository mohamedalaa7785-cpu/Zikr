# Supabase Database Audit Report

This report summarizes the audit of the ZIKR project's Supabase database, identifying security risks, schema inconsistencies, and areas for improvement.

## Summary

| Category | Findings | Severity |
| :--- | :--- | :--- |
| **RLS Policies** | Missing RLS on several tables | **High** |
| **Auth Schema** | Duplicate user-related tables (`users` vs `profiles`) | **Medium** |
| **Schema Drift** | Inconsistent naming and structure | **Low** |
| **Data Integrity** | No orphan rows found in core tables | **None** |

## Findings

### 1. Missing Row Level Security (RLS)
The following tables in the `public` schema do not have RLS enabled, making them potentially vulnerable to unauthorized access:
- `generated_research`
- `payments`
- `quran_audio`
- `research_requests`
- `subscriptions`
- `tasks`
- `user_behavior`
- `users` (Legacy table)

**Recommendation:** Enable RLS on all tables and define appropriate policies for `anon`, `authenticated`, and `service_role` access.

### 2. Duplicate User Tables
There is a duplicate structure for user data:
- `public.profiles`: Used by core features like `favorites` and `reminders`.
- `public.users`: Appears to be a legacy or redundant table.

**Recommendation:** Consolidate user data into `public.profiles` and remove the redundant `public.users` table after verifying no dependencies exist.

### 3. Inconsistent RLS Policies
Some tables have permissive policies that might be too broad:
- `contacts`: Enable insert and read for all users (including `anon`).
- `saved_stories`: Enable insert and read for all authenticated users without ownership check.

**Recommendation:** Review and tighten policies to ensure users can only access and modify their own data.

### 4. Schema and Integration Stability
- Several tables related to AI and research (`generated_research`, `research_requests`, `tasks`) lack proper security and structure.
- `quran_audio` and `subscriptions` lack RLS.

**Recommendation:** Harden these tables with RLS and proper foreign key constraints.

## Remediation Plan

1. **Phase 1 (Immediate):** Enable RLS on all tables and implement basic "owner-only" or "public-read" policies.
2. **Phase 2:** Audit all code references to `public.users` and migrate to `public.profiles`.
3. **Phase 3:** Refine policies for complex tables like `saved_stories` and `story_progress` to include ownership checks.
4. **Phase 4:** Standardize naming conventions and add missing indexes for performance.
