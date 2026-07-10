import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/container';

export const metadata: Metadata = {
  title: 'لوحة التحكم | ذِكرٌ',
  description: 'لوحة تحكم الأدمن لإدارة الموقع بالكامل',
};

const NAV_ITEMS = [
  { href: '/admin', label: 'الرئيسية' },
  { href: '/admin/content', label: 'المحتوى' },
  { href: '/admin/users', label: 'المستخدمون' },
  { href: '/admin/videos', label: 'الفيديوهات' },
  { href: '/admin/analytics', label: 'التحليلات' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="border-b border-brand-gold/15 bg-black/25">
        <Container>
          <nav aria-label="تنقل لوحة التحكم" className="flex flex-wrap items-center gap-1 py-3 text-right">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-4 py-2 text-sm text-brand-cream/70 transition-colors hover:bg-brand-gold/10 hover:text-brand-gold"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/"
              className="mr-auto rounded-lg border border-brand-gold/25 px-4 py-2 text-sm text-brand-gold/80 transition-colors hover:border-brand-gold hover:text-brand-gold"
            >
              عرض الموقع
            </Link>
          </nav>
        </Container>
      </div>
      {children}
    </div>
  );
}
