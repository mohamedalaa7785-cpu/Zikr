#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Load .env.local manually
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "..", ".env.local");

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...valueParts] = trimmed.split("=");
      if (key && valueParts.length > 0) {
        const value = valueParts.join("=").replace(/^["']|["']$/g, "");
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  });
}

const REQUIRED_RUNTIME_VARS = [];

const REQUIRED_MIGRATION_VARS = [];
const OPTIONAL_INTEGRATIONS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_SITE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "AUTH_CALLBACK_URL",
  "DATABASE_URL",
  "GEMINI_API_KEY",
  "GEMINI_MODEL",
  "YOUTUBE_API_KEY",
  "YOUTUBE_CHANNEL_ID",
  "QURAN_API_BASE_URL",
  "QURAN_AUDIO_CDN_URL",
  "HADITH_API_BASE_URL",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "AWS_S3_ACCESS_KEY_ID",
  "AWS_S3_SECRET_ACCESS_KEY",
  "AWS_S3_BUCKET_NAME",
  "AWS_S3_REGION",
  "AWS_S3_PUBLIC_BASE_URL",
  "CRON_SECRET",
];

const TIMEOUT_MS = 8000;
const results = [];

function addResult(status, label, detail) {
  results.push({ status, label, detail });
}

function isSupabaseAuthCallback(value) {
  if (!value) return false;

  try {
    const url = new URL(value);
    return (
      url.hostname.endsWith(".supabase.co") &&
      url.pathname === "/auth/v1/callback"
    );
  } catch {
    return false;
  }
}

function withNumberedAliases(names) {
  return names.flatMap(name => [
    name,
    `${name}_19`,
    `${name}_20`,
    `${name}_22`,
  ]);
}

function getEnv(name) {
  const aliases = {
    NEXT_PUBLIC_SUPABASE_URL: withNumberedAliases([
      "NEXT_PUBLIC_SUPABASE_URL",
      "SUPABASE_URL",
    ]),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: withNumberedAliases([
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "SUPABASE_ANON_KEY",
      "SUPABASE_PUBLISHABLE_KEY",
    ]),
    DATABASE_URL: withNumberedAliases([
      "DATABASE_URL",
      "POSTGRES_URL",
      "POSTGRES_URL_NON_POOLING",
      "POSTGRES_PRISMA_URL",
    ]),
    AWS_S3_ACCESS_KEY_ID: withNumberedAliases([
      "AWS_S3_ACCESS_KEY_ID",
      "AWS_ACCESS_KEY_ID",
    ]),
    AWS_S3_SECRET_ACCESS_KEY: withNumberedAliases([
      "AWS_S3_SECRET_ACCESS_KEY",
      "AWS_SECRET_ACCESS_KEY",
    ]),
    AWS_S3_REGION: withNumberedAliases(["AWS_S3_REGION", "AWS_REGION"]),
    SUPABASE_SERVICE_ROLE_KEY: withNumberedAliases([
      "SUPABASE_SERVICE_ROLE_KEY",
      "SUPABASE_SECRET_KEY",
    ]),
  };

  for (const key of aliases[name] || [name]) {
    const value = process.env[key]?.trim();
    if (!value) continue;

    if (name === "AUTH_CALLBACK_URL" && isSupabaseAuthCallback(value)) {
      continue;
    }

    return value;
  }

  if (name === "AUTH_CALLBACK_URL") {
    const siteUrl = getEnv("NEXT_PUBLIC_SITE_URL");
    if (siteUrl) return `${siteUrl.replace(/\/$/, "")}/auth/callback`;
  }

  return undefined;
}

function parseUrl(name) {
  const value = getEnv(name);
  if (!value) return null;

  try {
    return new URL(value);
  } catch {
    addResult("fail", name, "must be a valid URL");
    return null;
  }
}

function validatePresence() {
  for (const name of REQUIRED_RUNTIME_VARS) {
    if (!getEnv(name))
      addResult("fail", name, "missing required runtime variable");
  }

  for (const name of REQUIRED_MIGRATION_VARS) {
    if (!getEnv(name))
      addResult(
        "warn",
        name,
        "missing; required before running Supabase migrations"
      );
  }

  for (const name of OPTIONAL_INTEGRATIONS) {
    if (!getEnv(name))
      addResult("warn", name, "optional integration is not configured");
  }
}

function validateUrls() {
  const supabaseUrl = parseUrl("NEXT_PUBLIC_SUPABASE_URL");
  const siteUrl = parseUrl("NEXT_PUBLIC_SITE_URL");
  const callbackUrl = parseUrl("AUTH_CALLBACK_URL");
  parseUrl("QURAN_API_BASE_URL");
  parseUrl("QURAN_AUDIO_CDN_URL");
  parseUrl("HADITH_API_BASE_URL");

  if (supabaseUrl && !supabaseUrl.hostname.endsWith(".supabase.co")) {
    addResult(
      "warn",
      "NEXT_PUBLIC_SUPABASE_URL",
      "host does not look like a Supabase project URL"
    );
  }

  if (siteUrl && callbackUrl) {
    if (siteUrl.origin !== callbackUrl.origin) {
      addResult(
        "fail",
        "AUTH_CALLBACK_URL",
        "must use the same origin as NEXT_PUBLIC_SITE_URL"
      );
    }

    if (callbackUrl.pathname !== "/auth/callback") {
      addResult(
        "fail",
        "AUTH_CALLBACK_URL",
        "must end with /auth/callback; /api/auth/callback is not an app route here"
      );
    }
  }
}

function validateAwsS3() {
  const names = [
    "AWS_S3_ACCESS_KEY_ID",
    "AWS_S3_SECRET_ACCESS_KEY",
    "AWS_S3_BUCKET_NAME",
    "AWS_S3_REGION",
  ];
  const configured = names.filter(name => Boolean(getEnv(name)));

  if (configured.length > 0 && configured.length < names.length) {
    addResult(
      "fail",
      "AWS S3",
      `partial configuration; set all of ${names.join(", ")}`
    );
  }

  if (configured.length === names.length) {
    addResult("pass", "AWS S3", "required upload variables are configured");
  }
}

function validateDatabaseUrl() {
  const databaseUrl = getEnv("DATABASE_URL");
  if (!databaseUrl) return;

  if (/\s/.test(databaseUrl)) {
    addResult("fail", "DATABASE_URL", "must not contain spaces or line breaks");
  }

  try {
    const parsed = new URL(databaseUrl);
    if (!["postgres:", "postgresql:"].includes(parsed.protocol)) {
      addResult(
        "fail",
        "DATABASE_URL",
        "must use postgres:// or postgresql://"
      );
    }
    if (
      !parsed.username ||
      !parsed.hostname ||
      !parsed.pathname ||
      parsed.pathname === "/"
    ) {
      addResult(
        "fail",
        "DATABASE_URL",
        "must include username, host, and database name"
      );
    }
  } catch {
    addResult(
      "fail",
      "DATABASE_URL",
      "must be a valid Postgres connection string; URL-encode special password characters like @ as %40"
    );
  }
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

async function validateSupabaseRest() {
  const supabaseUrl = getEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  if (!supabaseUrl || !anonKey) return;

  try {
    const response = await fetchWithTimeout(
      `${supabaseUrl.replace(/\/$/, "")}/rest/v1/`,
      {
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${anonKey}`,
        },
      }
    );

    if (response.ok) {
      addResult(
        "pass",
        "Supabase REST",
        "reachable with NEXT_PUBLIC_SUPABASE_ANON_KEY"
      );
    } else {
      addResult(
        "fail",
        "Supabase REST",
        `returned HTTP ${response.status}; check project URL and anon key`
      );
    }
  } catch (error) {
    addResult(
      "fail",
      "Supabase REST",
      error instanceof Error ? error.message : "request failed"
    );
  }
}

async function validateYoutube() {
  const apiKey = getEnv("YOUTUBE_API_KEY");
  const channelId = getEnv("YOUTUBE_CHANNEL_ID");
  if (!apiKey || !channelId) return;

  const params = new URLSearchParams({
    part: "id",
    id: channelId,
    key: apiKey,
  });
  try {
    const response = await fetchWithTimeout(
      `https://www.googleapis.com/youtube/v3/channels?${params.toString()}`
    );
    if (!response.ok) {
      addResult(
        "fail",
        "YouTube API",
        `returned HTTP ${response.status}; check YOUTUBE_API_KEY and YOUTUBE_CHANNEL_ID`
      );
      return;
    }

    const payload = await response.json();
    if (Array.isArray(payload.items) && payload.items.length > 0) {
      addResult("pass", "YouTube API", "channel is reachable");
    } else {
      addResult(
        "fail",
        "YouTube API",
        "channel was not found for YOUTUBE_CHANNEL_ID"
      );
    }
  } catch (error) {
    addResult(
      "fail",
      "YouTube API",
      error instanceof Error ? error.message : "request failed"
    );
  }
}

function printResults() {
  const icon = { pass: "✅", warn: "⚠️", fail: "❌" };
  for (const result of results) {
    console.log(`${icon[result.status]} ${result.label}: ${result.detail}`);
  }

  const failures = results.filter(result => result.status === "fail").length;
  const warnings = results.filter(result => result.status === "warn").length;
  console.log(
    `\nDeployment env check completed with ${failures} failure(s) and ${warnings} warning(s).`
  );

  if (failures > 0) process.exitCode = 1;
}

validatePresence();
validateUrls();
validateDatabaseUrl();
validateAwsS3();
await validateSupabaseRest();
await validateYoutube();
printResults();
