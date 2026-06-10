import Link from 'next/link';
import { cookies } from 'next/headers';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/Logo';
import { logoutAction } from '@/app/auth/actions';
import { getSiteSetting } from '@/lib/services/site-content';
import { getCurrentProfile } from '@/lib/services/admin';

const links = [
  { href: '/quran', label: 'القرآن' },
  { href: '/hadith', label: 'الأحاديث' },
  { href: '/stories', label: 'القصص' },
  { href: '/scholars', label: 'العلماء' },
  { href: '/prayer', label: 'الصلاة' },
  { href: '/adhkar', label: 'الأذكار' },
  { href: '/memorization', label: 'الحفظ' },
  { href: '/spiritual-ai', label: 'الرفيق الروحاني' },
  { href: '/poetry', label: 'الشعر' },
  { href: '/youtube', label: 'يوتيوب' },
  { href: '/competitions', label: 'مسابقات' },
  { href: '/favorites', label: 'المفضلة' },
  { href: '/search', label: 'بحث' },
];

export async function Navbar() {
  const token = (await cookies()).get('sb_access_token')?.value;
  let profile = null;
  let isAdmin = false;
  let homepage = null;
  
  try {
    profile = token ? await getCurrentProfile() : null;
    isAdmin = profile?.role === 'admin';
    homepage = await getSiteSetting('homepage');
  } catch (error) {
    // Log error but don't crash navbar
    console.error('[navbar] Error loading user profile or site settings:', error instanceof Error ? error.message : 'unknown error');
    // Continue with defaults
  }

  return (
    <header className='sticky top-0 z-50 border-b border-brand-gold/10 bg-black/80 backdrop-blur-xl'>
      <Container className='flex min-h-20 flex-wrap items-center justify-between gap-4 py-3'>
        <Link href='/' className='flex items-center gap-3 transition-transform hover:scale-105'>
          <Logo variant='gold' width={120} height={44} srcOverride={homepage?.logoUrl} />
          <span className='sr-only'>ZIKR | ذِكرٌ</span>
        </Link>

        <nav className='hidden lg:flex items-center gap-6'>
          {links.slice(0, 6).map((link) => (
            <Link key={link.href} href={link.href} className='text-sm font-bold text-brand-cream/70 hover:text-brand-gold transition-colors'>
              {link.label}
            </Link>
          ))}
          <div className="group relative">
            <button className="text-sm font-bold text-brand-cream/70 hover:text-brand-gold flex items-center gap-1">
              المزيد ▾
            </button>
            <div className="absolute top-full right-0 mt-2 w-48 bg-black/90 border border-brand-gold/20 rounded-xl p-2 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              {links.slice(6).map((link) => (
                <Link key={link.href} href={link.href} className='block px-4 py-2 text-sm text-brand-cream/70 hover:text-brand-gold hover:bg-brand-gold/5 rounded-lg'>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div className='flex items-center gap-3'>
          <Link href="/search" className="p-2 text-brand-gold/60 hover:text-brand-gold transition-colors lg:hidden">
            🔍
          </Link>
          {token ? (
            <div className='flex items-center gap-3'>
              <Link href='/profile' className="w-10 h-10 rounded-full border border-brand-gold/20 bg-brand-gold/5 flex items-center justify-center text-brand-gold hover:bg-brand-gold/10 transition-all overflow-hidden">
                {profile?.display_name?.charAt(0) || '👤'}
              </Link>
              {isAdmin && (
                <Button variant='ghost' href='/admin' className="hidden md:flex text-xs border border-brand-gold/10">
                  الأدمن
                </Button>
              )}
              <form action={logoutAction}>
                <Button variant='secondary' type='submit' className="text-xs px-4 py-2">
                  خروج
                </Button>
              </form>
            </div>
          ) : (
            <Button href='/auth/login' className="bg-brand-gold text-black hover:bg-brand-goldSoft font-bold px-6">دخول</Button>
          )}
        </div>
      </Container>
    </header>
  );
}
