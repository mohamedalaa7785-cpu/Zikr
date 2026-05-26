/**
 * SEO Helper Functions for ZIKR | ذِكرٌ
 * Handles canonical URLs, schema.org markup, and meta tags
 */

export interface EpisodeSchemaData {
  slug: string;
  titleEn: string;
  titleAr: string;
  descriptionEn?: string;
  descriptionAr?: string;
  publishedAt?: Date;
  category?: string;
  keywordsEn?: string;
  keywordsAr?: string;
}

/**
 * Generate canonical URL for a page
 */
export function getCanonicalUrl(path: string): string {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://zikr-platform.vercel.app";
  return `${baseUrl}${path}`;
}

/**
 * Set canonical link in document head
 */
export function setCanonicalUrl(path: string): void {
  if (typeof document === "undefined") return;

  let canonicalLink = document.querySelector("link[rel='canonical']") as HTMLLinkElement;
  if (!canonicalLink) {
    canonicalLink = document.createElement("link");
    canonicalLink.rel = "canonical";
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.href = getCanonicalUrl(path);
}

/**
 * Generate Episode schema.org JSON-LD markup
 */
export function generateEpisodeSchema(episode: EpisodeSchemaData, language: "en" | "ar"): object {
  const title = language === "en" ? episode.titleEn : episode.titleAr;
  const description = language === "en" ? episode.descriptionEn : episode.descriptionAr;
  const url = getCanonicalUrl(`/episodes/${episode.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "PodcastEpisode",
    name: title,
    description: description,
    url: url,
    datePublished: episode.publishedAt ? new Date(episode.publishedAt).toISOString() : new Date().toISOString(),
    inLanguage: language === "en" ? "en-US" : "ar-SA",
    keywords: language === "en" ? episode.keywordsEn : episode.keywordsAr,
    partOfSeries: {
      "@type": "PodcastSeries",
      name: "ZIKR | ذِكرٌ",
      url: getCanonicalUrl("/"),
    },
    author: {
      "@type": "Organization",
      name: "ZIKR | ذِكرٌ",
      url: getCanonicalUrl("/"),
    },
  };
}

/**
 * Generate Organization schema.org JSON-LD markup
 */
export function generateOrganizationSchema(): object {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ZIKR | ذِكرٌ",
    url: getCanonicalUrl("/"),
    logo: getCanonicalUrl("/logo.png"),
    description: "Deep historical analysis. Power structures. Lost civilizations.",
    sameAs: [
      "https://www.youtube.com/channel/YOUR_CHANNEL_ID",
      "https://www.facebook.com/hiddennarratives",
      "https://www.linkedin.com/company/zikr",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      email: "contact@hiddennarratives.com",
    },
  };
}

/**
 * Inject schema.org JSON-LD into document head
 */
export function injectSchema(schema: object): void {
  if (typeof document === "undefined") return;

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

/**
 * Generate breadcrumb schema.org JSON-LD
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Set meta tags for social sharing
 */
export function setOpenGraphTags(config: {
  title: string;
  description: string;
  image?: string;
  url: string;
  type?: string;
}): void {
  if (typeof document === "undefined") return;

  const tags = [
    { property: "og:title", content: config.title },
    { property: "og:description", content: config.description },
    { property: "og:url", content: config.url },
    { property: "og:type", content: config.type || "website" },
    { property: "og:image", content: config.image || getCanonicalUrl("/og-image.png") },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: config.title },
    { name: "twitter:description", content: config.description },
    { name: "twitter:image", content: config.image || getCanonicalUrl("/og-image.png") },
  ];

  tags.forEach(({ property, name, content }) => {
    let element = document.querySelector(`meta[property="${property}"], meta[name="${name}"]`) as HTMLMetaElement;
    if (!element) {
      element = document.createElement("meta");
      if (property) element.setAttribute("property", property);
      if (name) element.setAttribute("name", name);
      document.head.appendChild(element);
    }
    element.content = content;
  });
}
