import { createBrowserClient } from '@supabase/ssr';

type BrowserClient = ReturnType<typeof createBrowserClient>;

// ─── Singleton ────────────────────────────────────────────────────────────────
// We cache the instance to avoid creating multiple clients (Supabase SSR
// requirement). Construction is deferred to the first call so that module
// evaluation never throws — essential for Next.js static page collection and
// CI builds where NEXT_PUBLIC_SUPABASE_URL / ANON_KEY may be absent.

let _instance: BrowserClient | null = null;

export function createClient(): BrowserClient {
  if (_instance) return _instance;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // During SSR pre-render / build without env vars, return a no-op stub so
    // the module import itself doesn't crash.  Any real API call will still
    // fail at runtime (the error surfaces in the UI, not at build time).
    return createNoop() as unknown as BrowserClient;
  }

  _instance = createBrowserClient(url, key);
  return _instance;
}

/** Minimal stub returned when env vars are absent (build / SSR phase). */
function createNoop() {
  const noop = () => noopQuery;
  const noopQuery: Record<string, unknown> = new Proxy(
    {},
    {
      get(_t, prop) {
        if (prop === 'then') return undefined; // not a thenable
        return noop;
      },
    }
  );
  return {
    auth: { getUser: async () => ({ data: { user: null }, error: null }) },
    from: noop,
    rpc: noop,
    storage: { from: noop },
  };
}

// ─── Legacy REST compatibility helper ────────────────────────────────────────
// Wraps the Supabase REST API directly, used by older pages that have not yet
// been migrated to the supabase-js query builder.
export type RestRequestFn = <T>(path: string, init?: RequestInit) => Promise<T>;

async function browserRestRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error('Supabase environment variables are not configured.');
  }

  const res = await fetch(`${url}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      apikey: key,
      Authorization: `Bearer ${key}`,
      ...(init?.headers || {}),
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Supabase REST ${res.status}: ${body}`);
  }
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

/**
 * Compatibility wrapper — older files import this name and rely on the
 * legacy `.request()` REST helper alongside the standard supabase-js client.
 */
export function createBrowserSupabaseClient(): BrowserClient & { request: RestRequestFn } {
  const client = createClient();
  return Object.assign(client, { request: browserRestRequest as RestRequestFn });
}
