'use client';

import { useState } from 'react';
import Link from 'next/link';

const allLinks = [
  { href: '/quran', label: 'القرآن الكريم' },
  { href: '/hadith', label: 'الأحاديث' },
  { href: '/adhkar', label: 'الأذكار' },
  { href: '/dua', label: 'الأدعية' },
  { href: '/tasbeeh', label: 'التسبيح' },
  { href: '/wird', label: 'الورد اليومي وختم القرآن' },
  { href: '/prayer-times', label: 'مواقيت الصلاة' },
  { href: '/zakat', label: 'الزكاة والتذكير' },
  { href: '/qibla', label: 'القبلة' },
  { href: '/prophets', label: 'قصص الأنبياء' },
  { href: '/companions', label: 'الصحابة' },
  { href: '/scholars', label: 'العلماء' },
  { href: '/stories', label: 'القصص الإسلامية' },
  { href: '/articles', label: 'المقالات' },
  { href: '/videos', label: 'الفيديوهات' },
  { href: '/youtube', label: 'قناة يوتيوب' },
  { href: '/radio', label: 'إذاعة القرآن' },
  { href: '/spiritual-ai', label: 'الرفيق الروحاني' },
  { href: '/memorization', label: 'الحفظ' },
  { href: '/poetry', label: 'الشعر' },
  { href: '/kids', label: 'قسم الأطفال' },
  { href: '/battles', label: 'الغزوات' },
  { href: '/conquests', label: 'الفتوحات' },
  { href: '/search', label: 'البحث' },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger button - visible on mobile only */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-lg hover:bg-brand-gold/10 transition-colors"
        aria-label={open ? 'إغلاق القائمة' : 'فتح القائمة'}
        aria-expanded={open}
      >
        <span className={`block h-0.5 w-5 bg-brand-gold transition-all duration-200 ${open ? 'translate-y-2 rotate-45' : ''}`} />
        <span className={`block h-0.5 w-5 bg-brand-gold transition-all duration-200 ${open ? 'opacity-0' : ''}`} />
        <span className={`block h-0.5 w-5 bg-brand-gold transition-all duration-200 ${open ? '-translate-y-2 -rotate-45' : ''}`} />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Slide-in Drawer */}
      <nav
        className={`fixed top-0 right-0 z-40 h-full w-72 bg-brand-emeraldDeep border-l border-brand-gold/15 shadow-xl md:hidden transition-transform duration-300 ease-in-out overflow-y-auto ${open ? 'translate-x-0' : 'translate-x-full'}`}
        aria-label="القائمة الرئيسية"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-gold/15">
          <span className="text-xl font-bold text-brand-gold">ذِكرٌ</span>
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-brand-gold/10 transition-colors"
            aria-label="إغلاق"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-brand-gold/70">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        <div className="py-3 px-3">
          {allLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="flex items-center px-4 py-2.5 rounded-lg text-sm text-brand-cream/70 hover:text-brand-gold hover:bg-brand-gold/8 transition-all"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
