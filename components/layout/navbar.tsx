import Link from 'next/link';
import { Settings } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { createClient } from '@/lib/supabase/server';
import { MobileNav } from './mobile-nav';
import { AuthNavActions } from './auth-nav-actions';

const links = [
  { href: '/quran', label: 'القرآن' },
  { href: '/hadith', label: 'الأحاديث' },
  { href: '/stories', label: 'القصص' },
  { href: '/adhkar', label: 'الأذكار' },
  { href: '/dua', label: 'الأدعية' },
  { href: '/wird', label: 'الورد' },
  { href: '/prayer-times', label: 'الصلاة' },
  { href: '/zakat', label: 'الزكاة' },
  { href: '/qibla', label: 'القبلة' },
  { href: '/prophets', label: 'الأنبياء' },
  { href: '/companions', label: 'الصحابة' },
  { href: '/scholars', label: 'العلماء' },
  { href: '/spiritual-ai', label: 'الروحاني' },
  { href: '/kids', label: 'الأطفال' },
  { href: '/search', label: 'بحث' },
];

export async function Navbar() {
  let user = null;
  let isAdmin = false;

  try {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    user = authUser;

    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      isAdmin = profile?.role === 'admin';
    }
  } catch {
    // Continue with unauthenticated state
  }

  return (
    <header className="sticky top-0 z-40 border-b border-brand-gold/15 bg-brand-emeraldDeep/90 backdrop-blur-md">
      <Container className="flex min-h-16 flex-wrap items-center justify-between gap-3 py-2">
        <Link href="/" className="flex items-center gap-2 group" aria-label="ZIKR - الرئيسية">
          <span className="text-2xl font-bold text-brand-gold tracking-tight group-hover:opacity-80 transition-opacity">ذِكرٌ</span>
          <span className="hidden sm:block text-xs text-brand-gold/40 font-mono tracking-widest pt-1">ZIKR</span>
        </Link>

        <nav className="hidden md:flex flex-wrap justify-end gap-x-4 gap-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-brand-cream/70 hover:text-brand-gold transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/settings"
            aria-label="الإعدادات"
            className="rounded-md p-2 text-brand-cream/60 transition-colors hover:text-brand-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
          >
            <Settings className="h-5 w-5" aria-hidden="true" />
          </Link>
          <MobileNav />
          <AuthNavActions initialUser={user} initialIsAdmin={isAdmin} />
        </div>
      </Container>
    </header>
  );
}
