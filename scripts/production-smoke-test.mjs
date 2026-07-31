#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "..", ".env.local");
const TIMEOUT_MS = 10_000;
const results = [];

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [key, ...valueParts] = trimmed.split("=");
    if (!key || valueParts.length === 0 || process.env[key]) continue;
    process.env[key] = valueParts.join("=").replace(/^["']|["']$/g, "");
  }
}

function env(name, aliases = []) {
  for (const key of [name, ...aliases]) {
    const value = process.env[key]?.trim();
    if (value) return value;
  }
  return undefined;
}

function add(status, label, detail) {
  results.push({ status, label, detail });
}

async function fetchWithTimeout(url, init = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function checkRoute(baseUrl, route) {
  const url = new URL(route, baseUrl).toString();
  try {
    const response = await fetchWithTimeout(url, {
      headers: { Accept: "text/html,application/xhtml+xml" },
    });
    if (response.ok) {
      add("pass", `Route ${route}`, `HTTP ${response.status}`);
      return;
    }
    add("fail", `Route ${route}`, `HTTP ${response.status}`);
  } catch (error) {
    add("fail", `Route ${route}`, error instanceof Error ? error.message : "request failed");
  }
}

async function checkSupabaseTable(supabaseUrl, anonKey, table) {
  const url = `${supabaseUrl.replace(/\/$/, "")}/rest/v1/${table}?limit=1`;
  try {
    const response = await fetchWithTimeout(url, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        Accept: "application/json",
      },
    });
    if (response.ok) {
      add("pass", `Supabase ${table}`, `HTTP ${response.status}`);
      return;
    }
    add("fail", `Supabase ${table}`, `HTTP ${response.status}`);
  } catch (error) {
    add("fail", `Supabase ${table}`, error instanceof Error ? error.message : "request failed");
  }
}

const siteUrl = env("NEXT_PUBLIC_SITE_URL");
const supabaseUrl = env("NEXT_PUBLIC_SUPABASE_URL", ["SUPABASE_URL"]);
const anonKey = env("NEXT_PUBLIC_SUPABASE_ANON_KEY", ["SUPABASE_ANON_KEY", "SUPABASE_PUBLISHABLE_KEY"]);

if (!siteUrl) add("fail", "NEXT_PUBLIC_SITE_URL", "missing");
if (!supabaseUrl) add("fail", "NEXT_PUBLIC_SUPABASE_URL", "missing");
if (!anonKey) add("fail", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "missing");

if (siteUrl) {
  for (const route of ["/", "/quran", "/quran/1", "/hadith", "/dua", "/profile", "/search", "/settings"]) {
    await checkRoute(siteUrl, route);
  }
}

if (supabaseUrl && anonKey) {
  for (const table of ["quran_chapters", "verses", "hadith_books", "hadith_collection", "duas", "videos", "video_generation_requests", "social_publish_queue"]) {
    await checkSupabaseTable(supabaseUrl, anonKey, table);
  }
}

const icon = { pass: "✅", fail: "❌" };
for (const result of results) {
  console.log(`${icon[result.status]} ${result.label}: ${result.detail}`);
}

const failures = results.filter(result => result.status === "fail").length;
console.log(`\nProduction smoke test completed with ${failures} failure(s).`);
if (failures > 0) process.exitCode = 1;
