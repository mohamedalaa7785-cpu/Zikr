'use client';

import { useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

export function GoogleOAuthButton({ next, label }: { next?: string; label: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onClick = async () => {
    try {
      setLoading(true);
      setError(null);
      const url = new URL('/auth/callback', window.location.origin);
      if (next) url.searchParams.set('next', next);
      await createBrowserSupabaseClient().auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: url.toString() },
      });
    } catch {
      setLoading(false);
      setError('تعذر تسجيل الدخول عبر Google. حاول مرة أخرى.');
    }
  };

  return (
    <div className='space-y-2'>
      <Button type='button' variant='secondary' className='w-full' onClick={onClick} disabled={loading}>
        {loading ? 'جارٍ التحويل إلى Google...' : label}
      </Button>
      {error ? <p className='text-sm text-red-300'>{error}</p> : null}
    </div>
  );
}
