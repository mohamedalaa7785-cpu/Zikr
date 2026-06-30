import { Container } from '@/components/ui/container';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className='mt-24 border-t border-brand-gold/10 py-20 bg-black relative overflow-hidden'>
      <div className="absolute inset-0 bg-[url('/branding/pattern.svg')] opacity-[0.02] pointer-events-none" />
      <Container className='grid gap-12 md:grid-cols-4 relative'>
        <div className='space-y-6 col-span-1 md:col-span-1'>
          <h3 className='text-2xl font-bold text-brand-gold'>ZIKR | ذِكرٌ</h3>
          <p className='text-sm leading-relaxed text-brand-cream/60'>منصة روحانية شاملة تهدف لربط المسلم بكتاب الله وسنة رسوله ﷺ عبر تجربة تقنية حديثة، فاخرة، وميسرة للجميع.</p>
          <div className="flex gap-4 pt-2">
            <span className="text-2xl grayscale hover:grayscale-0 cursor-pointer transition-all">🕌</span>
            <span className="text-2xl grayscale hover:grayscale-0 cursor-pointer transition-all">📜</span>
            <span className="text-2xl grayscale hover:grayscale-0 cursor-pointer transition-all">✨</span>
          </div>
        </div>
        
        <div className='space-y-6'>
          <h3 className='text-sm font-bold text-brand-gold uppercase tracking-widest'>أقسام المنصة</h3>
          <ul className='space-y-3 text-sm'>
            <li><Link href='/quran' className='text-brand-cream/60 hover:text-brand-gold transition-colors'>القرآن الكريم</Link></li>
            <li><Link href='/hadith' className='text-brand-cream/60 hover:text-brand-gold transition-colors'>الأحاديث النبوية</Link></li>
            <li><Link href='/adhkar' className='text-brand-cream/60 hover:text-brand-gold transition-colors'>حصن المسلم</Link></li>
            <li><Link href='/seerah' className='text-brand-cream/60 hover:text-brand-gold transition-colors'>السيرة النبوية</Link></li>
            <li><Link href='/prophets' className='text-brand-cream/60 hover:text-brand-gold transition-colors'>قصص الأنبياء</Link></li>
            <li><Link href='/scholars' className='text-brand-cream/60 hover:text-brand-gold transition-colors'>تراجم العلماء</Link></li>
          </ul>
        </div>

        <div className='space-y-6'>
          <h3 className='text-sm font-bold text-brand-gold uppercase tracking-widest'>أدوات ذكية</h3>
          <ul className='space-y-3 text-sm'>
            <li><Link href='/prayer' className='text-brand-cream/60 hover:text-brand-gold transition-colors'>مواقيت الصلاة</Link></li>
            <li><Link href='/memorization' className='text-brand-cream/60 hover:text-brand-gold transition-colors'>مساعد الحفظ</Link></li>
            <li><Link href='/ruqyah' className='text-brand-cream/60 hover:text-brand-gold transition-colors'>الرقية الشرعية</Link></li>
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
