'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getPublicEnv } from '@/lib/env';

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
