'use client';

 codex/fix-google-login-to-open-profile-5i6owf
import { useFormStatus } from 'react-dom';
import { googleOAuthAction } from './actions';
=======
import { useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { buildOAuthRedirectUri } from '@/lib/auth-enhanced';
 Zikr
import { Button } from '@/components/ui/button';

type GoogleOAuthButtonProps = {
  next?: string;
  label: string;
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="secondary"
      className="w-full"
      disabled={pending}
    >
      {pending ? 'جارٍ التوجيه إلى Google...' : label}
    </Button>
  );
}

export function GoogleOAuthButton({
  next,
  label,
}: GoogleOAuthButtonProps) {
 codex/fix-google-login-to-open-profile-5i6owf
  const safeNext =
    typeof next === 'string' && next.startsWith('/') && !next.startsWith('//')
      ? next
      : '/profile';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onClick = async () => {
    setLoading(true);
    setError(null);

    try {
      const safeNext =
        typeof next === 'string' && next.startsWith('/')
          ? next
          : '/profile';

      // Use the current origin so Supabase's PKCE verifier cookie is written
      // and then read back on the same domain during /auth/callback.
      const siteUrl =
        typeof window !== 'undefined' ? window.location.origin : '';

      const redirectUri = buildOAuthRedirectUri(siteUrl, safeNext);

      const client = createBrowserSupabaseClient();

      const { error: oauthError } =
        await client.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: redirectUri,
            scopes: 'email profile',
          },
        });

      if (oauthError) {
        throw oauthError;
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'تعذر تسجيل الدخول عبر Google. حاول مرة أخرى.';

      setError(message);
      setLoading(false);

      console.error(
        '[oauth] Google login failed:',
        message
      );
    }
  };
 Zikr

  return (
    <form action={googleOAuthAction} className="space-y-2">
      <input type="hidden" name="next" value={safeNext} />
      <SubmitButton label={label} />
    </form>
  );
}
