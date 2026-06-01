import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isTokenValid, isTokenExpired } from '@/lib/middleware-auth';

const PROTECTED_ROUTES = ['/profile', '/favorites', '/admin'];
const PUBLIC_ROUTES = ['/auth/login', '/auth/register', '/auth/callback', '/'];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  const token = request.cookies.get('sb_access_token')?.value;
  const refreshToken = request.cookies.get('sb_refresh_token')?.value;

  const NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If token is expired but refresh token exists, try to refresh
  if (refreshToken && token && isTokenExpired(token) && NEXT_PUBLIC_SUPABASE_URL && NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const res = await fetch(`${NEXT_PUBLIC_SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: NEXT_PUBLIC_SUPABASE_ANON_KEY },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (res.ok) {
        const data = await res.json();
        const response = NextResponse.next();
        if (data.access_token) {
          response.cookies.set('sb_access_token', data.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: data.expires_in || 3600,
          });
        }
        if (data.refresh_token) {
          response.cookies.set('sb_refresh_token', data.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 30,
          });
        }
        return response;
      }
    } catch (error) {
      // Log but don't block - middleware should allow request to proceed
      // The app will handle missing auth gracefully
      console.error('[middleware] Token refresh failed:', error instanceof Error ? error.message : 'unknown error');
      // Clear invalid tokens
      const response = NextResponse.next();
      response.cookies.delete('sb_access_token');
      response.cookies.delete('sb_refresh_token');
      return response;
    }
  }

  if (!isProtected) return NextResponse.next();

  // Validate token existence and validity
  if (!token || !isTokenValid(token)) {
    // Allow login and register pages to render
    if (pathname === '/auth/login' || pathname === '/auth/register') {
      return NextResponse.next();
    }

    // Redirect to login with return path
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    const response = NextResponse.redirect(loginUrl);
    
    // Clear invalid tokens
    response.cookies.delete('sb_access_token');
    response.cookies.delete('sb_refresh_token');
    
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/favorites/:path*', '/admin/:path*'],
};
