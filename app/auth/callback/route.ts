import { createClient, createAdminClient } from '@/lib/supabase/server';
import { extractNextPath, getTrustedAuthOrigin } from '@/lib/auth-enhanced';
import { NextRequest, NextResponse } from 'next/server';

function getOAuthProfileValue(metadata: Record<string, unknown>, ...keys: string[]) {
  for (const key of keys) {
    const value = metadata[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const origin = getTrustedAuthOrigin(request);
  const code = searchParams.get('code');
  const safePath = extractNextPath(searchParams);

  // Supabase may forward OAuth errors directly to the callback
  const oauthError = searchParams.get('error');
  const oauthErrorDesc = searchParams.get('error_description');
  if (oauthError) {
    console.error('[auth/callback] OAuth error:', oauthError, oauthErrorDesc);
    const msg = encodeURIComponent(oauthErrorDesc || oauthError);
    return NextResponse.redirect(`${origin}/auth/login?error=${msg}`);
  }

  if (code) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('[auth/callback] exchangeCodeForSession error:', error.message, error.status);
        const msg = encodeURIComponent(error.message || 'تعذر تسجيل الدخول');
        return NextResponse.redirect(`${origin}/auth/login?error=${msg}`);
      }

      const user = data.user;
      if (!user) {
        const sessionCheck = await supabase.auth.getUser();
        if (!sessionCheck.data.user) {
          return NextResponse.redirect(
            `${origin}/auth/login?error=auth_session_missing`,
          );
        }
      }

      if (user) {
        try {
          const metadata = user.user_metadata ?? {};
          const displayName =
            getOAuthProfileValue(metadata, 'full_name', 'name', 'display_name') ??
            user.email?.split('@')[0] ??
            null;
          const avatarUrl = getOAuthProfileValue(metadata, 'avatar_url', 'picture');

          // Use the service-role admin client to bypass RLS for the upsert.
          // The anon-key client bound to the just-exchanged session may not yet
          // have its cookies flushed to the response, so RLS checks can fail for
          // brand-new users who have no row in `profiles` yet.
          const adminClient = createAdminClient();
          const { error: upsertError } = await adminClient.from('profiles').upsert(
            {
              id: user.id,
              email: user.email ?? null,
              display_name: displayName,
              avatar_url: avatarUrl,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'id' }
          );
          if (upsertError) {
            console.error('[auth/callback] Profile upsert error:', upsertError.message);
          }
        } catch (profileErr) {
          console.error('[auth/callback] Profile upsert exception:', profileErr);
          // Never fail the login flow due to a profile write error
        }
      }

      return NextResponse.redirect(`${origin}${safePath}`);
    } catch (err) {
      console.error('[auth/callback] Unexpected error:', err);
      const msg = encodeURIComponent(
        err instanceof Error ? err.message : 'حدث خطأ غير متوقع'
      );
      return NextResponse.redirect(`${origin}/auth/login?error=${msg}`);
    }
  }

  console.warn('[auth/callback] No code provided in callback');
  return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_failed`);
}
