import { createClient } from '@/lib/supabase/server';
import { extractNextPath } from '@/lib/auth-enhanced';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get('code');
  const safePath = extractNextPath(searchParams);

  // Supabase may forward OAuth errors directly to the callback
  const oauthError = searchParams.get('error');
  const oauthErrorDesc = searchParams.get('error_description');
  if (oauthError) {
    const msg = encodeURIComponent(oauthErrorDesc || oauthError);
    return NextResponse.redirect(`${origin}/auth/login?error=${msg}`);
  }

  if (code) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        const user = data.user;
        if (user) {
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
        }

        return NextResponse.redirect(`${origin}${safePath}`);
      }
      console.error('[auth/callback] exchangeCodeForSession error:', error.message);
    } catch (err) {
      console.error('[auth/callback] unexpected error:', err);
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_failed`);
}
