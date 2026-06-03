'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getPublicEnv, getServerEnv } from '@/lib/env';
import { supabaseServerAnonRequest } from '@/lib/supabase/server';

async function supabaseAuth(path: string, body: Record<string, unknown>) {
  const { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } = getPublicEnv();
  const res = await fetch(`${NEXT_PUBLIC_SUPABASE_URL}/auth/v1/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: NEXT_PUBLIC_SUPABASE_ANON_KEY },
    body: JSON.stringify(body),
    cache: 'no-store'
  });
  if (!res.ok) throw new Error('تعذر تنفيذ عملية المصادقة. تأكد من إعداد Supabase.');
  return res.json();
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get('email') || '');
  const password = String(formData.get('password') || '');
  const next = String(formData.get('next') || '/profile').replace(/^(?!\/)/g, '/');
  const data = await supabaseAuth('token?grant_type=password', { email, password });
  const store = await cookies();
  if (data.access_token) {
    const maxAge = data.expires_in || 3600;
    store.set('sb_access_token', data.access_token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge });
    if (data.refresh_token) {
      store.set('sb_refresh_token', data.refresh_token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 30 });
    }
  }
  redirect(next);
}

export async function registerAction(formData: FormData) {
  const email = String(formData.get('email') || '');
  const password = String(formData.get('password') || '');
  await supabaseAuth('signup', { email, password });
  redirect('/auth/login');
}

export async function forgotAction(formData: FormData) {
  const email = String(formData.get('email') || '');
  const { AUTH_CALLBACK_URL } = getServerEnv();
  await supabaseAuth('recover', { email, redirect_to: AUTH_CALLBACK_URL });
  redirect('/auth/login');
}

export async function logoutAction() {
  const store = await cookies();
  store.delete('sb_access_token');
  store.delete('sb_refresh_token');
  redirect('/');
}

export async function setSessionAction(accessToken: string, refreshToken?: string) {
  if (!accessToken) throw new Error('رمز الجلسة مفقود.');
  const store = await cookies();
  const maxAge = 3600; // Default 1 hour
  store.set('sb_access_token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge,
  });
  if (refreshToken) {
    store.set('sb_refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
  }
}

export async function updateProfileAction(formData: FormData) {
  const displayName = String(formData.get('displayName') || '').trim();
  const store = await cookies();
  const token = store.get('sb_access_token')?.value;
  if (!token) redirect('/auth/login');

  const me = await supabaseServerAnonRequest<{ id: string }>('/auth/v1/user', {
    headers: { Authorization: `Bearer ${token}` },
  });

  await supabaseServerAnonRequest('/rest/v1/profiles?id=eq.' + me.id, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ display_name: displayName || null, updated_at: new Date().toISOString() }),
  });

  redirect('/profile');
}
