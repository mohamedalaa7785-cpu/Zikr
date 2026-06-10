export const siteConfig = {
  name: 'ZIKR | ذِكرٌ',
  shortName: 'ZIKR',
  description: 'منصة روحانية إسلامية تجمع القرآن الكريم والحديث الشريف والقصص والعلماء في تجربة رقمية حديثة وفاخرة.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://zikrmediaofficial.vercel.app',
  locale: 'ar_EG',
  dir: 'rtl' as const,
  themeColor: '#0A2A1E',
  keywords: ['قرآن', 'حديث', 'أذكار', 'إسلام', 'صلاة', 'قصص الأنبياء', 'ذكر', 'ZIKR'],
};

export const defaultOgImage = '/branding/logo-gold.webp';

export const staticRoutes = [
  '/',
  '/quran',
  '/hadith',
  '/stories',
  '/scholars',
  '/prayer',
  '/adhkar',
  '/dua',
  '/prophets',
  '/articles',
  '/videos',
  '/kids',
  '/poetry',
  '/memorization',
  '/spiritual-ai',
  '/search',
  '/favorites',
  '/profile',
  '/about',
  '/privacy',
  '/terms',
] as const;
