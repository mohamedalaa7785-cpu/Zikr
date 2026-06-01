'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { setSessionAction } from '@/app/auth/actions';
import { validateOAuthResponse } from '@/lib/auth-enhanced';

function parseTokenFromHash() {
  try {
    return validateOAuthResponse(window.location.hash);
  } catch (error) {
    throw error instanceof Error ? error : new Error('حدث خطأ في معالجة رد الاتصال');
  }
}

export default function CallbackPage() {
  const router = useRouter();
  const search = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const next = useMemo(() => search.get('next') || '/profile', [search]);

  useEffect(() => {
    const run = async () => {
      try {
        const { accessToken, refreshToken } = parseTokenFromHash();
        
        if (!accessToken) {
          throw new Error('تعذر إكمال تسجيل الدخول عبر Google. يرجى المحاولة مرة أخرى.');
        }
        
        // Set session with token
        await setSessionAction(accessToken, refreshToken || undefined);
        
        // Redirect to next page or profile
        router.replace(next);
      } catch (e) {
        const message = e instanceof Error ? e.message : 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.';
        setError(message);
        setIsProcessing(false);
        
        // Redirect to login with error message after a short delay
        setTimeout(() => {
          router.replace(`/auth/login?error=${encodeURIComponent(message)}`);
        }, 2000);
      }
    };
    
    void run();
  }, [next, router]);

  return (
    <Container className='py-16'>
      <Card className='mx-auto max-w-md text-center space-y-2'>
        {isProcessing ? (
          <>
            <p className='text-brand-gold'>جارٍ توثيق الحساب...</p>
            <p className='arabic-muted'>يرجى الانتظار لحظات.</p>
          </>
        ) : (
          <>
            <p className='text-red-300 font-medium'>{error}</p>
            <p className='text-xs arabic-muted'>جاري إعادة التوجيه إلى صفحة الدخول...</p>
          </>
        )}
      </Card>
    </Container>
  );
}
