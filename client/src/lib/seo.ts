/**
 * SEO Configuration and Helpers
 * Provides metadata, structured data, and SEO utilities
 */

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  image?: string;
  url: string;
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
  language: "en" | "ar";
}

export const siteConfig = {
  name: "ZIKR | ذِكرٌ",
  description: "Deep historical analysis. Power structures. Lost civilizations.",
  url: "https://zikr-platform.vercel.app",
  author: "Mohamed Alaa",
  email: "contact@hiddennarratives.com",
  social: {
    youtube: "https://www.youtube.com/@hiddennarrativesbymuhammed",
    facebook: "https://www.facebook.com/profile.php?id=61588578182976",
    linkedin: "https://www.linkedin.com/in/muhammed-alaa",
  },
};

export function generateMetaTags(metadata: SEOMetadata) {
  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords.join(", "),
    "og:title": metadata.title,
    "og:description": metadata.description,
    "og:url": metadata.url,
    "og:type": "website",
    "og:image": metadata.image || `${siteConfig.url}/og-image.jpg`,
    "twitter:card": "summary_large_image",
    "twitter:title": metadata.title,
    "twitter:description": metadata.description,
    "twitter:image": metadata.image || `${siteConfig.url}/og-image.jpg`,
    "article:author": metadata.author || siteConfig.author,
    "article:published_time": metadata.publishedDate,
    "article:modified_time": metadata.modifiedDate,
    "article:section": "History",
    "article:tag": metadata.keywords.join(", "),
  };
}

export function generateStructuredData(type: "Article" | "Podcast" | "Organization" | "BreadcrumbList", data: any) {
  const baseContext = {
    "@context": "https://schema.org",
  };

  switch (type) {
    case "Article":
      return {
        ...baseContext,
        "@type": "Article",
        headline: data.title,
        description: data.description,
        image: data.image,
        datePublished: data.publishedDate,
        dateModified: data.modifiedDate,
        author: {
          "@type": "Person",
          name: data.author || siteConfig.author,
        },
        publisher: {
          "@type": "Organization",
          name: siteConfig.name,
          logo: {
            "@type": "ImageObject",
            url: `${siteConfig.url}/logo.png`,
          },
        },
        keywords: data.keywords?.join(", "),
      };

    case "Podcast":
      return {
        ...baseContext,
        "@type": "Podcast",
        name: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
        image: `${siteConfig.url}/podcast-image.jpg`,
        author: {
          "@type": "Person",
          name: siteConfig.author,
        },
      };

    case "Organization":
      return {
        ...baseContext,
        "@type": "Organization",
        name: siteConfig.name,
        url: siteConfig.url,
        logo: `${siteConfig.url}/logo.png`,
        description: siteConfig.description,
        sameAs: [siteConfig.social.youtube, siteConfig.social.facebook],
        contact: {
          "@type": "ContactPoint",
          contactType: "Customer Support",
          email: siteConfig.email,
        },
      };

    case "BreadcrumbList":
      return {
        ...baseContext,
        "@type": "BreadcrumbList",
        itemListElement: data.items?.map((item: any, index: number) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      };

    default:
      return baseContext;
  }
}

export function generateSitemap(episodes: any[]) {
  const baseUrl = siteConfig.url;
  const now = new Date().toISOString().split("T")[0];

  const urls = [
    { loc: baseUrl, lastmod: now, changefreq: "weekly", priority: "1.0" },
    { loc: `${baseUrl}/episodes`, lastmod: now, changefreq: "daily", priority: "0.9" },
    { loc: `${baseUrl}/about`, lastmod: now, changefreq: "monthly", priority: "0.7" },
    ...episodes.map((ep: any) => ({
      loc: `${baseUrl}/episodes/${ep.slug}`,
      lastmod: ep.updatedAt?.split("T")[0] || now,
      changefreq: "monthly",
      priority: "0.8",
    })),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join("\n")}
</urlset>`;
}

export function generateRobotsTxt() {
  return `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api
Disallow: /dashboard
Disallow: /assistant
Disallow: /tasks
Disallow: /payment
Disallow: /research-request

Sitemap: https://zikr-platform.vercel.app/sitemap.xml

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /`;
}

export const keywords = {
  en: {
    general: [
      "history",
      "ancient civilizations",
      "historical analysis",
      "power structures",
      "documentary",
      "deep history",
      "lost civilizations",
      "ZIKR | ذِكرٌ",
    ],
    egypt: [
      "ancient egypt",
      "egyptian civilization",
      "pharaohs",
      "pyramids",
      "hieroglyphics",
      "nile civilization",
    ],
    rome: [
      "roman empire",
      "ancient rome",
      "roman civilization",
      "caesar",
      "roman history",
    ],
    medieval: [
      "knights templar",
      "medieval history",
      "crusades",
      "middle ages",
      "medieval europe",
    ],
  },
  ar: {
    general: [
      "التاريخ",
      "الحضارات القديمة",
      "التحليل التاريخي",
      "هياكل القوة",
      "وثائقي",
      "التاريخ العميق",
      "الحضارات المفقودة",
      "ما وراء الرواية",
    ],
    egypt: [
      "مصر القديمة",
      "الحضارة المصرية",
      "الفراعنة",
      "الأهرامات",
      "الهيروغليفية",
      "حضارة النيل",
    ],
    rome: [
      "الإمبراطورية الرومانية",
      "روما القديمة",
      "الحضارة الرومانية",
      "قيصر",
      "التاريخ الروماني",
    ],
    medieval: [
      "فرسان الهيكل",
      "التاريخ الوسيط",
      "الحروب الصليبية",
      "العصور الوسطى",
      "أوروبا العصور الوسطى",
    ],
  },
};
