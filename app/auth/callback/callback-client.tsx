'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { setSessionAction } from '@/app/auth/actions';

function parseTokenFromHash() {
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  return hash.get('access_token');
}

export default function CallbackPage() {
  const router = useRouter();
  const search = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const next = useMemo(() => search.get('next') || '/profile', [search]);

  useEffect(() => {
    const run = async () => {
      try {
        const token = parseTokenFromHash();
        if (!token) throw new Error('تعذر إكمال تسجيل الدخول عبر Google.');
        await setSessionAction(token);
        router.replace(next);
      } catch (e) {
        const message = e instanceof Error ? e.message : 'حدث خطأ غير متوقع.';
        setError(message);
        router.replace(`/auth/login?error=${encodeURIComponent(message)}`);
      }
    };
    void run();
  }, [next, router]);

  return (
    <Container className='py-16'>
      <Card className='mx-auto max-w-md text-center space-y-2'>
        <p className='text-brand-gold'>جارٍ توثيق الحساب...</p>
        {error ? <p className='text-sm text-red-300'>{error}</p> : <p className='arabic-muted'>يرجى الانتظار لحظات.</p>}
      </Card>
    </Container>
  );
}
