import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  if ((request.nextUrl.pathname.startsWith('/profile') || request.nextUrl.pathname.startsWith('/favorites')) && !request.cookies.get('sb_access_token')) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/favorites/:path*']
};
