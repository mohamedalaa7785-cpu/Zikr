import { createClient } from '@/lib/supabase/server';
import { extractNextPath } from '@/lib/auth-enhanced';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get('code');
  const safePath = extractNextPath(searchParams);

  console.debug('[auth/callback] Processing callback with code:', !!code, 'path:', safePath);

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
      console.debug('[auth/callback] Exchanging code for session...');
      
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('[auth/callback] exchangeCodeForSession error:', error.message, error.status);
        const msg = encodeURIComponent(error.message || 'تعذر تسجيل الدخول');
        return NextResponse.redirect(`${origin}/auth/login?error=${msg}`);
      }

      const user = data.user;
      if (user) {
        console.debug('[auth/callback] User authenticated:', user.id);
        
        try {
          await supabase.from('profiles').upsert({
            id: user.id,
            email: user.email,
            display_name:
              typeof user.user_metadata?.full_name === 'string'
                ? user.user_metadata.full_name
                : null,
            avatar_url:
              typeof user.user_metadata?.avatar_url === 'string'
                ? user.user_metadata.avatar_url
                : null,
            updated_at: new Date().toISOString(),
          });
          console.debug('[auth/callback] Profile upserted successfully');
        } catch (profileErr) {
          console.error('[auth/callback] Profile upsert error:', profileErr);
          // Don't fail the login if profile update fails
        }
      }

      console.debug('[auth/callback] Redirecting to:', safePath);
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
