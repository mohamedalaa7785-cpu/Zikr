/**
 * Next.js Middleware entry point.
 *
 * Next.js 16 requires the middleware export to live at `middleware.ts` in the
 * project root.  All logic lives in `proxy.ts`; this file simply re-exports it
 * so the runtime can discover and invoke the handler.
 *
 * IMPORTANT: Do NOT move route-protection or Supabase session-refresh logic
 * here — keep it in proxy.ts so it stays testable and separated from the
 * Next.js convention file.
 */
export { proxy as middleware, config } from './proxy';
