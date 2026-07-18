'use client';

/**
 * AppUrlListener — handles deep links on native (Capacitor) platforms.
 *
 * On Android and iOS, the Supabase OAuth flow redirects back to the app via
 * the custom scheme `zikr://auth/callback?code=...&next=...`.  This component
 * listens for the `appUrlOpen` event and manually exchanges the PKCE code for
 * a Supabase session by forwarding the URL to /auth/callback as a same-origin
 * fetch, then navigates to the intended `next` path.
 *
 * Rendering this component anywhere inside the root layout ensures the
 * listener is always active without blocking the web render path.
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isNative, getApp } from '@/lib/capacitor';

export function AppUrlListener() {
  const router = useRouter();

  useEffect(() => {
    if (!isNative()) return;

    let cleanup: (() => void) | undefined;

    (async () => {
      try {
        const App = await getApp();
        const handle = await App.addListener('appUrlOpen', async (data) => {
          const url = data.url;
          if (!url) return;

          // Only handle our custom deep-link scheme
          if (!url.startsWith('zikr://')) return;

          // Convert zikr://auth/callback?... → /auth/callback?...
          // We forward the query string to the Next.js route handler which
          // performs the actual code exchange with Supabase.
          try {
            const parsed = new URL(url.replace('zikr://', 'https://zikr.app/'));
            const path = parsed.pathname;
            const search = parsed.search;

            // Navigate to the Next.js auth callback route — this triggers the
            // server-side exchangeCodeForSession handler in app/auth/callback/route.ts
            router.replace(`${path}${search}`);
          } catch {
            // Malformed URL — redirect to login
            router.replace('/auth/login?error=deep_link_failed');
          }
        });

        cleanup = () => { handle.remove(); };
      } catch {
        // App plugin unavailable — ignore
      }
    })();

    return () => { cleanup?.(); };
  }, [router]);

  // This component renders nothing — it's purely a side-effect listener
  return null;
}
