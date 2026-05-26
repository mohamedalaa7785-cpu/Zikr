import { cookies } from 'next/headers';
import { getPublicEnv, getServerEnv } from '@/lib/env';

export async function getServerSessionToken() {
  const store = await cookies();
  return store.get('sb_access_token')?.value ?? null;
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
    cache: 'no-store',
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Supabase server request failed: ${res.status} ${body}`);
  }
  return res.json() as Promise<T>;
}

export const supabaseServerAnonRequest = <T>(path: string, init?: RequestInit) => serverRequest<T>(path, init, false);
export const supabaseServerAdminRequest = <T>(path: string, init?: RequestInit) => serverRequest<T>(path, init, true);
