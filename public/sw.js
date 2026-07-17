// Enhanced Service Worker for Zikr PWA
// Supports full offline access with intelligent caching, background sync, and periodic updates

const CACHE_VERSION = 5;
const CACHE_NAME = `zikr-v${CACHE_VERSION}`;
const STATIC_CACHE = `zikr-static-v${CACHE_VERSION}`;
const DYNAMIC_CACHE = `zikr-dynamic-v${CACHE_VERSION}`;

// Core app shell - must always work offline
const APP_SHELL = [
  '/',
  '/offline.html',
  '/manifest.webmanifest',
  '/icon-192x192.png',
  '/icon-512x512.png',
];

// Core content pages for offline access
const STATIC_PAGES = [
  '/quran',
  '/adhkar',
  '/dua',
  '/hadith',
  '/prayer-times',
  '/tasbeeh',
  '/wird',
  '/zakat',
  '/settings',
  '/about',
  '/privacy',
  '/terms',
  '/faq',
  '/qibla',
  '/tafsir',
  '/scholars',
  '/radio',
  '/platform',
];

// CSS and critical JS files
const CRITICAL_ASSETS = [
  '/globals.css',
];

// ===== INSTALL: Pre-cache app shell and critical pages =====
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    (async () => {
      try {
        // Cache app shell
        const shellCache = await caches.open(STATIC_CACHE);
        await shellCache.addAll(APP_SHELL).catch(() => {
          console.warn('[SW] Some app shell items failed to cache (normal for redirects)');
        });

        // Cache static pages
        const pageCache = await caches.open(DYNAMIC_CACHE);
        for (const page of STATIC_PAGES) {
          pageCache.add(page).catch(() => {
            console.warn(`[SW] Failed to cache ${page}`);
          });
        }

        console.log('[SW] Install complete - app is now available offline');
        self.skipWaiting();
      } catch (err) {
        console.error('[SW] Install error:', err);
      }
    })()
  );
});

// ===== ACTIVATE: Clean up old caches =====
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      
      // Delete old versioned caches
      await Promise.all(
        cacheNames
          .filter((name) => name.startsWith('zikr-') && !name.includes(`v${CACHE_VERSION}`))
          .map((name) => {
            console.log(`[SW] Deleting old cache: ${name}`);
            return caches.delete(name);
          })
      );

      self.clients.claim();
      console.log('[SW] Activate complete');
    })()
  );
});

// ===== FETCH: Intelligent caching strategy =====
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests (external CDNs, external APIs)
  if (url.origin !== self.location.origin) {
    // Still try to cache external resources for offline support
    if (request.destination === 'image' || request.destination === 'font') {
      event.respondWith(
        fetch(request)
          .then((response) => {
            if (response.status === 200) {
              const cache = caches.open(DYNAMIC_CACHE);
              cache.then((c) => c.put(request, response.clone()));
            }
            return response;
          })
          .catch(() => {
            // Return placeholder for failed external images
            if (request.destination === 'image') {
              return new Response(
                '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="#072E2A" width="100" height="100"/></svg>',
                { headers: { 'Content-Type': 'image/svg+xml' } }
              );
            }
            return new Response('', { status: 503 });
          })
      );
    }
    return;
  }

  // Skip audio/video - they need native range request handling
  if (request.destination === 'audio' || request.destination === 'video') {
    return;
  }

  // Skip tracking scripts
  if (request.destination === 'script' &&
      (url.hostname.includes('google-analytics') ||
       url.hostname.includes('googletagmanager') ||
       url.hostname.includes('pagead') ||
       url.hostname.includes('doubleclick'))) {
    return;
  }

  // API calls - network first with offline fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful API responses for offline access
          if (response.status === 200 && response.headers.get('content-type')?.includes('json')) {
            const cache = caches.open(DYNAMIC_CACHE);
            cache.then((c) => c.put(request, response.clone()));
          }
          return response;
        })
        .catch(() => {
          // Try to return cached API response
          return caches.match(request).then((cached) => {
            if (cached) {
              return cached;
            }
            // Return offline error response
            return new Response(
              JSON.stringify({ error: 'Offline - data not cached', offline: true }),
              {
                status: 503,
                headers: { 'Content-Type': 'application/json' }
              }
            );
          });
        })
    );
    return;
  }

  // Auth routes - network only (never cache)
  if (url.pathname.startsWith('/auth/')) {
    return;
  }

  // HTML pages - network first, fallback to cache
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful HTML responses
          if (response.status === 200) {
            const cache = caches.open(DYNAMIC_CACHE);
            cache.then((c) => c.put(request, response.clone()));
          }
          return response;
        })
        .catch(() => {
          // Fallback to cached version or offline page
          return caches.match(request).then((cached) => {
            if (cached) {
              return cached;
            }
            return caches.match('/offline.html').then((offline) => {
              return offline || new Response('Offline', { status: 503 });
            });
          });
        })
    );
    return;
  }

  // CSS/JS - Cache first, network fallback
  if (request.destination === 'style' || request.destination === 'script') {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) {
          return cached;
        }

        return fetch(request)
          .then((response) => {
            if (response.status === 200) {
              const cache = caches.open(DYNAMIC_CACHE);
              cache.then((c) => c.put(request, response.clone()));
            }
            return response;
          })
          .catch(() => {
            return new Response('Asset unavailable', { status: 503 });
          });
      })
    );
    return;
  }

  // Images/fonts - Cache first, network fallback
  if (request.destination === 'image' || request.destination === 'font') {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) {
          return cached;
        }

        return fetch(request)
          .then((response) => {
            if (response.status === 200) {
              const cache = caches.open(DYNAMIC_CACHE);
              cache.then((c) => c.put(request, response.clone()));
            }
            return response;
          })
          .catch(() => {
            // Return placeholder SVG for missing images
            if (request.destination === 'image') {
              return new Response(
                '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="#072E2A" width="100" height="100"/></svg>',
                { headers: { 'Content-Type': 'image/svg+xml' } }
              );
            }
            return new Response('', { status: 503 });
          });
      })
    );
    return;
  }

  // Default - network first
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.status === 200) {
          const cache = caches.open(DYNAMIC_CACHE);
          cache.then((c) => c.put(request, response.clone()));
        }
        return response;
      })
      .catch(() => {
        return caches.match(request).catch(() => {
          return new Response('Resource unavailable offline', { status: 503 });
        });
      })
  );
});

// ===== MESSAGE HANDLER: Handle commands from clients =====
self.addEventListener('message', (event) => {
  const { data } = event;

  if (data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (data.type === 'CLEAR_CACHE') {
    caches.delete(DYNAMIC_CACHE).then(() => {
      console.log('[SW] Cache cleared');
    });
  }

  if (data.type === 'CACHE_URLS') {
    const urls = data.urls || [];
    caches.open(DYNAMIC_CACHE).then((cache) => {
      cache.addAll(urls).catch((err) => {
        console.warn('[SW] Failed to cache URLs:', err);
      });
    });
  }

  if (data.type === 'GET_CACHE_SIZE') {
    (async () => {
      let size = 0;
      const cacheNames = await caches.keys();
      for (const name of cacheNames) {
        const cache = await caches.open(name);
        const requests = await cache.keys();
        for (const req of requests) {
          const resp = await cache.match(req);
          if (resp) {
            size += resp.clone().blob().then((b) => b.size).catch(() => 0);
          }
        }
      }
      event.ports[0].postMessage({ size });
    })();
  }
});

// ===== PERIODIC BACKGROUND SYNC: Update cache periodically =====
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-content') {
    event.waitUntil(
      (async () => {
        try {
          // Refresh critical content
          const cache = await caches.open(DYNAMIC_CACHE);
          for (const page of STATIC_PAGES.slice(0, 5)) {
            await fetch(page)
              .then((response) => {
                if (response.status === 200) {
                  cache.put(page, response.clone());
                }
              })
              .catch(() => {
                // Offline - skip
              });
          }
          console.log('[SW] Background sync complete');
        } catch (err) {
          console.error('[SW] Sync error:', err);
        }
      })()
    );
  }
});

console.log('[SW] Service Worker loaded and ready for offline support');
