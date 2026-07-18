'use client';

import { useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { buildOAuthRedirectUri } from '@/lib/auth-enhanced';
import { isNative, getBrowser } from '@/lib/capacitor';
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

      const native = isNative();

      // On native the OAuth callback must use the custom deep-link scheme so
      // that Capacitor can intercept it and hand it back to the app.
      // On web we use the current browser origin so the PKCE cookie is on the
      // same domain as the /auth/callback route handler.
      const redirectBase = native
        ? 'zikr://auth/callback'
        : (typeof window !== 'undefined' ? window.location.origin : '');

      const redirectUri = native
        ? `${redirectBase}?next=${encodeURIComponent(safeNext)}`
        : buildOAuthRedirectUri(redirectBase, safeNext);

      const client = createBrowserSupabaseClient();

      if (native) {
        // On native, generate the OAuth URL without auto-redirecting the WebView.
        // Open it in an in-app browser tab via @capacitor/browser so the PKCE
        // verifier cookie is preserved and the custom scheme callback is caught.
        const { data, error: oauthError } = await client.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: redirectUri,
            scopes: 'email profile',
            queryParams: { access_type: 'offline', prompt: 'select_account' },
            skipBrowserRedirect: true,
          },
        });

        if (oauthError || !data.url) {
          throw oauthError ?? new Error('تعذر إنشاء رابط تسجيل الدخول');
        }

        const Browser = await getBrowser();
        await Browser.open({ url: data.url, presentationStyle: 'popover' });

        // AppUrlListener (components/mobile/app-url-listener.tsx) handles
        // the zikr://auth/callback deep link when the user returns.
        setLoading(false);
        return;
      }

      // Web: standard redirect flow
      const { error: oauthError } = await client.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUri,
          scopes: 'email profile',
          queryParams: { access_type: 'offline', prompt: 'consent' },
        },
      });

      if (oauthError) throw oauthError;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'تعذر تسجيل الدخول عبر Google. حاول مرة أخرى.';
      setError(message);
      setLoading(false);
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
