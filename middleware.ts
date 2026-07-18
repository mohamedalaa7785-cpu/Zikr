import { NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '@/lib/supabase/middleware';

// ─── Route lists ──────────────────────────────────────────────────────────────

/**
 * Routes that require authentication.
 * Unauthenticated requests are redirected to /auth/login?next=<original-path>.
 */
const PROTECTED_PREFIXES = [
  '/profile',
  '/settings',
  '/favorites',
  '/memorization',
  '/wird',
  '/tasbeeh',
  '/admin',
];

/**
 * Routes that should redirect to /profile if the user is ALREADY logged in.
 * (Avoids showing the login/register form to authenticated users.)
 */
const AUTH_ONLY_PATHS = ['/auth/login', '/auth/register'];

// ─── Middleware ───────────────────────────────────────────────────────────────

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let the OAuth callback pass through without auth checks.
  if (pathname.startsWith('/auth/callback')) {
    return NextResponse.next();
  }

  // Build a base response that we will mutate with refreshed cookies.
  const response = NextResponse.next({ request });

  // Refresh the session — this MUST happen on every request so expiring tokens
  // are rotated before any server component or API route runs.
  const { supabase } = createMiddlewareClient(request, response);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthenticated = !!user;

  // ── Guard: redirect unauthenticated users away from protected routes ───────
  if (!isAuthenticated) {
    const isProtected = PROTECTED_PREFIXES.some((prefix) =>
      pathname.startsWith(prefix)
    );
    if (isProtected) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── Guard: redirect authenticated users away from login / register pages ──
  if (isAuthenticated) {
    const isAuthOnlyPage = AUTH_ONLY_PATHS.some((p) => pathname.startsWith(p));
    if (isAuthOnlyPage) {
      return NextResponse.redirect(new URL('/profile', request.url));
    }
  }

  return response;
}

// ─── Matcher ──────────────────────────────────────────────────────────────────
// Run on every path EXCEPT static files, images, and Next internals.
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|robots.txt|sitemap.xml|icons/|images/|fonts/).*)',
  ],
};
