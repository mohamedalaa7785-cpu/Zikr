'use client';

import { Languages } from 'lucide-react';
import { useLanguage } from './language-provider';

export function LanguageToggle() {
  const { locale, toggleLocale, isEnglish } = useLanguage();
  const nextLabel = isEnglish ? 'العربية' : 'English';

  return (
    <button
      type="button"
      onClick={toggleLocale}
      aria-label={isEnglish ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'}
      className="inline-flex min-h-10 items-center gap-2 rounded-full border border-brand-gold/20 bg-black/20 px-3 py-2 text-xs font-semibold text-brand-cream/70 transition-all hover:border-brand-gold/45 hover:bg-brand-gold/10 hover:text-brand-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
    >
      <Languages className="h-4 w-4" aria-hidden="true" />
      <span>{nextLabel}</span>
      <span className="rounded-full bg-brand-gold/15 px-1.5 py-0.5 text-[10px] uppercase text-brand-gold/80">{locale}</span>
    </button>
  );
}
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
