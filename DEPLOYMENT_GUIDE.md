# Zikr Project Deployment Guide

To ensure the project works correctly on production (Vercel) and with Supabase, follow these steps:

## 1. Supabase Configuration

### Authentication
1. Go to **Authentication > Providers > Google**.
2. Enable Google Provider.
3. Add your **Client ID** and **Client Secret** from Google Cloud Console.
4. In **Redirect URLs**, add:
   - `http://localhost:3000/auth/callback` (for local development)
   - `https://your-project-name.vercel.app/auth/callback` (replace with your Vercel URL)

### Database
Run the migrations or the SQL scripts in `drizzle/migrations` to ensure all tables (Quran, Hadith, Tafsir, Stories) are created with correct RLS policies.

## 2. Vercel Environment Variables

Add the following variables to your Vercel project settings:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Anon Key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase Service Role Key (Keep Secret) |
| `DATABASE_URL` | Connection string for Drizzle (Postgres) |
| `NEXT_PUBLIC_SITE_URL` | Your production URL (e.g., `https://zikr.app`) |
| `AUTH_CALLBACK_URL` | `${NEXT_PUBLIC_SITE_URL}/auth/callback` |
| `GEMINI_API_KEY` | Optional: For AI features |
| `YOUTUBE_API_KEY` | Optional: For fetching YouTube data |

## 3. Features Status

- **Quran**: Fully functional via AlQuran API.
- **Tafsir**: Integrated into Ayah detail pages.
- **Hadith**: Connected to live API with pagination.
- **Stories**: Integrated with YouTube embed support.
- **Auth**: Google OAuth and Email/Password ready.

## 4. GitHub Sync
Push the latest changes to your repository:
```bash
git add .
git commit -m "Fix: APIs, Environment variables, and Content integrations"
git push origin main
```
