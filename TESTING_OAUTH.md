# Testing Google OAuth - Step by Step

## Quick Test Checklist

- [ ] Open `/auth/login` page
- [ ] Verify "المتابعة باستخدام Google" (Google button) is visible
- [ ] Open Browser DevTools (F12)
- [ ] Go to Console tab
- [ ] Click Google button
- [ ] Check for `[oauth]` logs
- [ ] You should be redirected to Google sign-in
- [ ] After accepting, check for `[auth/callback]` logs
- [ ] You should be redirected to `/profile` page

## Console Logs to Look For

### ✅ Success Flow

```
[oauth] Starting Google login with redirectUri: https://localhost:3000/auth/callback?next=/profile
→ (You're redirected to Google)
[auth/callback] Processing callback with code: true path: /profile
[auth/callback] Exchanging code for session...
[auth/callback] User authenticated: <user-id> <email>
[auth/callback] Profile upserted successfully
[auth/callback] Redirecting to: /profile
```

### ❌ Error: Provider Not Enabled

```
[oauth] Google login failed: Provider is not enabled
```

**Fix:** Enable Google provider in Supabase Dashboard > Authentication > Providers

### ❌ Error: Invalid Redirect URI

```
[auth/callback] OAuth error: invalid_request_uri Redirect URI mismatch
```

**Fix:** Check that your redirect URL matches exactly in:
- Google Cloud Console
- Supabase URL Configuration
- The `buildOAuthRedirectUri()` function

### ❌ Error: Invalid Client

```
[oauth] Google login failed: OAuth: Invalid client id or secret
```

**Fix:** Check Google Client ID and Secret are correct in Supabase

## Network Tab Debugging

1. Open DevTools (F12)
2. Go to Network tab
3. Click Google button
4. Look for requests to `supabase.co`
5. Check responses for error details

Key requests to look for:
- `signInWithOAuth` → redirects to Google
- `auth/v1/callback` → returns to your app

## Local Development Testing

### Setup

```bash
# Make sure dev server is running
pnpm dev
```

### Testing Redirects

The local redirect URL should be:
```
http://localhost:3000/auth/callback
```

In Supabase URL Configuration, add:
```
http://localhost:3000/auth/callback
```

### Session Verification

After successful login, check if session is stored:

```javascript
// In browser console
agent-browser eval "console.log(JSON.stringify(document.cookie))"
```

You should see cookies like:
- `sb-access-token`
- `sb-refresh-token`
- `sb-session`

## Troubleshooting Specific Errors

### Error: "code not found in URL parameters"
- **Cause:** Callback route not receiving auth code from Supabase
- **Fix:** Check `AUTH_CALLBACK_URL` environment variable is set correctly

### Error: "Failed to decode token"
- **Cause:** Invalid or expired JWT token
- **Fix:** Check Supabase JWT secret is correct

### Error: "Profile upsert error"
- **Cause:** RLS (Row Level Security) issue or table doesn't exist
- **Fix:** Check `profiles` table exists and has proper RLS policy
- **Note:** This won't fail the login anymore (gracefully handled)

### User stuck on Google consent screen
- **Cause:** `prompt: consent` might be causing repeated consent
- **Fix:** This is actually intended for first-time setup; if it persists, clear cookies

### Login works but session lost on page refresh
- **Cause:** Session cookies not being stored properly
- **Fix:** 
  - Check browser cookie settings
  - Verify `@supabase/ssr` is configured correctly
  - Check that cookies are not blocked by browser extensions

## Production Testing

### Before Deploying

1. ✅ Set all environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `AUTH_CALLBACK_URL` (should be your production domain)

2. ✅ Configure Google OAuth:
   - Add production redirect URI to Google Cloud Console
   - Ensure Google Client ID and Secret are in Supabase

3. ✅ Configure Supabase URLs:
   - Site URL: Your production domain
   - Redirect URLs: Include your production callback URL

4. ✅ Test the flow on production domain

### Production Redirect URL Format

```
https://yourdomain.com/auth/callback
```

Not:
```
https://yourdomain.com/auth/callback/ ← Extra slash
https://yourdomain.com/auth/callback?next=/profile ← Don't set this in Google
```

The `?next=` parameter is handled by your app, not Google.

## Performance Testing

To check if OAuth adds any performance issues:

```bash
agent-browser vitals "http://localhost:3000/auth/login" --json
```

The Google OAuth button should not impact:
- LCP (Largest Contentful Paint)
- FCP (First Contentful Paint)
- CLS (Cumulative Layout Shift)

It only adds a click event listener, which is negligible.

## Common Questions

### Q: Why does Google ask for consent every time?
**A:** This is expected behavior with `prompt: consent` — it's needed for offline access. Remove it if you don't want repeated consent.

### Q: Where is my session stored?
**A:** In browser cookies managed by Supabase:
- `sb-access-token` — JWT access token
- `sb-refresh-token` — Long-lived refresh token
- `sb-session` — Session metadata

### Q: How long is the session valid?
**A:** By default, 1 hour for access token, then auto-refreshes with refresh token.

### Q: Can I test without Google credentials?
**A:** For testing the flow without actually authenticating, you can:
1. Mock Supabase in tests
2. Use email/password login instead
3. Set up test Google OAuth credentials

## Still Having Issues?

1. **Check the logs:**
   - Browser console for `[oauth]` and `[auth/callback]` messages
   - Supabase dashboard logs
   - Next.js server terminal

2. **Verify configuration:**
   - Google Cloud Console settings
   - Supabase provider configuration
   - Environment variables

3. **Try a fresh test:**
   - Clear browser cookies
   - Hard refresh page (Ctrl+Shift+R or Cmd+Shift+R)
   - Try in incognito window

4. **Check the code:**
   - Review `GOOGLE_OAUTH_SETUP.md` for setup instructions
   - Review `FIXES_SUMMARY.md` for what was fixed
   - Check console logs for specific error messages
