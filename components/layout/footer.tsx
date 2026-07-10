import { Container } from '@/components/ui/container';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { BookOpen, Scroll, Star } from 'lucide-react';

const FACEBOOK_PAGE_URL = 'https://www.facebook.com/share/1GsRPxEb8J';

export function Footer() {
  return (
    <footer className='mt-24 border-t border-brand-gold/10 py-20 bg-black relative overflow-hidden'>
      <div className="absolute inset-0 bg-[url('/branding/pattern.svg')] opacity-[0.02] pointer-events-none" />
      <Container className='grid gap-12 md:grid-cols-4 relative'>
        <div className='space-y-6 col-span-1 md:col-span-1'>
          <h3 className='text-2xl font-bold text-brand-gold'>ZIKR | ذِكرٌ</h3>
          <p className='text-sm leading-relaxed text-brand-cream/60'>منصة روحانية شاملة تهدف لربط المسلم بكتاب الله وسنة رسوله ﷺ عبر تجربة تقنية حديثة، فاخرة، وميسرة للجميع.</p>
          <div className="flex gap-4 pt-2 items-center">
            <BookOpen className="h-5 w-5 text-brand-gold/40 hover:text-brand-gold/80 cursor-pointer transition-colors" />
            <Scroll className="h-5 w-5 text-brand-gold/40 hover:text-brand-gold/80 cursor-pointer transition-colors" />
            <Star className="h-5 w-5 text-brand-gold/40 hover:text-brand-gold/80 cursor-pointer transition-colors" />
            <a
              href={FACEBOOK_PAGE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="صفحة الفيسبوك"
              className="text-brand-gold/40 hover:text-brand-gold/80 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.883v2.252h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
              </svg>
            </a>
          </div>
        </div>
        
        <div className='space-y-6'>
          <h3 className='text-sm font-bold text-brand-gold uppercase tracking-widest'>أقسام المنصة</h3>
          <ul className='space-y-3 text-sm'>
            <li><Link href='/quran' className='text-brand-cream/60 hover:text-brand-gold transition-colors'>القرآن الكريم</Link></li>
            <li><Link href='/hadith' className='text-brand-cream/60 hover:text-brand-gold transition-colors'>الأحاديث النبوية</Link></li>
            <li><Link href='/adhkar' className='text-brand-cream/60 hover:text-brand-gold transition-colors'>حصن المسلم</Link></li>
            <li><Link href='/prophets' className='text-brand-cream/60 hover:text-brand-gold transition-colors'>قصص الأنبياء</Link></li>
            <li><Link href='/scholars' className='text-brand-cream/60 hover:text-brand-gold transition-colors'>تراجم العلماء</Link></li>
          </ul>
        </div>

        <div className='space-y-6'>
          <h3 className='text-sm font-bold text-brand-gold uppercase tracking-widest'>أدوات ذكية</h3>
          <ul className='space-y-3 text-sm'>
            <li><Link href='/prayer-times' className='text-brand-cream/60 hover:text-brand-gold transition-colors'>مواقيت الصلاة</Link></li>
            <li><Link href='/memorization' className='text-brand-cream/60 hover:text-brand-gold transition-colors'>مساعد الحفظ</Link></li>
            <li><Link href='/spiritual-ai' className='text-brand-cream/60 hover:text-brand-gold transition-colors'>الرفيق الروحاني AI</Link></li>
            <li><Link href='/poetry' className='text-brand-cream/60 hover:text-brand-gold transition-colors'>ديوان الشعر</Link></li>
            <li><Link href='/search' className='text-brand-cream/60 hover:text-brand-gold transition-colors'>البحث الشامل</Link></li>
          </ul>
        </div>

        <div className='space-y-6'>
          <h3 className='text-sm font-bold text-brand-gold uppercase tracking-widest'>قانوني وتقني</h3>
          <ul className='space-y-3 text-sm'>
            <li><Link href='/about' className='text-brand-cream/60 hover:text-brand-gold transition-colors'>عن المنصة</Link></li>
            <li><Link href='/privacy' className='text-brand-cream/60 hover:text-brand-gold transition-colors'>سياسة الخصوصية</Link></li>
            <li><Link href='/terms' className='text-brand-cream/60 hover:text-brand-gold transition-colors'>الشروط والأحكام</Link></li>
            <li><Link href='/auth/login' className='text-brand-cream/60 hover:text-brand-gold transition-colors'>حسابي</Link></li>
            <li>
              <a href={FACEBOOK_PAGE_URL} target="_blank" rel="noopener noreferrer" className='text-brand-cream/60 hover:text-brand-gold transition-colors'>
                صفحة الفيسبوك
              </a>
            </li>
            <li className="pt-4">
              <Badge variant="outline" className="border-brand-gold/20 text-brand-gold/40 text-[10px]">Version 1.2.0-stable</Badge>
            </li>
          </ul>
        </div>
      </Container>
      
      <Container className='mt-20 border-t border-brand-gold/10 pt-10 text-center text-xs text-brand-cream/30 relative'>
        <p dir="rtl">© {new Date().getFullYear()} ZIKR | ذِكرٌ — صُنع بحب لخدمة الأمة الإسلامية. جميع الحقوق محفوظة.</p>
      </Container>
    </footer>
  );
}
