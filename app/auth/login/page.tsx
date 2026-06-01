'use client';

import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { loginAction } from '../actions';
import { GoogleOAuthButton } from '../google-oauth-button';
import { useSearchParams } from 'next/navigation';

function LoginForm() {
  const searchParams = useSearchParams();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <div className="text-center py-10">جاري التحميل...</div>;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
    }
  }, [searchParams]);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError('');
    try {
      await loginAction(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في عملية الدخول. تحقق من بيانات الدخول.');
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto max-w-md space-y-6 text-right">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-brand-gold">تسجيل الدخول</h1>
        <p className="text-sm arabic-muted">مرحباً بك في ذِكر - منصتك الروحانية</p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-center">
          <p className="text-sm text-red-300 font-medium">{error}</p>
          <p className="text-xs text-red-400 mt-2">تأكد من صحة البريد الإلكتروني وكلمة المرور</p>
        </div>
      )}

      <form action={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">البريد الإلكتروني</label>
          <input
            id="email"
            name="email"
            dir="ltr"
            type="email"
            required
            disabled={loading}
            placeholder="email@example.com"
            className="w-full rounded-lg border border-brand-gold/20 bg-black/20 p-3 text-brand-cream placeholder:text-brand-cream/40 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium">كلمة المرور</label>
          <input
            id="password"
            name="password"
            dir="ltr"
            type="password"
            required
            disabled={loading}
            placeholder="••••••••"
            className="w-full rounded-lg border border-brand-gold/20 bg-black/20 p-3 text-brand-cream placeholder:text-brand-cream/40 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold disabled:opacity-50"
          />
        </div>

        <div className="text-right">
          <Link href="/auth/forgot" className="text-sm text-brand-gold hover:underline">
            نسيت كلمة المرور؟
          </Link>
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'جاري الدخول...' : 'دخول'}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-brand-gold/20"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-brand-emeraldDeep px-4 arabic-muted">أو</span>
        </div>
      </div>

      {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? (
        <GoogleOAuthButton next={searchParams.get('next') || undefined} label="المتابعة باستخدام Google" />
      ) : (
        <p className="text-center text-xs text-brand-gold/50 italic">تسجيل الدخول عبر Google غير متوفر حالياً</p>
      )}

      <p className="text-center text-sm arabic-muted">
        ليس لديك حساب؟{' '}
        <Link href="/auth/register" className="text-brand-gold hover:underline">
          إنشاء حساب جديد
        </Link>
      </p>
    </Card>
  );
}

export default function Page() {
  return (
    <Container className="py-16">
      <Suspense fallback={<div>جاري التحميل...</div>}>
        <LoginForm />
      </Suspense>
    </Container>
  );
}
