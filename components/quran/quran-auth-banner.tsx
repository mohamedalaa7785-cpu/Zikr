'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { ReadingProgressCard } from '@/components/quran/reading-progress-card';

/**
 * Renders client-side auth-aware UI for the Quran page header.
 * - Authenticated users: shows the ReadingProgressCard (continues reading).
 * - Unauthenticated users: shows the "إنشاء حساب مجاني" CTA.
 * - Resolves client-side to avoid hydration mismatch with SSR session state.
 */
export function QuranAuthBanner() {
  // null = not yet resolved, true/false = resolved
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsAuthenticated(!!user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Don't render anything until session is resolved — prevents flash of wrong state
  if (isAuthenticated === null) return null;

  if (isAuthenticated) {
    return <ReadingProgressCard />;
  }

  return (
    <Link
      href="/auth/register"
      className="inline-flex items-center justify-center rounded-xl bg-brand-gold/10 border border-brand-gold/20 px-6 py-2 text-sm font-bold text-brand-gold hover:bg-brand-gold/20 transition-colors"
    >
      أنشئ حساباً مجانياً لحفظ تقدمك
    </Link>
  );
}
