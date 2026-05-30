#!/usr/bin/env node

const REQUIRED_RUNTIME_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_SITE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'AUTH_CALLBACK_URL',
];

const REQUIRED_MIGRATION_VARS = ['DATABASE_URL'];
const OPTIONAL_INTEGRATIONS = [
  'GEMINI_API_KEY',
  'GEMINI_MODEL',
  'YOUTUBE_API_KEY',
  'YOUTUBE_CHANNEL_ID',
  'QURAN_API_BASE_URL',
  'QURAN_AUDIO_CDN_URL',
  'HADITH_API_BASE_URL',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
];

const TIMEOUT_MS = 8000;
const results = [];

function addResult(status, label, detail) {
  results.push({ status, label, detail });
}

function getEnv(name) {
  const value = process.env[name]?.trim();
  return value || undefined;
}

function parseUrl(name) {
  const value = getEnv(name);
  if (!value) return null;

  try {
    return new URL(value);
  } catch {
    addResult('fail', name, 'must be a valid URL');
    return null;
  }
}

function validatePresence() {
  for (const name of REQUIRED_RUNTIME_VARS) {
    if (!getEnv(name)) addResult('fail', name, 'missing required runtime variable');
  }

  for (const name of REQUIRED_MIGRATION_VARS) {
    if (!getEnv(name)) addResult('warn', name, 'missing; required before running Supabase migrations');
  }

  for (const name of OPTIONAL_INTEGRATIONS) {
    if (!getEnv(name)) addResult('warn', name, 'optional integration is not configured');
  }
}

function validateUrls() {
  const supabaseUrl = parseUrl('NEXT_PUBLIC_SUPABASE_URL');
  const siteUrl = parseUrl('NEXT_PUBLIC_SITE_URL');
  const callbackUrl = parseUrl('AUTH_CALLBACK_URL');
  parseUrl('QURAN_API_BASE_URL');
  parseUrl('QURAN_AUDIO_CDN_URL');
  parseUrl('HADITH_API_BASE_URL');

  if (supabaseUrl && !supabaseUrl.hostname.endsWith('.supabase.co')) {
    addResult('warn', 'NEXT_PUBLIC_SUPABASE_URL', 'host does not look like a Supabase project URL');
  }

  if (siteUrl && callbackUrl) {
    if (siteUrl.origin !== callbackUrl.origin) {
      addResult('fail', 'AUTH_CALLBACK_URL', 'must use the same origin as NEXT_PUBLIC_SITE_URL');
    }

    if (callbackUrl.pathname !== '/auth/callback') {
      addResult('fail', 'AUTH_CALLBACK_URL', 'must end with /auth/callback; /api/auth/callback is not an app route here');
    }
  }
}

function validateDatabaseUrl() {
  const databaseUrl = getEnv('DATABASE_URL');
  if (!databaseUrl) return;

  if (/\s/.test(databaseUrl)) {
    addResult('fail', 'DATABASE_URL', 'must not contain spaces or line breaks');
  }

  try {
    const parsed = new URL(databaseUrl);
    if (!['postgres:', 'postgresql:'].includes(parsed.protocol)) {
      addResult('fail', 'DATABASE_URL', 'must use postgres:// or postgresql://');
    }
    if (!parsed.username || !parsed.hostname || !parsed.pathname || parsed.pathname === '/') {
      addResult('fail', 'DATABASE_URL', 'must include username, host, and database name');
    }
  } catch {
    addResult('fail', 'DATABASE_URL', 'must be a valid Postgres connection string; URL-encode special password characters like @ as %40');
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
  const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL');
  const anonKey = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  if (!supabaseUrl || !anonKey) return;

  try {
    const response = await fetchWithTimeout(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
    });

    if (response.ok) {
      addResult('pass', 'Supabase REST', 'reachable with NEXT_PUBLIC_SUPABASE_ANON_KEY');
    } else {
      addResult('fail', 'Supabase REST', `returned HTTP ${response.status}; check project URL and anon key`);
    }
  } catch (error) {
    addResult('fail', 'Supabase REST', error instanceof Error ? error.message : 'request failed');
  }
}

async function validateYoutube() {
  const apiKey = getEnv('YOUTUBE_API_KEY');
  const channelId = getEnv('YOUTUBE_CHANNEL_ID');
  if (!apiKey || !channelId) return;

  const params = new URLSearchParams({ part: 'id', id: channelId, key: apiKey });
  try {
    const response = await fetchWithTimeout(`https://www.googleapis.com/youtube/v3/channels?${params.toString()}`);
    if (!response.ok) {
      addResult('fail', 'YouTube API', `returned HTTP ${response.status}; check YOUTUBE_API_KEY and YOUTUBE_CHANNEL_ID`);
      return;
    }

    const payload = await response.json();
    if (Array.isArray(payload.items) && payload.items.length > 0) {
      addResult('pass', 'YouTube API', 'channel is reachable');
    } else {
      addResult('fail', 'YouTube API', 'channel was not found for YOUTUBE_CHANNEL_ID');
    }
  } catch (error) {
    addResult('fail', 'YouTube API', error instanceof Error ? error.message : 'request failed');
  }
}

function printResults() {
  const icon = { pass: '✅', warn: '⚠️', fail: '❌' };
  for (const result of results) {
    console.log(`${icon[result.status]} ${result.label}: ${result.detail}`);
  }

  const failures = results.filter((result) => result.status === 'fail').length;
  const warnings = results.filter((result) => result.status === 'warn').length;
  console.log(`\nDeployment env check completed with ${failures} failure(s) and ${warnings} warning(s).`);

  if (failures > 0) process.exitCode = 1;
}

validatePresence();
validateUrls();
validateDatabaseUrl();
await validateSupabaseRest();
await validateYoutube();
printResults();
