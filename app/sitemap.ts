import type { MetadataRoute } from "next";
import { getAllSurahs } from "@/lib/services/quran";
import { getAllScholars } from "@/lib/services/scholars";
import { getHadithBooks } from "@/lib/services/hadith";
import { getStories } from "@/lib/services/stories";
import { appRoutes, siteConfig } from "@/lib/site";
import type { Surah } from "@/lib/types/quran";
import type { Scholar } from "@/lib/services/scholars";
import type { HadithBook } from "@/lib/types/hadith";
import type { Story } from "@/lib/services/stories";

export const revalidate = 86400; // 24 hours

type SitemapEntry = MetadataRoute.Sitemap[number];

function siteConfigRoutes() {
  return appRoutes;
}

function route(path = "", options: Omit<SitemapEntry, "url">): SitemapEntry {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  return {
    url: `${baseUrl}${path}`,
    ...options,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = siteConfigRoutes().map((appRoute) =>
    route(appRoute.path === "/" ? "" : appRoute.path, {
      lastModified: now,
      changeFrequency: appRoute.sitemap.changeFrequency,
      priority: appRoute.sitemap.priority,
    })
  );
  try {
    if (process.env.NEXT_PHASE === "phase-production-build") {
      console.info(
        "[sitemap] Skipping dynamic fetch during build phase to avoid dynamic usage error"
      );
      return staticRoutes;
    }

    const [surahs, scholars, hadithBooks, stories, articles, videos, prophets, duas, kidsContent] = await Promise.all([
      getAllSurahs("ar").catch((error): Surah[] => {
        console.error("[sitemap] Quran fetch failed:", error);
        return [];
      }),
      getAllScholars().catch((error): Scholar[] => {
        console.error("[sitemap] Scholars fetch failed:", error);
        return [];
      }),
      getHadithBooks().catch((error): HadithBook[] => {
        console.error("[sitemap] Hadith fetch failed:", error);
        return [];
      }),
      getStories().catch((error): Story[] => {
        console.error("[sitemap] Stories fetch failed:", error);
        return [];
      }),
      import('@/lib/services/content').then(m => m.getArticles()).catch(() => []),
      import('@/lib/services/content').then(m => m.getVideos()).catch(() => []),
      import('@/lib/services/content').then(m => m.getProphets()).catch(() => []),
      import('@/lib/services/content').then(m => m.getDuas()).catch(() => []),
      import('@/lib/services/content').then(m => m.getKidsContent()).catch(() => []),
    ]);

    const dynamicRoutes: MetadataRoute.Sitemap = [
      ...surahs.map(surah =>
        route(`/quran/${surah.number}`, {
          lastModified: now,
          changeFrequency: "monthly",
          priority: 0.8,
        })
      ),
      ...scholars.map(scholar =>
        route(`/scholars/${scholar.slug}`, {
          lastModified: now,
          changeFrequency: "monthly",
          priority: 0.7,
        })
      ),
      ...hadithBooks.map(book =>
        route(`/hadith/${book.id}`, {
          lastModified: now,
          changeFrequency: "monthly",
          priority: 0.7,
        })
      ),
      ...stories.map(story =>
        route(`/stories/${story.slug}`, {
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.7,
        })
      ),
      ...articles.map(article =>
        route(`/articles/${article.slug}`, {
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.7,
        })
      ),
      ...videos.map(video =>
        route(`/videos/${video.slug}`, {
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.7,
        })
      ),
      ...prophets.map(prophet =>
        route(`/prophets/${prophet.slug}`, {
          lastModified: now,
          changeFrequency: "monthly",
          priority: 0.7,
        })
      ),
      ...duas.map(dua =>
        route(`/dua/${dua.slug}`, {
          lastModified: now,
          changeFrequency: "monthly",
          priority: 0.7,
        })
      ),
      ...kidsContent.map(kid =>
        route(`/kids/${kid.slug}`, {
          lastModified: now,
          changeFrequency: "monthly",
          priority: 0.7,
        })
      ),
    ];

    return [...staticRoutes, ...dynamicRoutes];
  } catch (error) {
    console.error("[sitemap] Error generating dynamic routes:", error);
    return staticRoutes;
  }
}
