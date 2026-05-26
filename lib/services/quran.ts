import { safeApiFetch } from '@/lib/services/http';
import { ServiceError } from '@/lib/types/common';
import type { Ayah, Juz, QuranApiResponse, Surah } from '@/lib/types/quran';

const QURAN_API_BASE = 'https://api.alquran.cloud/v1';
const DEBUG_QURAN = process.env.NODE_ENV !== 'production';

function debugLog(message: string, payload?: unknown) {
  if (!DEBUG_QURAN) return;
  if (payload === undefined) {
    console.debug(`[quran-service] ${message}`);
    return;
  }
  console.debug(`[quran-service] ${message}`, payload);
}

const EDITIONS = {
  ar: 'quran-uthmani',
  en: 'en.asad',
} as const;

type Locale = keyof typeof EDITIONS;

export async function getAllSurahs(locale: Locale = 'ar'): Promise<Surah[]> {
  debugLog('getAllSurahs request', { locale });
  const response = await safeApiFetch<QuranApiResponse<Surah[]>>(`${QURAN_API_BASE}/surah`);
  if (!Array.isArray(response.data)) return [];
  debugLog('getAllSurahs success', { count: response.data.length });
  return locale === 'en'
    ? response.data.map((surah) => ({ ...surah, name: surah.englishName }))
    : response.data;
}

export async function getSurahById(id: number, locale: Locale = 'ar'): Promise<{ surah: Surah; ayahs: Ayah[] } | null> {
  if (!id || id < 1 || id > 114) return null;

  debugLog('getSurahById request', { id, locale });
  const response = await safeApiFetch<QuranApiResponse<{ ayahs: Ayah[] } & Surah>>(
    `${QURAN_API_BASE}/surah/${id}/${EDITIONS[locale]}`,
  );

  if (!response?.data) return null;
  const { ayahs = [], ...surah } = response.data;
  debugLog('getSurahById success', { surah: surah.number, ayahCount: ayahs.length });
  return { surah, ayahs };
}

export async function getAyah(surahId: number, ayahId: number, locale: Locale = 'ar'): Promise<Ayah | null> {
  if (surahId < 1 || surahId > 114 || ayahId < 1) return null;

  debugLog('getAyah request', { surahId, ayahId, locale });
  const response = await safeApiFetch<QuranApiResponse<Ayah>>(
    `${QURAN_API_BASE}/ayah/${surahId}:${ayahId}/${EDITIONS[locale]}`,
  );
  debugLog('getAyah success', { number: response.data?.numberInSurah ?? null });
  return response.data ?? null;
}

export async function getJuz(juzId: number, locale: Locale = 'ar'): Promise<Juz | null> {
  if (juzId < 1 || juzId > 30) return null;

  const response = await safeApiFetch<QuranApiResponse<Juz>>(`${QURAN_API_BASE}/juz/${juzId}/${EDITIONS[locale]}`);
  return response.data ?? null;
}

export async function searchQuran(query: string, locale: Locale = 'ar'): Promise<Ayah[]> {
  const cleanQuery = query.trim();
  if (!cleanQuery) return [];

  try {
    const response = await safeApiFetch<QuranApiResponse<{ matches: Ayah[] }>>(
      `${QURAN_API_BASE}/search/${encodeURIComponent(cleanQuery)}/all/${EDITIONS[locale]}`,
    );
    return response.data?.matches ?? [];
  } catch (error) {
    if (error instanceof ServiceError) return [];
    throw error;
  }
}

// Future expansion notes:
// - Add tafsir endpoint adapter with normalized TafsirEntry type.
// - Add audio/recitation endpoint support with edition-based caching tags.
// - Plug bookmarks by persisting (surah, ayah, locale) to Supabase profiles.
