# Google OAuth Setup & Fix Guide

## Issues Fixed

I've fixed the Google OAuth login flow with these improvements:

1. **Enhanced Error Handling**: Both the button and callback route now have detailed logging
2. **Better Callback Processing**: The callback route now properly handles errors and provides detailed feedback
3. **Improved OAuth Options**: Added `access_type: offline` and `prompt: consent` for better OAuth flow
4. **Graceful Profile Creation**: Profile upsert errors won't break the login flow

## Setup Instructions

### Step 1: Configure Google OAuth in Supabase

1. Go to your Supabase dashboard: https://app.supabase.com
2. Navigate to **Authentication** > **Providers**
3. Find **Google** provider and enable it
4. You need to provide:
   - **Google Client ID**
   - **Google Client Secret**

### Step 2: Get Google OAuth Credentials

If you don't have Google OAuth credentials:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google+ API**
4. Go to **Credentials** > **Create Credentials** > **OAuth 2.0 Client ID**
5. Choose **Web Application**
6. Add authorized redirect URIs:
   - `https://tvfkdydkgkawessjslde.supabase.co/auth/v1/callback` (Supabase OAuth handler)
   - Your actual app callback URL (see Step 3)
7. Copy the **Client ID** and **Client Secret**

### Step 3: Configure Redirect URLs in Supabase

1. In Supabase **Authentication** > **URL Configuration**:
   - Set **Site URL**: `https://zikrmediaofficial.vercel.app` (or your actual domain)
   - Add **Redirect URLs**:
     - `https://zikrmediaofficial.vercel.app/auth/callback`
     - `https://zikrmediaofficial.vercel.app/auth/login` (fallback)
     - Add localhost for local development: `http://localhost:3000/auth/callback`

### Step 4: Verify Environment Variables

Make sure these are set in your Vercel project settings:

```
NEXT_PUBLIC_SUPABASE_URL=https://tvfkdydkgkawessjslde.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
AUTH_CALLBACK_URL=https://zikrmediaofficial.vercel.app/auth/callback
```

## How It Works Now

### Google OAuth Button (`/app/auth/google-oauth-button.tsx`)
- Constructs proper redirect URI with `buildOAuthRedirectUri()`
- Sends user to Google OAuth consent screen
- Logs OAuth flow for debugging
- Includes offline access and consent prompting

### Callback Handler (`/app/auth/callback/route.ts`)
- Receives OAuth authorization code from Supabase
- Exchanges code for session
- Handles OAuth errors gracefully
- Updates user profile with Google data
- Redirects to safe path or profile page
- Detailed error logging for debugging

## Troubleshooting

### Error: "Provider is not enabled"
- Make sure Google provider is enabled in Supabase Authentication settings

### Error: "Invalid Redirect URI"
- Check that your redirect URL matches exactly in:
  - Google Cloud Console authorized redirect URIs
  - Supabase URL Configuration redirect URLs
  - The URL in `buildOAuthRedirectUri()` function

### User stuck on Google login screen
- Check browser console for errors (press F12)
- Check Supabase logs in dashboard
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct

### Session not persisting after login
- Verify cookies are not blocked in browser settings
- Check that `@supabase/ssr` is properly configured in server client
- Session cookies should be set automatically by Supabase

## Testing

1. Go to `/auth/login` page
2. Click "Sign in with Google" button
3. You should be redirected to Google consent screen
4. After granting permission, you'll be redirected back to your app
5. Session should be created and you redirected to profile page

## Debug Logs

Open browser DevTools (F12) and check Console for messages like:
- `[oauth] Starting Google login with redirectUri: ...`
- `[auth/callback] Processing callback with code: ...`
- `[auth/callback] User authenticated: ...`

These help identify where the flow is breaking.
