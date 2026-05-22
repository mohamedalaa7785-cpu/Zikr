import { useEffect } from "react";

const BASE_URL = "https://zikr-platform.vercel.app";

type Language = "en" | "ar";

export type PageSEO = {
  title: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string[];
  robots?: "index,follow" | "noindex,nofollow";
  language?: Language;
  schema?: Record<string, unknown>;
};

function upsertMeta(selector: string, attrs: Record<string, string>) {
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    Object.entries(attrs).forEach(([key, val]) => key !== "content" && el?.setAttribute(key, val));
    document.head.appendChild(el);
  }
  el.setAttribute("content", attrs.content);
}

function upsertLink(rel: string, href: string, hreflang?: string) {
  const selector = hreflang ? `link[rel='${rel}'][hreflang='${hreflang}']` : `link[rel='${rel}']`;
  let el = document.head.querySelector(selector) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    if (hreflang) el.hreflang = hreflang;
    document.head.appendChild(el);
  }
  el.href = href;
}

export function usePageSEO({ title, description, path, image = `${BASE_URL}/og-zikr.jpg`, keywords, robots = "index,follow", language = "en", schema }: PageSEO) {
  useEffect(() => {
    const canonical = `${BASE_URL}${path}`;
    document.title = title;
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";

    upsertMeta("meta[name='description']", { name: "description", content: description });
    upsertMeta("meta[name='robots']", { name: "robots", content: robots });
    upsertMeta("meta[property='og:title']", { property: "og:title", content: title });
    upsertMeta("meta[property='og:description']", { property: "og:description", content: description });
    upsertMeta("meta[property='og:url']", { property: "og:url", content: canonical });
    upsertMeta("meta[property='og:type']", { property: "og:type", content: path.startsWith("/episodes/") ? "article" : "website" });
    upsertMeta("meta[property='og:image']", { property: "og:image", content: image });
    upsertMeta("meta[name='twitter:card']", { name: "twitter:card", content: "summary_large_image" });
    upsertMeta("meta[name='twitter:title']", { name: "twitter:title", content: title });
    upsertMeta("meta[name='twitter:description']", { name: "twitter:description", content: description });
    upsertMeta("meta[name='twitter:image']", { name: "twitter:image", content: image });

    if (keywords?.length) upsertMeta("meta[name='keywords']", { name: "keywords", content: keywords.join(", ") });

    upsertLink("canonical", canonical);
    upsertLink("alternate", `${canonical}${canonical.includes("?") ? "&" : "?"}lang=en`, "en");
    upsertLink("alternate", `${canonical}${canonical.includes("?") ? "&" : "?"}lang=ar`, "ar");
    upsertLink("alternate", canonical, "x-default");

    const schemaId = "dynamic-schema";
    document.getElementById(schemaId)?.remove();
    if (schema) {
      const script = document.createElement("script");
      script.id = schemaId;
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }
  }, [title, description, path, image, keywords, robots, language, schema]);
}

export const seoBaseUrl = BASE_URL;
