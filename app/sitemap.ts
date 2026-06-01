import { MetadataRoute } from 'next';
import { getAllSurahs } from '@/lib/services/quran';
import { getAllScholars } from '@/lib/services/scholars';
import { getHadithBooks } from '@/lib/services/hadith';
import { getStories } from '@/lib/services/stories';

export const revalidate = 86400; // 24 hours

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zikr.app';
  const staticRoutes = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${baseUrl}/quran`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${baseUrl}/hadith`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${baseUrl}/stories`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/scholars`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
  ];

  try {
    // Skip dynamic routes if Supabase URL is missing (common during build)
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NODE_ENV === 'production') {
      console.warn('[sitemap] Skipping dynamic routes due to missing NEXT_PUBLIC_SUPABASE_URL');
      return staticRoutes;
    }

    // Use force-cache for sitemap generation to avoid dynamic server usage error
    // Also check if we are in build phase to avoid crashing
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      console.info('[sitemap] Skipping dynamic fetch during build phase to avoid dynamic usage error');
      return staticRoutes;
    }

    const [surahs, scholars, hadithBooks, stories] = await Promise.all([
      getAllSurahs('ar').catch((err) => { console.error('[sitemap] Quran fetch failed:', err); return []; }),
      getAllScholars().catch((err) => { console.error('[sitemap] Scholars fetch failed:', err); return []; }),
      getHadithBooks().catch((err) => { console.error('[sitemap] Hadith fetch failed:', err); return []; }),
      getStories().catch((err) => { console.error('[sitemap] Stories fetch failed:', err); return []; }),
    ]);

    const dynamicRoutes = [
      ...surahs.map((surah: any) => ({
        url: `${baseUrl}/quran/${surah.number}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      })),
      ...scholars.map((scholar: any) => ({
        url: `${baseUrl}/scholars/${scholar.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })),
      ...hadithBooks.map((book: any) => ({
        url: `${baseUrl}/hadith/${book.slug ?? book.id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })),
      ...stories.map((story: any) => ({
        url: `${baseUrl}/stories/${story.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })),
    ];

    return [...staticRoutes, ...dynamicRoutes];
  } catch (error) {
    console.error('[sitemap] Error generating dynamic routes:', error);
    return staticRoutes;
  }
}
