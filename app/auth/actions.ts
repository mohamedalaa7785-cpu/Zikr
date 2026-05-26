'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getPublicEnv } from '@/lib/env';
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
  const data = await supabaseAuth('token?grant_type=password', { email, password });
  const store = await cookies();
  if (data.access_token) store.set('sb_access_token', data.access_token, { httpOnly: true, secure: true, path: '/' });
  redirect('/profile');
}

export async function registerAction(formData: FormData) {
  const email = String(formData.get('email') || '');
  const password = String(formData.get('password') || '');
  await supabaseAuth('signup', { email, password });
  redirect('/auth/login');
}

export async function forgotAction(formData: FormData) {
  const email = String(formData.get('email') || '');
  const { NEXT_PUBLIC_SUPABASE_URL } = getPublicEnv();
  await supabaseAuth('recover', { email, redirect_to: `${NEXT_PUBLIC_SUPABASE_URL}/auth/callback` });
  redirect('/auth/login');
}

export async function logoutAction() {
  const store = await cookies();
  store.delete('sb_access_token');
  redirect('/');
}

export async function setSessionAction(accessToken: string) {
  if (!accessToken) throw new Error('رمز الجلسة مفقود.');
  const store = await cookies();
  store.set('sb_access_token', accessToken, { httpOnly: true, secure: true, path: '/' });
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
