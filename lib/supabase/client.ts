import { getPublicEnv } from '@/lib/env';

export function createBrowserSupabaseClient() {
  const { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } = getPublicEnv();

  const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
    const res = await fetch(`${NEXT_PUBLIC_SUPABASE_URL}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        apikey: NEXT_PUBLIC_SUPABASE_ANON_KEY,
        ...(init?.headers || {}),
      },
    });
    if (!res.ok) throw new Error(`Supabase request failed: ${res.status}`);
    return res.json() as Promise<T>;
  };

  return { request };
}
