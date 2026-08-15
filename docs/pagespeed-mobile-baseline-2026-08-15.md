# Zikr Mobile PageSpeed Baseline — 2026-08-15

Source report: https://pagespeed.web.dev/analysis/https-zikrmediaofficial-vercel-app/fjpw06s5g2?hl=en&form_factor=mobile

The report was captured on 2026-08-15 at 06:59 UTC using Lighthouse 13.4.1, emulated Moto G Power, slow 4G, initial page load.

| Metric | Baseline |
|---|---:|
| Performance | 68 |
| Accessibility | 96 |
| Best Practices | 88 |
| SEO | 100 |
| First Contentful Paint | 0.9 s |
| Largest Contentful Paint | 2.6 s |
| Total Blocking Time | 530 ms |
| Cumulative Layout Shift | 0.312 |
| Speed Index | 2.2 s |
| Total network payload | 3,752 KiB |
| Main-thread work | 2.8 s |
| JavaScript execution | 1.3 s |
| Long tasks | 8 |

## Reported opportunities and diagnostics

The report identified render-blocking requests with estimated savings of 230 ms; layout shift culprits; a critical request dependency chain; inefficient cache lifetimes with estimated savings of 16 KiB; legacy JavaScript with estimated savings of 14 KiB; third-party code; unused JavaScript with estimated savings of 268 KiB; unused CSS with estimated savings of 11 KiB; excessive main-thread work; JavaScript execution time; an enormous network payload; and eight long main-thread tasks.

Best Practices also reported browser console errors/issues and a geolocation permission request on page load. Accessibility reported a contrast opportunity. SEO passed at 100.

## Initial code evidence

The root layout is force-dynamic because the navbar reads Supabase session cookies. It mounts SiteShell, Vercel Analytics, Speed Insights, Service Worker registration, native bridge, PWA prompts, prayer alerts, notification permission UI, and an idle-delayed AdSense/Funding Choices loader on every route. The homepage is a client component and contains an animated star canvas, a one-second clock interval, offline IndexedDB initialization, a client Supabase auth lookup, and an immediate geolocation request followed by an Aladhan prayer-time request. The homepage uses no obvious LCP image; the hero is text/gradient based.

Potential root causes to validate in the build and runtime include the large client graph caused by the client homepage and global client shell, immediate permission/geolocation work, third-party AdSense/analytics/Speed Insights execution, global client components, layout shift from late-mounted banners/prompts, and production cache/header behavior. Do not remove authentication, prayer calculations, notification behavior, or religious content; fixes must defer non-critical work and reserve layout space rather than replace functionality.

The PageSpeed API endpoint returned HTTP 429 during a direct re-fetch, so the supplied report and production/network inspection remain the authoritative baseline for this pass.

## Production inspection

The production homepage returned Brotli-compressed HTML, with `content-type: text/html`, `cache-control: private, no-cache, no-store, max-age=0, must-revalidate`, and `x-vercel-cache: MISS` at the inspection time. The HTML was approximately 90,031 bytes and referenced one CSS bundle plus multiple route/runtime JavaScript chunks. The downloaded route assets were approximately 1.0 MiB uncompressed before third-party resources; the largest JS chunks were about 252 KiB, 228 KiB, 156 KiB, and 113 KiB.

The live homepage was visually and semantically present, including Arabic RTL navigation, prayer times, search, content cards, and install prompt. The browser console view showed no console output during the inspection session, although PageSpeed had reported browser errors/issues in its own Lighthouse run. The homepage currently includes a visible install prompt near the bottom of the initial document and requests geolocation from the homepage prayer-time effect.

## Local production validation after first fixes

The local production build started successfully and the homepage rendered the full Arabic navigation, search form, prayer cards, location button, featured content, Quran statistics, CTA, footer, and install prompt. The newly added `موقعي` control is user-triggered rather than an automatic geolocation request. The browser console was empty on the local production page after hydration.
