import Link from 'next/link';

const nav = [
  { href: '/', label: 'Home' },
  { href: '/quran', label: 'القرآن' },
  { href: '/hadith', label: 'الحديث' },
  { href: '/scholars', label: 'العلماء' },
];

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zikr-bg text-zikr-text">
      <header className="sticky top-0 border-b border-zikr-gold/20 bg-black/40 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-xl font-semibold text-zikr-gold">ZIKR | ذِكرٌ</Link>
          <nav className="flex gap-4 text-sm">{nav.map((n) => <Link key={n.href} href={n.href}>{n.label}</Link>)}</nav>
        </div>
      </header>
      {children}
    </div>
  );
}
