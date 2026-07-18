'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[global-error]', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });
  }, [error]);

  return (
    <html lang="ar" dir="rtl">
      <body className="font-arabic antialiased bg-black min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-brand-emeraldDeep border border-brand-gold/20 rounded-2xl p-8 text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-brand-gold">حدث خطأ ما</h1>
            <p className="text-sm text-brand-cream/60">
              عذراً، حدث خطأ غير متوقع في التطبيق
            </p>
          </div>

          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-left">
            <p className="text-xs text-red-300 font-mono break-words">
              {error.message || 'Unknown error'}
            </p>
            {error.digest && (
              <p className="text-xs text-red-400 mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <button
              onClick={reset}
              className="w-full inline-flex items-center justify-center rounded-xl bg-brand-gold text-brand-emeraldDeep font-semibold px-5 py-2.5 text-sm transition hover:bg-brand-goldSoft"
            >
              حاول مرة أخرى
            </button>
            {/* global-error renders outside the Next.js tree — Link is unavailable here */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              className="w-full inline-flex items-center justify-center rounded-xl bg-brand-emerald text-brand-cream border border-brand-gold/50 font-semibold px-5 py-2.5 text-sm transition hover:bg-brand-emeraldDeep"
            >
              العودة للرئيسية
            </a>
          </div>

          <p className="text-xs text-brand-cream/40">
            إذا استمرت المشكلة، يرجى تحديث الصفحة أو التواصل مع الدعم
          </p>
        </div>
      </body>
    </html>
  );
}
