# Next.js Migration Status (Phase 1)

This repository now includes a Next.js App Router baseline under `app/` for the ZIKR rebrand foundation:

- `app/layout.tsx`
- `app/page.tsx`
- `app/globals.css`
- `app/manifest.ts`
- `app/robots.ts`
- `app/sitemap.ts`
- `next.config.ts`

## Current state

- Existing Vite/Express runtime is still present and remains the active production path.
- Next.js files are prepared for gradual migration to avoid route breakage.
- SEO/PWA primitives now exist both in legacy and Next scaffolding.

## Next migration steps

1. Move each `client/src/pages/*` route into `app/*` route segments.
2. Replace `wouter` navigation with `next/link` and `next/navigation`.
3. Move API endpoints from Express routes to Next Route Handlers where appropriate.
4. Retire legacy `client/index.html` metadata once Next becomes primary renderer.
