import type { MetadataRoute } from 'next';
import { hadithBooks, hadiths, surahs } from '@/lib/data/content';
import { siteConfig, staticRoutes } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteConfig.url}${route}`,
      lastModified: now,
    })),
    ...surahs.map((surah) => ({
      url: `${siteConfig.url}/quran/${surah.id}`,
      lastModified: now,
    })),
    ...hadithBooks.map((book) => ({
      url: `${siteConfig.url}/hadith/${book.slug}`,
      lastModified: now,
    })),
    ...hadiths.map((hadith) => ({
      url: `${siteConfig.url}/hadith/${hadithBooks[0].slug}/${hadith.hadithNumber}`,
      lastModified: now,
    })),
  ];
}
