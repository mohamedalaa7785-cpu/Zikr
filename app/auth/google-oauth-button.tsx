'use client';

import { useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { buildOAuthRedirectUri } from '@/lib/auth-enhanced';
import { Button } from '@/components/ui/button';

type GoogleOAuthButtonProps = {
  next?: string;
  label: string;
};

export function GoogleOAuthButton({ next, label }: GoogleOAuthButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onClick = async () => {
    setLoading(true);
    setError(null);

    try {
      const safeNext =
        typeof next === 'string' && next.startsWith('/') ? next : '/profile';

      const redirectUri = buildOAuthRedirectUri(window.location.origin, safeNext);
      const client = createBrowserSupabaseClient();

      const { error: oauthError } = await client.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUri,
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
      console.error('[oauth] Google login failed:', message);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="secondary"
        className="w-full"
        onClick={onClick}
        disabled={loading}
      >
        {loading ? 'جارٍ التوجيه إلى Google...' : label}
      </Button>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3">
          <p className="text-sm text-red-300">{error}</p>
          <p className="mt-1 text-xs text-red-400">
            تأكد من تفعيل Google OAuth في إعدادات Supabase
          </p>
        </div>
      )}
    </div>
  );
}
  return (
    <div className='space-y-2'>
      <Button 
        type='button' 
        variant='secondary' 
        className='w-full' 
        onClick={onClick} 
        disabled={loading}
      >
        {loading ? 'جارٍ التوجيه إلى Google...' : label}
      </Button>
      {error && (
        <div className='rounded-lg bg-red-500/10 border border-red-500/20 p-3'>
          <p className='text-sm text-red-300'>{error}</p>
          <p className='text-xs text-red-400 mt-1'>تأكد من تفعيل Google OAuth في إعدادات Supabase</p>
        </div>
      )}
    </div>
  );
}
