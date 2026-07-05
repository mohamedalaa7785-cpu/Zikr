import { createBrowserClient } from '@supabase/ssr';

type BrowserClient = ReturnType<typeof createBrowserClient>;

// ─── Singleton ────────────────────────────────────────────────────────────────
// Deferred construction: module evaluation never calls createBrowserClient,
// so Next.js static page collection and CI builds without env vars succeed.

let _instance: BrowserClient | null = null;

export function createClient(): BrowserClient {
  if (_instance) return _instance;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // Return a no-op stub during build/SSR without env vars.
    // Real API calls will surface errors in the UI at runtime, not at build time.
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

/** Alias kept for backward compatibility with existing imports. */
export const createBrowserSupabaseClient = createClient;
