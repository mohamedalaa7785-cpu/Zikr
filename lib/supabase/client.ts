import { createBrowserClient } from '@supabase/ssr';
import { getPublicEnv } from '@/lib/env';

type BrowserClient = ReturnType<typeof createBrowserClient>;

// ─── Singleton ────────────────────────────────────────────────────────────────
// Deferred construction: module evaluation never calls createBrowserClient,
// so Next.js static page collection and CI builds without env vars succeed.

let _instance: BrowserClient | null = null;

export function createClient(): BrowserClient {
  if (_instance) return _instance;

  const { NEXT_PUBLIC_SUPABASE_URL: url, NEXT_PUBLIC_SUPABASE_ANON_KEY: key } = getPublicEnv();

  if (!url || !key) {
    // In the v0 preview sandbox, NEXT_PUBLIC_* vars are not injected at build
    // time. Return a placeholder so the rest of the app degrades gracefully
    // (the server already provides initialUser via SSR props).
    // In production on Vercel, NEXT_PUBLIC_SUPABASE_URL is always set.
    return createBrowserClient(
      url || 'https://placeholder.supabase.co',
      key || 'placeholder-anon-key',
    );
  }

  _instance = createBrowserClient(url, key);
  return _instance;
}

/** Alias kept for backward compatibility with existing imports. */
export const createBrowserSupabaseClient = createClient;
