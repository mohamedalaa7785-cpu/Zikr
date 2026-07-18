/**
 * Next.js Middleware entry point.
 *
 * Next.js 16 requires the middleware export to live at `middleware.ts` in the
 * project root. All logic lives in `lib/supabase/middleware.ts`; this file
 * simply re-exports it so the runtime can discover and invoke the handler.
 */
export { proxy as middleware, config } from './proxy';
