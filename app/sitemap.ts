import type { MetadataRoute } from "next";
import { getAllSurahs } from "@/lib/services/quran";
import { getAllScholars } from "@/lib/services/scholars";
import { getHadithBooks } from "@/lib/services/hadith";
import { getStories } from "@/lib/services/stories";
import { siteConfig } from "@/lib/site";
import type { Surah } from "@/lib/types/quran";
import type { Scholar } from "@/lib/services/scholars";
import type { HadithBook } from "@/lib/types/hadith";
import type { Story } from "@/lib/services/stories";

export const revalidate = 86400; // 24 hours

type SitemapEntry = MetadataRoute.Sitemap[number];

function route(path = "", options: Omit<SitemapEntry, "url">): SitemapEntry {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  return {
    url: `${baseUrl}${path}`,
    ...options,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    route("", { lastModified: now, changeFrequency: "weekly", priority: 1 }),
    route("/quran", {
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    }),
    route("/hadith", {
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    }),
    route("/stories", {
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    }),
    route("/scholars", {
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    }),
    route("/search", {
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.7,
    }),
    route("/about", {
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    }),
    route("/privacy", {
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    }),
    route("/terms", {
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    }),
    route("/adhkar", { lastModified: now, changeFrequency: "weekly", priority: 0.8 }),
    route("/dua", { lastModified: now, changeFrequency: "weekly", priority: 0.8 }),
    route("/prophets", { lastModified: now, changeFrequency: "monthly", priority: 0.8 }),
    route("/articles", { lastModified: now, changeFrequency: "daily", priority: 0.8 }),
    route("/videos", { lastModified: now, changeFrequency: "daily", priority: 0.8 }),
    route("/kids", { lastModified: now, changeFrequency: "weekly", priority: 0.7 }),
    route("/prayer", { lastModified: now, changeFrequency: "daily", priority: 0.7 }),
    route("/poetry", { lastModified: now, changeFrequency: "weekly", priority: 0.6 }),
    route("/memorization", { lastModified: now, changeFrequency: "weekly", priority: 0.6 }),
    route("/spiritual-ai", { lastModified: now, changeFrequency: "weekly", priority: 0.6 }),
  ];

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
