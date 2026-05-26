import { createHmac } from "crypto";
import { Router } from "express";
import { z } from "zod";
import { getEpisodeBySlug, subscribeEmail } from "../db";
import { serverLogger } from "../_core/logger";

const router = Router();
const baseUrl = "https://zikr-platform.vercel.app";

const subscribeLimiter = new Map<string, number[]>();
const pendingSubscriptions = new Map<string, { email: string; language: "en" | "ar"; expiresAt: number }>();
const WINDOW_MS = 60_000;
const LIMIT_PER_WINDOW = 5;
const TOKEN_TTL_MS = 1000 * 60 * 30;

function prunePending() {
  const now = Date.now();
  pendingSubscriptions.forEach((pending, token) => {
    if (pending.expiresAt < now) pendingSubscriptions.delete(token);
  });
}

function getClientIp(req: any) {
  return req.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim() || req.ip || "unknown";
}

function rateLimited(ip: string) {
  const now = Date.now();
  const hits = subscribeLimiter.get(ip) ?? [];
  const recent = hits.filter((t) => now - t < WINDOW_MS);
  if (recent.length >= LIMIT_PER_WINDOW) return true;
  recent.push(now);
  subscribeLimiter.set(ip, recent);
  return false;
}

function signToken(email: string, language: string) {
  const secret = process.env.SUBSCRIBE_TOKEN_SECRET || process.env.SESSION_SECRET || "zikr-secret";
  return createHmac("sha256", secret).update(`${email}:${language}:${Date.now()}`).digest("hex");
}

async function sendConfirmationEmail(email: string, token: string, language: "en" | "ar") {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    serverLogger.warn("RESEND_API_KEY not configured; confirmation email skipped", { email });
    return;
  }

  const confirmUrl = `${baseUrl}/api/confirm?token=${token}`;
  const subject = language === "ar" ? "تأكيد الاشتراك في ZIKR | ذِكرٌ" : "Confirm your ZIKR | ذِكرٌ subscription";
  const html =
    language === "ar"
      ? `<p>اضغط لتأكيد الاشتراك:</p><p><a href="${confirmUrl}">${confirmUrl}</a></p>`
      : `<p>Please confirm your subscription:</p><p><a href="${confirmUrl}">${confirmUrl}</a></p>`;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL || "ZIKR | ذِكرٌ <noreply@zikr-platform.vercel.app>",
      to: [email],
      subject,
      html,
    }),
  });
}

router.get("/api/og/episode/:slug", async (req, res) => {
  const episode = await getEpisodeBySlug(req.params.slug);
  if (!episode) return res.status(404).send("Episode not found");

  const title = (episode.titleEn || "ZIKR | ذِكرٌ Episode").slice(0, 90);
  const excerpt = (episode.descriptionEn || "Long-form editorial history analysis.").slice(0, 150);

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='630'>
  <defs>
    <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='#020617'/>
      <stop offset='100%' stop-color='#1e293b'/>
    </linearGradient>
  </defs>
  <rect width='1200' height='630' fill='url(#g)'/>
  <text x='72' y='120' fill='#f59e0b' font-size='30' font-family='Inter, Arial'>ZIKR | ذِكرٌ</text>
  <text x='72' y='220' fill='#f8fafc' font-size='56' font-weight='700' font-family='Inter, Arial'>${title.replace(/&/g, "&amp;")}</text>
  <text x='72' y='300' fill='#cbd5e1' font-size='30' font-family='Inter, Arial'>${excerpt.replace(/&/g, "&amp;")}</text>
  <text x='72' y='560' fill='#94a3b8' font-size='24' font-family='Inter, Arial'>zikr-platform.vercel.app</text>
</svg>`;

  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800");
  res.send(svg);
});

router.get("/rss.xml", async (_req, res) => {
  const episodes = (await (await import("../db")).getAllEpisodes()).slice(0, 30);

  const items = episodes
    .map(
      (ep: any) => `<item>
<title><![CDATA[${ep.titleEn}]]></title>
<description><![CDATA[${ep.descriptionEn || ""}]]></description>
<link>${baseUrl}/episodes/${ep.slug}</link>
<guid>${baseUrl}/episodes/${ep.slug}</guid>
<pubDate>${new Date(ep.publishedAt || ep.createdAt || Date.now()).toUTCString()}</pubDate>
</item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
<title>ZIKR | ذِكرٌ</title>
<description>Editorial history episodes and analysis.</description>
<link>${baseUrl}</link>
${items}
</channel>
</rss>`;

  res.setHeader("Cache-Control", "public, max-age=900, s-maxage=86400, stale-while-revalidate=604800");
  res.type("application/rss+xml").send(xml);
});

router.post("/api/subscribe", async (req, res) => {
  prunePending();
  const ip = getClientIp(req);
  if (rateLimited(ip)) return res.status(429).json({ success: false, message: "Too many requests. Try again in a minute." });

  const parsed = z.object({ email: z.string().email(), language: z.enum(["en", "ar"]).default("en") }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: "Please enter a valid email address." });

  const email = parsed.data.email.toLowerCase().trim();
  const token = signToken(email, parsed.data.language);

  pendingSubscriptions.set(token, {
    email,
    language: parsed.data.language,
    expiresAt: Date.now() + TOKEN_TTL_MS,
  });

  try {
    await sendConfirmationEmail(email, token, parsed.data.language);
    return res.json({ success: true, message: "Check your email and confirm your subscription." });
  } catch (error: any) {
    serverLogger.error("Failed to send confirmation email", { email, error: String(error) });
    return res.status(500).json({ success: false, message: "Could not send confirmation email." });
  }
});

router.get("/api/confirm", async (req, res) => {
  const token = req.query.token?.toString();
  if (!token) return res.status(400).send("Missing token");

  const pending = pendingSubscriptions.get(token);
  if (!pending) return res.status(400).send("Invalid or expired token");

  if (pending.expiresAt < Date.now()) {
    pendingSubscriptions.delete(token);
    return res.status(400).send("Token expired");
  }

  try {
    await subscribeEmail(pending.email, pending.language);
    pendingSubscriptions.delete(token);
    return res.redirect(`${baseUrl}/?subscribed=1`);
  } catch (error: any) {
    serverLogger.error("Subscription confirmation failed", { error: String(error), email: pending.email });
    return res.status(500).send("Could not confirm subscription");
  }
});

export default router;
