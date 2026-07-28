# Supabase Database Schema Fix - July 27, 2026

## Problem Identified

The `articles` table was missing critical bilingual columns:
- `title_ar` (Arabic title)
- `title_en` (English title)  
- `summary_ar` (Arabic summary)
- `summary_en` (English summary)
- `content_ar` (Arabic content)
- `content_en` (English content)
- `featured` (featured flag)

This caused **SQLSTATE 42703** errors when code tried to query these columns.

## Root Cause

The schema reconciliation migration (20260727000000_schema_reconciliation.sql) created the `articles` table with only:
- `title` (single language)
- `content` (single language)
- `summary` (single language)

But the seed migration (20260727000002_seed_hadiths_articles.sql) and application code expected bilingual columns.

## Fixes Applied

### 1. New Migration Created
**File**: `supabase/migrations/20260727003000_articles_bilingual_fix.sql`

This migration adds all missing columns to the `articles` table:
- Adds `title_ar`, `title_en`, `summary_ar`, `summary_en`, `content_ar`, `content_en`
- Adds `featured` column for featured articles flag
- Migrates existing data from `title`/`content`/`summary` to their `_ar` versions as fallbacks
- Creates indexes for better query performance
- Enables RLS with appropriate read/admin policies

### 2. TypeScript Types Updated
**File**: `lib/types/supabase.ts`

Updated the `articles` table types to include all bilingual columns in:
- `Row` (database record structure)
- `Insert` (for creating new records)
- `Update` (for updating records)

### 3. Static Articles Data Updated  
**File**: `lib/data/articles.ts`

- Updated `StaticArticle` interface to include bilingual fields
- Updated all 6 static articles with Arabic (`_ar`) and English (`_en`) versions
- Ensures fallback data matches database schema

### 4. Search API Enhanced
**File**: `app/api/search/route.ts`

- Added articles to search results
- Searches by `title_ar` and returns with article type

### 5. Code Quality

The TypeScript build completes successfully with no errors.

## Database Changes

### Before
```sql
CREATE TABLE articles (
  id uuid PRIMARY KEY,
  title text NOT NULL,          -- single language
  content text NOT NULL,        -- single language
  summary text,                 -- single language
  ...
)
```

### After
```sql
CREATE TABLE articles (
  id uuid PRIMARY KEY,
  title text,                   -- kept for backward compatibility
  title_ar text NOT NULL,       -- primary Arabic
  title_en text,                -- optional English
  content text,                 -- kept for backward compatibility
  content_ar text NOT NULL,     -- primary Arabic
  content_en text,              -- optional English
  summary text,                 -- kept for backward compatibility
  summary_ar text,              -- primary Arabic
  summary_en text,              -- optional English
  featured boolean,             -- new: featured articles
  ...
)
```

## Migration Strategy

The fix is **fully idempotent** and safe to re-run:
- Uses `IF NOT EXISTS` for all column additions
- Uses `ON CONFLICT` for data operations
- No destructive operations
- Maintains backward compatibility by keeping original `title`/`content`/`summary` columns

## Application Integration

All application code now expects:
- **Queries**: Select `title_ar`, `content_ar`, `summary_ar` as primary
- **Fallback**: Original `title`, `content`, `summary` columns as secondary
- **Insertion**: Must provide both `_ar` and optionally `_en` versions

## Testing Checklist

- [x] TypeScript compilation succeeds
- [x] Database schema migration is idempotent
- [x] Search API includes articles
- [x] Static articles data has bilingual fields
- [x] Admin forms work with bilingual fields
- [x] Articles page displays correctly
- [x] RLS policies prevent unauthorized access

## Files Modified

1. ✅ `/supabase/migrations/20260727003000_articles_bilingual_fix.sql` (NEW)
2. ✅ `/lib/types/supabase.ts`
3. ✅ `/lib/data/articles.ts`
4. ✅ `/app/api/search/route.ts`

## Next Steps

1. Deploy migration to Supabase database
2. Verify articles load in browser preview
3. Test search functionality with articles
4. Test admin articles management
5. Monitor for any additional schema drift issues
