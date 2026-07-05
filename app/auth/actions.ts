'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

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

export async function loginAction(formData: FormData) {
  const email = requireField(String(formData.get('email') || ''), 'البريد الإلكتروني');
  const password = requireField(String(formData.get('password') || ''), 'كلمة المرور');
  const next = sanitizeNextPath(formData.get('next')?.toString(), '/profile');

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    throw new Error(error.message || 'تعذر تسجيل الدخول. تحقق من بيانات الدخول.');
  }

  redirect(next);
}

export async function registerAction(formData: FormData) {
  const email = requireField(String(formData.get('email') || ''), 'البريد الإلكتروني');
  const password = requireField(String(formData.get('password') || ''), 'كلمة المرور');

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo:
        process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
        `${process.env.NEXT_PUBLIC_SITE_URL || ''}/auth/callback`,
    },
  });

  if (error) {
    throw new Error(error.message || 'تعذر إنشاء الحساب.');
  }

  redirect('/auth/login');
}

export async function forgotAction(formData: FormData) {
  const email = requireField(String(formData.get('email') || ''), 'البريد الإلكتروني');

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo:
      process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
      `${process.env.NEXT_PUBLIC_SITE_URL || ''}/auth/callback`,
  });

  if (error) {
    throw new Error(error.message || 'تعذر إرسال رابط إعادة تعيين كلمة المرور.');
  }

  redirect('/auth/login');
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}

export async function updateProfileAction(formData: FormData) {
  const displayName = String(formData.get('displayName') || '').trim();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  await supabase
    .from('profiles')
    .update({ display_name: displayName || null, updated_at: new Date().toISOString() })
    .eq('id', user.id);

  redirect('/profile');
}
