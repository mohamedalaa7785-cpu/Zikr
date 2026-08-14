'use client';

import { offlineDb } from '@/lib/offline-db';

type OfflineManifest = {
  version: string;
  generatedAt: string;
  source: string;
  licenseNote: string;
  datasets: Record<string, { path: string; count: number }>;
  routes: string[];
};

const STORE_BY_DATASET: Record<string, string> = {
  surahs: 'surahs',
  ayahs: 'ayahs',
  tafsir: 'tafsir',
  hadith_books: 'hadithBooks',
  hadith: 'hadith',
  prophets: 'prophets',
  prophet_sections: 'prophetSections',
  battles: 'battles',
  battle_events: 'battleEvents',
  conquests: 'conquests',
  conquest_events: 'conquestEvents',
  articles: 'articles',
  duas: 'duas',
  kids: 'kids',
  companions: 'companions',
  companion_stories: 'companionStories',
};

const MANIFEST_URL = '/offline-content/v1/manifest.json';
const VERSION_KEY = 'offline-content-version';

export async function fetchOfflineManifest(): Promise<OfflineManifest | null> {
  if (typeof window === 'undefined') return null;
  try {
    const response = await fetch(MANIFEST_URL, { cache: 'no-store' });
    if (!response.ok) return null;
    return (await response.json()) as OfflineManifest;
  } catch {
    return null;
  }
}

export async function hydrateOfflineContent(options: { force?: boolean } = {}): Promise<OfflineManifest | null> {
  if (typeof window === 'undefined') return null;
  const manifest = await fetchOfflineManifest();
  if (!manifest) return null;

  const previousVersion = window.localStorage.getItem(VERSION_KEY);
  if (!options.force && previousVersion === manifest.version && offlineDb.isReady()) {
    return manifest;
  }

  await offlineDb.initialize();
  for (const [dataset, definition] of Object.entries(manifest.datasets)) {
    const storeName = STORE_BY_DATASET[dataset];
    if (!storeName || !definition?.path) continue;
    try {
      const response = await fetch(definition.path, { cache: 'force-cache' });
      if (!response.ok) continue;
      const rows = await response.json();
      if (Array.isArray(rows)) await offlineDb.setMany(storeName, rows);
    } catch (error) {
      console.warn(`[OfflinePack] Failed to hydrate ${dataset}`, error);
    }
  }

  window.localStorage.setItem(VERSION_KEY, manifest.version);
  return manifest;
}

export async function getOfflineDataset<T>(dataset: string): Promise<T[]> {
  const storeName = STORE_BY_DATASET[dataset];
  if (!storeName) return [];
  await offlineDb.initialize();
  return offlineDb.getAll<T>(storeName);
}
