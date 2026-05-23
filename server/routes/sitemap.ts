import { Router } from "express";
import { getAllEpisodes } from "../db";

const router = Router();
const baseUrl = process.env.VITE_APP_URL || "https://zikr.vercel.app";

/**
 * Main XML sitemap with language alternates
 */
router.get("/sitemap.xml", async (_req, res) => {
  try {
    const allEpisodes = await getAllEpisodes();
    const now = new Date().toISOString().split("T")[0];

    const mainPages = [
      { path: "/", priority: "1.0", changefreq: "weekly" },
      { path: "/quran", priority: "0.95", changefreq: "monthly" },
      { path: "/hadith", priority: "0.95", changefreq: "monthly" },
      { path: "/prayer", priority: "0.9", changefreq: "daily" },
      { path: "/scholars", priority: "0.9", changefreq: "monthly" },
      { path: "/search", priority: "0.85", changefreq: "weekly" },
      { path: "/episodes", priority: "0.8", changefreq: "weekly" },
      { path: "/about", priority: "0.6", changefreq: "yearly" },
      { path: "/contact", priority: "0.5", changefreq: "yearly" },
      { path: "/privacy", priority: "0.5", changefreq: "yearly" },
      { path: "/terms", priority: "0.5", changefreq: "yearly" },
    ];

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

    for (const page of mainPages) {
      xml += "  <url>\n";
      xml += `    <loc>${baseUrl}${page.path}</loc>\n`;
      xml += `    <lastmod>${now}</lastmod>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += `    <xhtml:link rel="alternate" hreflang="ar" href="${baseUrl}/ar${page.path}" />\n`;
      xml += `    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en${page.path}" />\n`;
      xml += "  </url>\n";
    }

    for (const episode of allEpisodes) {
      if (episode.slug) {
        xml += "  <url>\n";
        xml += `    <loc>${baseUrl}/episodes/${episode.slug}</loc>\n`;
        xml += `    <lastmod>${episode.updatedAt?.toISOString().split("T")[0] || now}</lastmod>\n`;
        xml += `    <changefreq>monthly</changefreq>\n`;
        xml += `    <priority>0.7</priority>\n`;
        xml += "  </url>\n";
      }
    }

    xml += "</urlset>";

    res.type("application/xml").send(xml);
  } catch (error) {
    console.error("Sitemap generation error:", error);
    res.status(500).send("Error generating sitemap");
  }
});

/**
 * Robots.txt for search engines
 */
router.get("/robots.txt", (_req, res) => {
  const robotsTxt = `# ZIKR | ذِكرٌ - Robots.txt
# Allow search engines to crawl all pages

User-agent: *
Allow: /
Allow: /quran
Allow: /hadith
Allow: /prayer
Allow: /scholars
Allow: /search
Allow: /episodes
Allow: /ar
Allow: /en

Disallow: /admin
Disallow: /dashboard
Disallow: /api
Disallow: /internal
Disallow: /*.json$
Disallow: /*.xml$
Disallow: /search?
Disallow: /login
Disallow: /register

# Specific rules for major search engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

# Crawl delay
Crawl-delay: 1

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml
`;

  res.type("text/plain").send(robotsTxt);
});

export default router;
