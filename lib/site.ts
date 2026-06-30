export const siteConfig = {
  name: 'ZIKR | ذِكرٌ',
  shortName: 'ZIKR',
  description: 'منصة روحانية تجمع القرآن والحديث والقصص والعلم في تجربة حديثة.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://zikr.app',
  locale: 'ar_SA',
  dir: 'rtl' as const,
};

export const defaultOgImage = '/icons/icon-512.svg';

export type AppRoute = {
  path: string;
  label: string;
  sitemap: {
    changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority: number;
  };
  nav?: 'primary' | 'more';
  footer?: 'platform' | 'tools' | 'legal';
};

export const appRoutes = [
  { path: '/', label: 'الرئيسية', sitemap: { changeFrequency: 'weekly', priority: 1 } },
  { path: '/quran', label: 'القرآن', sitemap: { changeFrequency: 'monthly', priority: 0.9 }, nav: 'primary', footer: 'platform' },
  { path: '/hadith', label: 'الأحاديث', sitemap: { changeFrequency: 'monthly', priority: 0.9 }, nav: 'primary', footer: 'platform' },
  { path: '/stories', label: 'القصص', sitemap: { changeFrequency: 'weekly', priority: 0.8 }, nav: 'primary' },
  { path: '/scholars', label: 'العلماء', sitemap: { changeFrequency: 'monthly', priority: 0.8 }, nav: 'primary', footer: 'platform' },
  { path: '/prayer', label: 'الصلاة', sitemap: { changeFrequency: 'daily', priority: 0.7 }, nav: 'primary', footer: 'tools' },
  { path: '/prayer-times', label: 'مواقيت الصلاة', sitemap: { changeFrequency: 'daily', priority: 0.7 }, nav: 'more' },
  { path: '/qibla', label: 'القبلة', sitemap: { changeFrequency: 'monthly', priority: 0.6 }, nav: 'more' },
  { path: '/adhkar', label: 'الأذكار', sitemap: { changeFrequency: 'weekly', priority: 0.8 }, nav: 'more', footer: 'platform' },
  { path: '/dua', label: 'الدعاء', sitemap: { changeFrequency: 'weekly', priority: 0.8 }, footer: 'platform' },
  { path: '/tasbeeh', label: 'التسبيح', sitemap: { changeFrequency: 'weekly', priority: 0.6 }, nav: 'more' },
  { path: '/prophets', label: 'قصص الأنبياء', sitemap: { changeFrequency: 'monthly', priority: 0.8 }, footer: 'platform' },
  { path: '/articles', label: 'المقالات', sitemap: { changeFrequency: 'daily', priority: 0.8 } },
  { path: '/videos', label: 'الفيديوهات', sitemap: { changeFrequency: 'daily', priority: 0.8 } },
  { path: '/youtube', label: 'يوتيوب', sitemap: { changeFrequency: 'daily', priority: 0.7 }, nav: 'more' },
  { path: '/kids', label: 'الأطفال', sitemap: { changeFrequency: 'weekly', priority: 0.7 } },
  { path: '/memorization', label: 'الحفظ', sitemap: { changeFrequency: 'weekly', priority: 0.6 }, nav: 'more', footer: 'tools' },
  { path: '/spiritual-ai', label: 'الرفيق الروحاني', sitemap: { changeFrequency: 'weekly', priority: 0.6 }, nav: 'more', footer: 'tools' },
  { path: '/poetry', label: 'الشعر', sitemap: { changeFrequency: 'weekly', priority: 0.6 }, nav: 'more', footer: 'tools' },
  { path: '/competitions', label: 'مسابقات', sitemap: { changeFrequency: 'weekly', priority: 0.6 }, nav: 'more' },
  { path: '/radio', label: 'الإذاعة', sitemap: { changeFrequency: 'weekly', priority: 0.6 }, nav: 'more' },
  { path: '/reciters', label: 'القراء', sitemap: { changeFrequency: 'monthly', priority: 0.7 } },
  { path: '/tafsir', label: 'التفسير', sitemap: { changeFrequency: 'monthly', priority: 0.7 } },
  { path: '/companions', label: 'الصحابة', sitemap: { changeFrequency: 'monthly', priority: 0.7 } },
  { path: '/battles', label: 'الغزوات', sitemap: { changeFrequency: 'monthly', priority: 0.6 } },
  { path: '/islamic-conquests', label: 'الفتوحات', sitemap: { changeFrequency: 'monthly', priority: 0.6 } },
  { path: '/tawasheeh', label: 'التواشيح', sitemap: { changeFrequency: 'weekly', priority: 0.6 } },
  { path: '/search', label: 'بحث', sitemap: { changeFrequency: 'daily', priority: 0.7 }, nav: 'more', footer: 'tools' },
  { path: '/favorites', label: 'المفضلة', sitemap: { changeFrequency: 'weekly', priority: 0.4 }, nav: 'more' },
  { path: '/profile', label: 'الملف الشخصي', sitemap: { changeFrequency: 'weekly', priority: 0.4 } },
  { path: '/about', label: 'عن المنصة', sitemap: { changeFrequency: 'yearly', priority: 0.5 }, footer: 'legal' },
  { path: '/privacy', label: 'سياسة الخصوصية', sitemap: { changeFrequency: 'yearly', priority: 0.3 }, footer: 'legal' },
  { path: '/terms', label: 'الشروط والأحكام', sitemap: { changeFrequency: 'yearly', priority: 0.3 }, footer: 'legal' },
] as const satisfies readonly AppRoute[];

export const staticRoutes = appRoutes.map((route) => route.path);
export const navigationRoutes = appRoutes.filter((route) => "nav" in route);
export const footerRoutes = appRoutes.filter((route) => "footer" in route);
