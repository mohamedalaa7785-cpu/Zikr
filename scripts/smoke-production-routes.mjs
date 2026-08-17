const base = process.argv[2] ?? "https://zikr-git-main-zikr.vercel.app";
const routes = [
  "/", "/quran", "/mushaf", "/hadith", "/adhkar", "/dua", "/prophets",
  "/companions", "/scholars", "/articles", "/stories", "/battles", "/conquests",
  "/kids", "/memorization", "/prayer-times", "/qibla", "/radio", "/reciters",
  "/tawasheeh", "/poetry", "/tafsir", "/tasbeeh", "/offline-library", "/search",
  "/about", "/platform", "/faq", "/contact", "/privacy", "/terms",
  "/api/content/stats", "/api/content/articles", "/api/content/prophets",
  "/api/duas", "/api/hadith/books", "/api/quran/surahs", "/manifest.webmanifest",
  "/robots.txt", "/sitemap-index.xml",
];

const results = [];
for (const route of routes) {
  try {
    const response = await fetch(`${base}${route}`, {
      redirect: "manual",
      headers: { "user-agent": "ZIKR-production-smoke/1.0" },
    });
    results.push({ route, status: response.status, ok: response.status >= 200 && response.status < 400 });
  } catch (error) {
    results.push({ route, status: 0, ok: false, error: String(error) });
  }
}

const failures = results.filter(result => !result.ok);
console.log(JSON.stringify({ base, checked: results.length, failures, results }, null, 2));
if (failures.length > 0) process.exitCode = 1;
