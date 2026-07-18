import { NextResponse, type NextRequest } from "next/server";
import { createMiddlewareClient } from "@/lib/supabase/middleware";

const PROTECTED_PREFIXES = ["/profile", "/favorites", "/admin"];
const AUTH_ONLY_PATHS = ["/auth/login", "/auth/register"];
const AUTH_CALLBACK_PREFIX = "/auth/callback";

function matchesPrefix(pathname: string, prefixes: readonly string[]) {
  return prefixes.some(
    prefix => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL("/auth/login", request.url);
  loginUrl.searchParams.set(
    "next",
    `${request.nextUrl.pathname}${request.nextUrl.search}`
  );
  return NextResponse.redirect(loginUrl);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname === AUTH_CALLBACK_PREFIX ||
    pathname.startsWith(`${AUTH_CALLBACK_PREFIX}/`)
  ) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });
  const isProtected = matchesPrefix(pathname, PROTECTED_PREFIXES);
  const isAuthOnlyPage = matchesPrefix(pathname, AUTH_ONLY_PATHS);

  const { supabase, configured } = createMiddlewareClient(request, response);

  if (!configured || !supabase) {
    return isProtected ? redirectToLogin(request) : response;
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    response = NextResponse.next({ request });

    if (!user && isProtected) {
      return redirectToLogin(request);
    }

    if (user && isAuthOnlyPage) {
      return NextResponse.redirect(new URL("/profile", request.url));
    }

    return response;
  } catch {
    return isProtected ? redirectToLogin(request) : response;
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|manifest\\.(?:json|webmanifest)|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|xml|txt|css|js|map|woff2?)$).*)",
  ],
};
