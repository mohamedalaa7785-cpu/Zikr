import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { registerAction } from '../actions';
import { GoogleOAuthButton } from '../google-oauth-button';

export default async function Page({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const params = await searchParams;
  
  return (
    <Container className="py-16">
      <Card className="mx-auto max-w-md space-y-6 text-right">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-brand-gold">إنشاء حساب جديد</h1>
          <p className="text-sm arabic-muted">انضم إلى ذِكر واستمتع بتجربة روحانية متميزة</p>
        </div>
        
        {params.error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-center">
            <p className="text-sm text-red-300">{decodeURIComponent(params.error)}</p>
          </div>
        )}
        
        <form action={registerAction} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">البريد الإلكتروني</label>
            <input 
              id="email"
              name="email" 
              dir="ltr" 
              type="email" 
              required 
              placeholder="email@example.com"
              className="w-full rounded-lg border border-brand-gold/20 bg-black/20 p-3 text-brand-cream placeholder:text-brand-cream/40 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold"
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
              minLength={6}
              placeholder="********"
              className="w-full rounded-lg border border-brand-gold/20 bg-black/20 p-3 text-brand-cream placeholder:text-brand-cream/40 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold"
            />
            <p className="text-xs arabic-muted">يجب أن تكون كلمة المرور 6 أحرف على الأقل</p>
          </div>
          
          <Button type="submit" className="w-full">
            إنشاء الحساب
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
        
        <GoogleOAuthButton next={params.next} label="إنشاء حساب عبر Google" />
        
        <p className="text-center text-sm arabic-muted">
          لديك حساب بالفعل؟{' '}
          <Link href="/auth/login" className="text-brand-gold hover:underline">
            تسجيل الدخول
          </Link>
        </p>
      </Card>
    </Container>
  );
}
