import Link from 'next/link';
import { cookies } from 'next/headers';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/Logo';
import { logoutAction } from '@/app/auth/actions';
import { getSiteSetting } from '@/lib/services/site-content';

const links = [
  { href: '/quran', label: 'القرآن' },
  { href: '/hadith', label: 'الأحاديث' },
  { href: '/stories', label: 'القصص' },
  { href: '/scholars', label: 'العلماء' },
  { href: '/prayer', label: 'الصلاة' },
  { href: '/adhkar', label: 'الذكر' },
  { href: '/memorization', label: 'الحفظ' },
  { href: '/youtube', label: 'يوتيوب' },
  { href: '/competitions', label: 'مسابقات' },
];

export async function Navbar() {
  const token = (await cookies()).get('sb_access_token')?.value;
  const homepage = await getSiteSetting('homepage');

  return (
    <header className='sticky top-0 z-40 border-b border-brand-gold/20 bg-brand-emeraldDeep/85 backdrop-blur'>
      <Container className='flex min-h-16 flex-wrap items-center justify-between gap-3 py-2'>
        <Link href='/' className='flex items-center gap-3'>
          <Logo variant='gold' width={108} height={40} srcOverride={homepage?.logoUrl} />
          <span className='sr-only'>ZIKR | ذِكرٌ</span>
        </Link>

        <nav className='flex flex-wrap justify-end gap-x-4 gap-y-2'>
          {links.map((link) => (
            <Link key={link.href} href={link.href} className='text-sm text-brand-cream hover:text-brand-gold'>
              {link.label}
            </Link>
          ))}
        </nav>

        <div>
          {token ? (
            <div className='flex items-center gap-2'>
              <Button variant='ghost' href='/profile'>
                الملف الشخصي
              </Button>
              <Button variant='ghost' href='/admin'>
                الأدمن
              </Button>
              <form action={logoutAction}>
                <Button variant='secondary' type='submit'>
                  خروج
                </Button>
              </form>
            </div>
          ) : (
            <Button href='/auth/login'>تسجيل الدخول</Button>
          )}
        </div>
      </Container>
    </header>
  );
}
