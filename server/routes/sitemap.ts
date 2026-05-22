import { Router } from "express";
import { getDb } from "../db";
import { episodes } from "../../drizzle/schema";

const router = Router();
const baseUrl = "https://zikr-platform.vercel.app";

router.get("/sitemap.xml", async (_req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      res.status(500).send("Database not available");
      return;
    }

    const allEpisodes = await db.select().from(episodes);
    const now = new Date().toISOString().split("T")[0];

    const urls = [
      { loc: baseUrl, lastmod: now, changefreq: "weekly", priority: "1.0" },
      { loc: `${baseUrl}/episodes`, lastmod: now, changefreq: "daily", priority: "0.9" },
      { loc: `${baseUrl}/about`, lastmod: now, changefreq: "monthly", priority: "0.8" },
      { loc: `${baseUrl}/contact`, lastmod: now, changefreq: "monthly", priority: "0.8" },
      ...allEpisodes.map((ep: any) => ({
        loc: `${baseUrl}/episodes/${ep.slug}`,
        lastmod: ep.updatedAt?.split("T")[0] || now,
        changefreq: "monthly",
        priority: "0.8",
      })),
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

    res.type("application/xml").send(sitemap);
  } catch (error) {
    console.error("Sitemap generation error:", error);
    res.status(500).send("Error generating sitemap");
  }
});

router.get("/robots.txt", (_req, res) => {
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /dashboard
Disallow: /assistant
Disallow: /tasks
Disallow: /payment
Disallow: /research-request
Disallow: /api

Sitemap: ${baseUrl}/sitemap.xml`;

  res.type("text/plain").send(robotsTxt);
});

export default router;
