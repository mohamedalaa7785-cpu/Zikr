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
    if (res.status === 204) return undefined as T;

    const text = await res.text();
    if (!text) return undefined as T;

    return JSON.parse(text) as T;
  };

  const healthcheck = () => request<Record<string, unknown>>('/rest/v1/');

  const signInWithOAuth = async ({ provider, options }: { provider: 'google'; options?: { redirectTo?: string } }) => {
    const redirectTo = options?.redirectTo;
    const params = new URLSearchParams({ provider });
    if (redirectTo) params.set('redirect_to', redirectTo);
    window.location.href = `${NEXT_PUBLIC_SUPABASE_URL}/auth/v1/authorize?${params.toString()}`;
    return { data: null, error: null };
  };

  return { request, healthcheck, auth: { signInWithOAuth } };
}
