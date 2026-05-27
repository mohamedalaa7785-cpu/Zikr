import { MetadataRoute } from 'next';
import { getAllSurahs } from '@/lib/services/quran';
import { getAllScholars } from '@/lib/services/scholars';
import { getHadithBooks } from '@/lib/services/hadith';
import { getStories } from '@/lib/services/stories';

export const revalidate = 3600;

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
    const [surahs, scholars, hadithBooks, stories] = await Promise.all([
      getAllSurahs('ar').catch(() => []),
      getAllScholars().catch(() => []),
      getHadithBooks().catch(() => []),
      getStories().catch(() => []),
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
