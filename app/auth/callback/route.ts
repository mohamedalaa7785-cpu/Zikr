 codex/fix-google-login-to-open-profile-5i6owf
import { createServerClient } from '@supabase/ssr';
import { extractNextPath } from '@/lib/auth-enhanced';
import { getServerEnv } from '@/lib/env';
import { createClient } from '@/lib/supabase/server';
import { extractNextPath } from '@/lib/auth-enhanced';
 Zikr
import { NextRequest, NextResponse } from 'next/server';

function redirectWithAuthCookies(
  targetUrl: string,
  authResponse: NextResponse
) {
  const response = NextResponse.redirect(targetUrl);
  authResponse.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie);
  });
  return response;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get('code');
  const safePath = extractNextPath(searchParams);

  const oauthError = searchParams.get('error');
  const oauthErrorDesc = searchParams.get('error_description');
  if (oauthError) {
    const msg = encodeURIComponent(oauthErrorDesc || oauthError);
    return NextResponse.redirect(`${origin}/auth/login?error=${msg}`);
  }

 codex/fix-google-login-to-open-profile-5i6owf
  if (!code) {
    return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_failed`);
  }

  let authResponse = NextResponse.next({ request });
  const env = getServerEnv();

  try {
    const supabase = createServerClient(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => {
              request.cookies.set(name, value);
            });
            authResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) => {
              authResponse.cookies.set(name, value, options);
            });
          },
        },
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
Zikr
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error('[auth/callback] exchangeCodeForSession error:', error.message);
      return redirectWithAuthCookies(
        `${origin}/auth/login?error=auth_callback_failed`,
        authResponse
      );
    }

    const user = data.user;
    if (user) {
      const { error: profileError } = await supabase.from('profiles').upsert({
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

      if (profileError) {
        console.error('[auth/callback] profile upsert error:', profileError.message);
      }
    }

    return redirectWithAuthCookies(`${origin}${safePath}`, authResponse);
  } catch (err) {
    console.error('[auth/callback] unexpected error:', err);
    return redirectWithAuthCookies(
      `${origin}/auth/login?error=auth_callback_failed`,
      authResponse
    );
  }
}
