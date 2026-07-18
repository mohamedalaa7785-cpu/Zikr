import { createServerClient } from '@supabase/ssr';
import type { NextRequest, NextResponse } from 'next/server';

/**
 * Create a Supabase client suitable for use in Next.js middleware.
 * Unlike the server client, this one reads/writes cookies via NextRequest
 * and NextResponse so tokens can be refreshed inside the middleware edge runtime.
 *
 * Returns the client AND the (possibly mutated) response so the caller can
 * forward the updated Set-Cookie headers to the browser.
 */
export function createMiddlewareClient(
  request: NextRequest,
  response: NextResponse
) {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    '';
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    '';

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        // Write to request so downstream server components see the refreshed token.
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        // Write to response so the browser receives the updated cookie.
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  return { supabase, response };
}
