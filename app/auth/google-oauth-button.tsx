'use client';

import { useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { buildOAuthRedirectUri } from '@/lib/auth-enhanced';
import { Button } from '@/components/ui/button';

export function GoogleOAuthButton({ next, label }: { next?: string; label: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onClick = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build redirect URI with validation
      const redirectUri = buildOAuthRedirectUri(window.location.origin, next);
      
      // Attempt OAuth login
      const client = createBrowserSupabaseClient();
      if (!client.auth) {
        throw new Error('خادم المصادقة غير متاح. تأكد من تكوين Supabase.');
      }
      
      await client.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: redirectUri },
      });
    } catch (err) {
      setLoading(false);
      const message = err instanceof Error ? err.message : 'تعذر تسجيل الدخول عبر Google. حاول مرة أخرى.';
      setError(message);
      console.error('[oauth] Google login failed:', message);
    }
  };

  return (
    <div className='space-y-2'>
      <Button 
        type='button' 
        variant='secondary' 
        className='w-full' 
        onClick={onClick} 
        disabled={loading}
      >
        {loading ? 'جارٍ التوجيه إلى Google...' : label}
      </Button>
      {error && (
        <div className='rounded-lg bg-red-500/10 border border-red-500/20 p-3'>
          <p className='text-sm text-red-300'>{error}</p>
          <p className='text-xs text-red-400 mt-1'>تأكد من تفعيل Google OAuth في إعدادات Supabase</p>
        </div>
      )}
    </div>
  );
}
