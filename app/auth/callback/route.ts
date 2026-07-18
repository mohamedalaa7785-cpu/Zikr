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

      if (error) {
        const msg = encodeURIComponent(error.message || 'تعذر تسجيل الدخول');
        return NextResponse.redirect(`${origin}/auth/login?error=${msg}`);
      }

      const user = data.user;
      if (user) {
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
        } catch {
          // Profile upsert failure must not block login
        }
      }

      return NextResponse.redirect(`${origin}${safePath}`);
    } catch (err) {
      const msg = encodeURIComponent(
        err instanceof Error ? err.message : 'حدث خطأ غير متوقع'
      );
      return NextResponse.redirect(`${origin}/auth/login?error=${msg}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_failed`);
}
