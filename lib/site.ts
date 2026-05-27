export const siteConfig = {
  name: 'ZIKR | ذِكرٌ',
  shortName: 'ZIKR',
  description: 'منصة روحانية تجمع القرآن والحديث والقصص والعلم في تجربة حديثة.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://zikr.app',
  locale: 'ar_SA',
  dir: 'rtl' as const,
};

export const defaultOgImage = '/icons/icon-512.svg';

export const staticRoutes = [
  '/',
  '/quran',
  '/hadith',
  '/stories',
  '/scholars',
  '/prayer',
  '/adhkar',
  '/search',
  '/favorites',
  '/profile',
] as const;
