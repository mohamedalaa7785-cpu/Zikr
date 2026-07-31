import { NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '@/lib/supabase/middleware';

// Routes that require an authenticated session
const PROTECTED_ROUTES = ['/profile', '/admin', '/favorites', '/wird', '/memorization'];

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Create a mutable response so the middleware client can write session cookies
  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  // Always refresh the Supabase session so server components see a valid user
  const { supabase, configured } = createMiddlewareClient(request, response);

  if (!configured || !supabase) {
    // Supabase not configured — allow all traffic (dev/preview without env vars)
    return response;
  }

  // getUser() validates the JWT against Supabase and refreshes tokens if needed
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect unauthenticated users away from protected routes
  if (!user && isProtectedRoute(pathname)) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect already-authenticated users away from login/register pages
  if (user && (pathname === '/auth/login' || pathname === '/auth/register')) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static  (static files)
     * - _next/image   (image optimisation)
     * - favicon.ico
     * - public assets (svg, png, jpg, …)
     * - api routes that don't need session refresh
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|eot|otf|mp3|mp4)$).*)',
  ],
};
