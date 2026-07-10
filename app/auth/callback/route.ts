import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/profile';

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
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        // Ensure next is a safe relative path
        const safePath =
          next.startsWith('/') ? next : '/profile';
        return NextResponse.redirect(`${origin}${safePath}`);
      }
      console.error('[auth/callback] exchangeCodeForSession error:', error.message);
    } catch (err) {
      console.error('[auth/callback] unexpected error:', err);
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_failed`);
}
