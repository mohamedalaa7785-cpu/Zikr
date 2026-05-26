import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isTokenValid } from '@/lib/middleware-auth';

const PROTECTED_ROUTES = ['/profile', '/favorites'];
const PUBLIC_ROUTES = ['/auth/login', '/auth/register', '/auth/callback', '/'];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get('sb_access_token')?.value;

  // Validate token existence and validity
  if (!token || !isTokenValid(token)) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('sb_access_token'); // Clear invalid token
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/favorites/:path*'],
};