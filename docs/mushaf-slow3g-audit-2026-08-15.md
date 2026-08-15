# Mushaf and Slow 3G Audit — 2026-08-15

## Mushaf route

The canonical Mushaf page is implemented at `app/mushaf/page.tsx`, uses the route `/mushaf`, and is live at https://zikrmediaofficial.vercel.app/mushaf. It renders the title `المصحف الشريف`, states 114 surahs and 6236 ayahs, links to `/quran`, and delegates the surah catalogue to `app/quran/page.tsx`. The production browser opened `/mushaf` successfully and displayed the surah search and catalogue.

The Service Worker static shell explicitly includes `/mushaf`, `/quran`, `/prayer-times`, `/adhkar`, and other core routes. Its current cache name is `zikr-v7`. It network-first caches same-origin HTML and selected public content APIs, falls back to cached HTML/offline.html for failed HTML requests, and leaves authenticated APIs, external media, audio, and video requests network-only.

## Slow 3G test design

The test must cover first load with a deliberately delayed network, Service Worker registration after the performance delay, retry behavior when the connection is initially unsuitable, cache population and offline fallback for `/mushaf` and `/quran`, the `SHOW_PRAYER_NOTIFICATION` and `SHOW_DHIKR_NOTIFICATION` client messages, encrypted Web Push fallback behavior, notification click routing, and absence of duplicate registrations or duplicate hydration attempts. Browser notification display cannot be fully confirmed in a headless environment without a real permission-capable browser profile; event dispatch and Service Worker handler completion can still be tested with controlled mocks.

## Performance improvements that do not touch Offline files

Safe next improvements include reducing global client JavaScript by moving more static shell UI to Server Components, loading the star canvas only after idle or disabling it on low-end/slow devices, replacing repeated inline SVG/large global client dependencies where measurable, reserving fixed space for the install prompt rather than mounting it late, and reducing third-party script scope. These should be implemented only after the Slow 3G and notification behavior is verified. Offline JSON files must remain unchanged.
