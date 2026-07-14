'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getServerEnv } from '@/lib/env';
 codex/fix-google-login-to-open-profile-5i6owf
import { buildOAuthRedirectUri, extractNextPath } from '@/lib/auth-enhanced';

 Zikr

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


// ─── Google OAuth ─────────────────────────────────────────────────────────────
export async function googleOAuthAction(formData: FormData) {
  const rawNext = String(formData.get('next') || '/profile');
  const next = extractNextPath(new URLSearchParams({ next: rawNext }));
  const requestOrigin = (await headers()).get('origin');
  const siteUrl = requestOrigin || getServerEnv().NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const redirectTo = buildOAuthRedirectUri(siteUrl, next);

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      scopes: 'email profile',
    },
  });

  if (error) {
    const msg = encodeURIComponent(error.message || 'تعذر تسجيل الدخول عبر Google. حاول مرة أخرى.');
    redirect(`/auth/login?error=${msg}`);
  }

  if (data.url) {
    redirect(data.url);
  }

  redirect('/auth/login?error=oauth_url_missing');
}

// ─── Register ─────────────────────────────────────────────────────────────────
export async function registerAction(formData: FormData) {
  const email = String(formData.get('email') || '');
  const password = String(formData.get('password') || '');

  const supabase = await createClient();
  const requestOrigin = (await headers()).get('origin');
  const siteUrl = requestOrigin || getServerEnv().NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback?next=/profile`,
    },
  });

  if (error) {
    const msg = encodeURIComponent(error.message);
    redirect(`/auth/register?error=${msg}`);
  }

  if (data.user && data.session) {
    await supabase.from('profiles').upsert({
      id: data.user.id,
      email: data.user.email ?? email,
      display_name:
        typeof data.user.user_metadata?.full_name === 'string'
          ? data.user.user_metadata.full_name
          : null,
      avatar_url:
        typeof data.user.user_metadata?.avatar_url === 'string'
          ? data.user.user_metadata.avatar_url
          : null,
      updated_at: new Date().toISOString(),
    });

    redirect('/profile');
  }

  // If email confirmation is enabled, the session is created after the user
  // clicks the confirmation link, which points back to /profile.
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
  const avatarUrl = String(formData.get('avatarUrl') || '').trim();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  // Only allow http(s) URLs for the avatar to avoid javascript:/data: injection
  const safeAvatarUrl = /^https?:\/\//i.test(avatarUrl) ? avatarUrl : null;

  await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      display_name: displayName || null,
      avatar_url: safeAvatarUrl,
      updated_at: new Date().toISOString(),
    });

  redirect('/profile');
}
