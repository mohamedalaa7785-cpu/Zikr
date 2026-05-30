import { cookies } from 'next/headers';
import { getPublicEnv, getServerEnv } from '@/lib/env';

export async function getServerSessionToken() {
  const store = await cookies();
  let token = store.get('sb_access_token')?.value;
  const refreshToken = store.get('sb_refresh_token')?.value;

  // If token is missing but refresh token exists, we could try to refresh it here
  // However, in Next.js Server Components, we cannot set cookies easily during a GET request
  // So we rely on the client or middleware to handle refreshing if needed.
  // For now, we just return what we have.
  return token ?? null;
}

async function serverRequest<T>(path: string, init?: RequestInit, useServiceRole = false): Promise<T> {
  const { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } = getPublicEnv();
  const service = getServerEnv().SUPABASE_SERVICE_ROLE_KEY;
  const key = useServiceRole ? service : NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const res = await fetch(`${NEXT_PUBLIC_SUPABASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      apikey: key,
      Authorization: `Bearer ${key}`,
      ...(init?.headers || {}),
    },
    cache: init?.cache ?? 'no-store',
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Supabase server request failed: ${res.status} ${body}`);
  }
  return res.json() as Promise<T>;
}

export const supabaseServerAnonRequest = <T>(path: string, init?: RequestInit) => serverRequest<T>(path, init, false);
export const supabaseServerAdminRequest = <T>(path: string, init?: RequestInit) => serverRequest<T>(path, init, true);

export async function getSupabaseUser() {
  const token = await getServerSessionToken();
  if (!token) return null;

  type AuthUserResponse = { id: string; email?: string };
  return serverRequest<AuthUserResponse>(
    '/auth/v1/user',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    false,
  );
}

export async function assertSupabaseConnection() {
  const status = await supabaseServerAnonRequest<{ version: string }>('/rest/v1/');
  return Boolean(status);
}
