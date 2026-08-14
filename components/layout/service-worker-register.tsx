'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if service workers are supported. Registering in preview as well
    // lets users verify notification behavior before deployment.

    if (!('serviceWorker' in navigator)) {
      return;
    }

    let updateInterval: NodeJS.Timeout | null = null;
    let registration: ServiceWorkerRegistration | null = null;

    const registerServiceWorker = async () => {
      try {
        registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
          updateViaCache: 'none'
        });

        // Check for updates periodically
        updateInterval = setInterval(() => {
          registration?.update();
        }, 60000); // Check every minute

        // Listen for new service worker
        const handleUpdateFound = () => {
          const newWorker = registration?.installing;
          if (!newWorker) return;

          const handleStateChange = () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker is ready, but do not prompt by default
              console.log('[PWA] Service Worker updated');
            }
          };

          newWorker.addEventListener('statechange', handleStateChange);
        };

        registration.addEventListener('updatefound', handleUpdateFound);
      } catch (error) {
        // Silently fail in development; log only if needed for debugging
        if (process.env.NODE_ENV === 'production') {
          console.error('[PWA] Service Worker registration failed:', error);
        }
      }
    };

    // Register after page load
    if (document.readyState === 'complete') {
      registerServiceWorker();
    } else {
      window.addEventListener('load', () => {
        registerServiceWorker();
      });
    }

    return () => {
      if (updateInterval) {
        clearInterval(updateInterval);
      }
    };
  }, []);

  return null;
}
