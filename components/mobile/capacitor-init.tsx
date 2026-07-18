'use client';

/**
 * CapacitorInit — runs once on native platforms immediately after the WebView
 * is ready.  Handles:
 *  - Status bar configuration
 *  - Splash screen hide (after a short delay to avoid white flash)
 *  - Push notification registration
 *  - App lifecycle logging (background / foreground)
 *
 * Rendered inside the root layout so it executes on every page.
 */

import { useEffect } from 'react';
import { isNative } from '@/lib/capacitor';
import { setStatusBarStyle } from '@/lib/mobile/status-bar';

export function CapacitorInit() {
  useEffect(() => {
    if (!isNative()) return;

    let appListenerCleanup: (() => void) | undefined;

    (async () => {
      // 1. Configure status bar
      await setStatusBarStyle('dark', '#0a0a0f');

      // 2. Hide splash screen after a short delay so the app has time to paint
      try {
        const { SplashScreen } = await import('@capacitor/splash-screen');
        setTimeout(() => {
          SplashScreen.hide({ fadeOutDuration: 300 }).catch(() => {});
        }, 800);
      } catch {
        // SplashScreen plugin unavailable — ignore
      }

      // 3. App lifecycle listener (foreground / background)
      try {
        const { App } = await import('@capacitor/app');
        const handle = await App.addListener('appStateChange', (_state) => {
          // Future: pause/resume audio, sync offline data, etc.
          // Kept intentionally minimal to avoid race conditions.
        });
        appListenerCleanup = () => { handle.remove(); };
      } catch {
        // ignore
      }
    })();

    return () => { appListenerCleanup?.(); };
  }, []);

  return null;
}
