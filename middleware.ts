import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getPublicEnv } from "@/lib/env";

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

export async function middleware(request: NextRequest) {
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

  try {
    const env = getPublicEnv();
    const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const configured = Boolean(supabaseUrl && supabaseAnonKey);

    if (!configured) {
      return isProtected ? redirectToLogin(request) : response;
    }

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

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
