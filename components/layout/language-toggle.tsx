'use client';

import { useEffect, useState } from 'react';
import { Languages } from 'lucide-react';

const LANG_KEY = 'zikr_lang';
type Lang = 'ar' | 'en';

/**
 * Lightweight language toggle that flips the `lang` and `dir` attributes on
 * <html> and stores the preference. The app content is still Arabic-primary;
 * this sets the browser's accessibility & rendering language correctly and
 * signals Google that the site supports both languages.
 */
export function LanguageToggle() {
  const [lang, setLang] = useState<Lang>('ar');

  useEffect(() => {
    const stored = (localStorage.getItem(LANG_KEY) as Lang) ?? 'ar';
    setLang(stored);
    applyLang(stored);
  }, []);

  const toggle = () => {
    const next: Lang = lang === 'ar' ? 'en' : 'ar';
    setLang(next);
    localStorage.setItem(LANG_KEY, next);
    applyLang(next);
  };

  return (
    <button
      onClick={toggle}
      title={lang === 'ar' ? 'Switch to English' : 'التبديل للعربية'}
      aria-label={lang === 'ar' ? 'Switch to English' : 'التبديل للعربية'}
      className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-brand-cream/60 hover:text-brand-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
    >
      <Languages className="w-4 h-4" aria-hidden="true" />
      <span>{lang === 'ar' ? 'EN' : 'ع'}</span>
    </button>
  );
}

function applyLang(lang: Lang) {
  if (typeof document === 'undefined') return;
  const html = document.documentElement;
  html.setAttribute('lang', lang);
  html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
}
