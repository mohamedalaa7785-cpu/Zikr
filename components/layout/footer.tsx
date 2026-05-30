import { Container } from '@/components/ui/container';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className='mt-20 border-t border-brand-gold/20 py-12 bg-brand-emeraldDeep/50'>
      <Container className='grid gap-8 md:grid-cols-3'>
        <div className='space-y-4'>
          <h3 className='text-lg font-bold text-brand-gold'>ZIKR | ذِكرٌ</h3>
          <p className='text-sm arabic-muted'>منصة روحانية شاملة تهدف لربط المسلم بكتاب الله وسنة رسوله ﷺ عبر تجربة تقنية حديثة وميسرة.</p>
        </div>
        
        <div className='space-y-4'>
          <h3 className='text-lg font-bold text-brand-gold'>روابط سريعة</h3>
          <ul className='grid grid-cols-2 gap-2 text-sm'>
            <li><Link href='/quran' className='hover:text-brand-gold transition-colors'>القرآن الكريم</Link></li>
            <li><Link href='/hadith' className='hover:text-brand-gold transition-colors'>الأحاديث النبوية</Link></li>
            <li><Link href='/prayer' className='hover:text-brand-gold transition-colors'>مواقيت الصلاة</Link></li>
            <li><Link href='/adhkar' className='hover:text-brand-gold transition-colors'>الأذكار</Link></li>
            <li><Link href='/scholars' className='hover:text-brand-gold transition-colors'>العلماء</Link></li>
            <li><Link href='/stories' className='hover:text-brand-gold transition-colors'>قصص وعبر</Link></li>
          </ul>
        </div>

        <div className='space-y-4'>
          <h3 className='text-lg font-bold text-brand-gold'>تواصل معنا</h3>
          <p className='text-sm arabic-muted'>ساهم معنا في تطوير المنصة عبر اقتراحاتك وملاحظاتك.</p>
          <div className='flex gap-4'>
            {/* Social Icons Placeholders */}
          </div>
        </div>
      </Container>
      
      <Container className='mt-12 border-t border-brand-gold/10 pt-8 text-center text-sm arabic-muted'>
        © {new Date().getFullYear()} ZIKR | ذِكرٌ — جميع الحقوق محفوظة.
      </Container>
    </footer>
  );
}
