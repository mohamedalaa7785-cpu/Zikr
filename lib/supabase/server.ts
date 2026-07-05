import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? SUPABASE_ANON_KEY;

/**
 * Do NOT put this client in a global variable.
 * Always create a new client within each function call.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component — safe to ignore if proxy handles refresh.
        }
      },
    },
  });
}

/** Convenience: get the currently authenticated user (server-side). */
export async function getSupabaseUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// ─── Legacy REST compatibility helpers ───────────────────────────────────────
// These wrap the Supabase REST API directly, used by older services that
// have not yet been migrated to the supabase-js client.

async function restRequest<T>(
  path: string,
  init?: RequestInit,
  apiKey: string = SUPABASE_ANON_KEY
): Promise<T> {
  if (!SUPABASE_URL || !apiKey) {
    throw new Error('Supabase environment variables are not configured.');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  let res: Response;
  try {
    res = await fetch(`${SUPABASE_URL}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
        ...(init?.headers || {}),
      },
      cache: init?.cache ?? 'no-store',
      signal: init?.signal ?? controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Supabase REST ${res.status}: ${body}`);
  }
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

/** Authenticated REST request using the anon key. */
export const supabaseServerAnonRequest = <T>(path: string, init?: RequestInit) =>
  restRequest<T>(path, init, SUPABASE_ANON_KEY);

/** Authenticated REST request using the service-role key (bypasses RLS). */
export const supabaseServerAdminRequest = <T>(path: string, init?: RequestInit) =>
  restRequest<T>(path, init, SUPABASE_SERVICE_KEY);

/** Legacy: read the access token from the cookie store. */
export async function getServerSessionToken() {
  const store = await cookies();
  return store.get('sb-access-token')?.value ?? store.get('sb_access_token')?.value ?? null;
}

/** Legacy: check Supabase connectivity. */
export async function assertSupabaseConnection() {
  try {
    await restRequest('/rest/v1/', {}, SUPABASE_ANON_KEY);
    return true;
  } catch {
    return false;
  }
}
