'use client';

import Link from 'next/link';
import { useLanguage } from './language-provider';

export type NavLink = { href: string; label: string; labelEn: string };

export function LanguageAwareNav({ links }: { links: NavLink[] }) {
  const { isEnglish } = useLanguage();

  return (
    <nav className="hidden flex-wrap justify-end gap-x-4 gap-y-2 md:flex" aria-label={isEnglish ? 'Primary navigation' : 'القائمة الرئيسية'}>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-sm text-brand-cream/70 transition-colors hover:text-brand-gold"
        >
          {isEnglish ? link.labelEn : link.label}
        </Link>
      ))}
    </nav>
  );
}
