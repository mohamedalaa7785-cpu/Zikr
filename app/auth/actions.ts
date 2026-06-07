'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getPublicEnv, getServerEnv } from '@/lib/env';
import { supabaseServerAnonRequest } from '@/lib/supabase/server';

function sanitizeNextPath(value: string | null | undefined, fallback = '/profile') {
  const next = String(value || fallback).trim();
  if (!next.startsWith('/') || next.startsWith('//')) return fallback;
  return next;
}

function requireField(value: string, fieldName: string) {
  const cleaned = value.trim();
  if (!cleaned) {
    throw new Error(`حقل ${fieldName} مطلوب.`);
  }
  return cleaned;
}

async function supabaseAuth(path: string, body: Record<string, unknown>) {
  const { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } = getPublicEnv();

  const res = await fetch(`${NEXT_PUBLIC_SUPABASE_URL}/auth/v1/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: NEXT_PUBLIC_SUPABASE_ANON_KEY,
      Authorization: `Bearer ${NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      data?.msg ||
      data?.message ||
      data?.error_description ||
      'تعذر تنفيذ عملية المصادقة. تأكد من إعداد Supabase.';
    throw new Error(message);
  }

  return data as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    user?: { id?: string };
  };
}

export async function loginAction(formData: FormData) {
  const email = requireField(String(formData.get('email') || ''), 'البريد الإلكتروني');
  const password = requireField(String(formData.get('password') || ''), 'كلمة المرور');
  const next = sanitizeNextPath(formData.get('next')?.toString(), '/profile');

  const data = await supabaseAuth('token?grant_type=password', { email, password });

  if (!data.access_token) {
    throw new Error('تعذر تسجيل الدخول. الاستجابة من Supabase غير مكتملة.');
  }

  const store = await cookies();
  const maxAge = data.expires_in || 3600;

  store.set('sb_access_token', data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge,
  });

  if (data.refresh_token) {
    store.set('sb_refresh_token', data.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  redirect(next);
}

export async function registerAction(formData: FormData) {
  const email = requireField(String(formData.get('email') || ''), 'البريد الإلكتروني');
  const password = requireField(String(formData.get('password') || ''), 'كلمة المرور');

  await supabaseAuth('signup', { email, password });
  redirect('/auth/login');
}

export async function forgotAction(formData: FormData) {
  const email = requireField(String(formData.get('email') || ''), 'البريد الإلكتروني');
  const { AUTH_CALLBACK_URL } = getServerEnv();

  await supabaseAuth('recover', {
    email,
    redirect_to: AUTH_CALLBACK_URL,
  });

  redirect('/auth/login');
}

export async function logoutAction() {
  const store = await cookies();

  try {
    const token = store.get('sb_access_token')?.value;
    if (token) {
      await supabaseServerAnonRequest('/auth/v1/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  } catch {
    // تجاهل فشل logout البعيد، وامسح الجلسة محليًا على أي حال
  }

  store.delete('sb_access_token');
  store.delete('sb_refresh_token');
  redirect('/');
}

export async function setSessionAction(accessToken: string, refreshToken?: string) {
  const token = accessToken.trim();
  if (!token) throw new Error('رمز الجلسة مفقود.');

  const store = await cookies();

  store.set('sb_access_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 3600,
  });

  if (refreshToken?.trim()) {
    store.set('sb_refresh_token', refreshToken.trim(), {
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
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!me?.id) {
    throw new Error('تعذر التحقق من هوية المستخدم.');
  }

  await supabaseServerAnonRequest('/rest/v1/profiles?id=eq.' + me.id, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      Prefer: 'return=minimal',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      display_name: displayName || null,
      updated_at: new Date().toISOString(),
    }),
  });

  redirect('/profile');
            }
