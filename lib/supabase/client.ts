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

  if (!url) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL for browser Supabase client.');
  }
  if (!key) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY for browser Supabase client.');
  }

  _instance = createBrowserClient(url, key);
  return _instance;
}

/** Alias kept for backward compatibility with existing imports. */
export const createBrowserSupabaseClient = createClient;
