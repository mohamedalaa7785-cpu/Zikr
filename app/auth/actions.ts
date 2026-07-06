'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

// ─── Login ────────────────────────────────────────────────────────────────────
// Uses the @supabase/ssr server client so that session cookies are written in
// Supabase's native chunked format and are visible to every server component
// that calls createClient().
export async function loginAction(formData: FormData) {
  const email = String(formData.get('email') || '');
  const password = String(formData.get('password') || '');
  const next = String(formData.get('next') || '/profile').replace(/^(?!\/)/, '/');

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const msg = encodeURIComponent(
      error.message === 'Invalid login credentials'
        ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة.'
        : error.message,
    );
    redirect(`/auth/login?error=${msg}`);
  }

  redirect(next);
}

// ─── Register ─────────────────────────────────────────────────────────────────
export async function registerAction(formData: FormData) {
  const email = String(formData.get('email') || '');
  const password = String(formData.get('password') || '');

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    const msg = encodeURIComponent(error.message);
    redirect(`/auth/register?error=${msg}`);
  }

  // Redirect to login with a confirmation notice
  redirect('/auth/login?message=check_email');
}

// ─── Forgot password ──────────────────────────────────────────────────────────
export async function forgotAction(formData: FormData) {
  const email = String(formData.get('email') || '');
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.AUTH_CALLBACK_URL ||
    'http://localhost:3000';

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/callback?next=/auth/reset`,
  });

  redirect('/auth/login?message=reset_sent');
}

// ─── Logout ───────────────────────────────────────────────────────────────────
export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}

// ─── Update profile ───────────────────────────────────────────────────────────
export async function updateProfileAction(formData: FormData) {
  const displayName = String(formData.get('displayName') || '').trim();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      display_name: displayName || null,
      updated_at: new Date().toISOString(),
    });

  redirect('/profile');
}
