/**
 * Enhanced Quran Service with improved error handling and caching
 */

import { safeApiFetch } from "@/lib/services/http";
import { supabaseServerAnonRequest } from "@/lib/supabase/server";
import { ServiceError } from "@/lib/types/common";
import type { Ayah, Juz, QuranApiResponse, Surah } from "@/lib/types/quran";
import { surahs as fallbackSurahs } from "@/lib/data/content";

const QURAN_API_BASE = "https://api.alquran.cloud/v1";
const QURAN_CDN_URL = "https://cdn.islamic.network/quran/audio-surah/128";
const FALLBACK_CDN_URL = "https://everyayah.com/data";
const DEBUG_QURAN = process.env.NODE_ENV !== "production";
const REQUEST_TIMEOUT = 8000; // 8 second timeout

// Cache for in-memory storage (valid for the duration of the request)
const requestCache = new Map<string, any>();

function debugLog(message: string, payload?: unknown) {
  if (!DEBUG_QURAN) return;
  if (payload === undefined) {
    console.debug(`[quran-service] ${message}`);
    return;
  }
  console.debug(`[quran-service] ${message}`, payload);
}

const EDITIONS = {
  ar: "quran-uthmani",
  en: "en.asad",
  tafsir: "ar.jalalayn",
} as const;

type Locale = keyof typeof EDITIONS;

type DbSurah = {
  id: number;
  name_ar: string;
  name_en: string;
  name_translation: string | null;
  revelation_place: string | null;
  ayahs_count: number;
};

type DbAyah = {
  id: string;
  surah_id: number;
  ayah_number: number;
  text_ar: string;
  text_en: string | null;
  text_uthmani: string | null;
  text_simple: string | null;
  page: number | null;
  juz: number | null;
  hizb: number | null;
  rub: number | null;
  sajda: boolean | null;
};

type DbTafsir = {
  tafsir_ar: string;
  tafsir_en: string | null;
};

function mapDbSurah(surah: DbSurah, locale: Locale): Surah {
  return {
    number: surah.id,
    name: locale === "en" ? surah.name_en : surah.name_ar,
    englishName: surah.name_en,
    englishNameTranslation: surah.name_translation ?? "",
    numberOfAyahs: surah.ayahs_count,
    revelationType: surah.revelation_place ?? "",
  };
}

function mapDbAyah(ayah: DbAyah, locale: Locale): Ayah {
  return {
    number: ayah.ayah_number,
    text: locale === "en" ? (ayah.text_en ?? ayah.text_ar) : ayah.text_ar,
    numberInSurah: ayah.ayah_number,
    juz: ayah.juz ?? 0,
    manzil: 0,
    page: ayah.page ?? 0,
    ruku: 0,
    hizbQuarter: ayah.hizb ?? 0,
    sajda: ayah.sajda ?? false,
  };
}

async function readSupabase<T>(path: string): Promise<T | null> {
  try {
    return await supabaseServerAnonRequest<T>(path);
  } catch (error) {
    debugLog(
      "Supabase content read failed; falling back to external API",
      error
    );
    return null;
  }
}

/**
 * Get all Surahs with caching and fallback strategy
 */
export async function getAllSurahs(locale: Locale = "ar"): Promise<Surah[]> {
  debugLog("getAllSurahs request", { locale });

  const cacheKey = `surahs_${locale}`;
  if (requestCache.has(cacheKey)) {
    debugLog("getAllSurahs cache hit");
    return requestCache.get(cacheKey);
  }

  // Try Supabase first
  const dbSurahs = await readSupabase<DbSurah[]>(
    "/rest/v1/quran_surahs?select=id,name_ar,name_en,name_translation,revelation_place,ayahs_count&order=order.asc"
  );

  if (dbSurahs?.length) {
    debugLog("getAllSurahs Supabase success", { count: dbSurahs.length });
    const result = dbSurahs.map((surah) => mapDbSurah(surah, locale));
    requestCache.set(cacheKey, result);
    return result;
  }

  // Fallback to external API
  try {
    const { data: response } = await safeApiFetch<QuranApiResponse<Surah[]>>(
      `${QURAN_API_BASE}/surah`
    );

    if (!response || !Array.isArray(response.data)) {
      throw new Error("Invalid response from Quran API");
    }

    debugLog("getAllSurahs API success", { count: response.data.length });
    const result =
      locale === "en"
        ? response.data.map((surah) => ({ ...surah, name: surah.englishName }))
        : response.data;

    requestCache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error(
      "[quran-service] Failed to fetch surahs, using fallback:",
      error
    );

    // Use fallback data
    const result = fallbackSurahs.map((s) => ({
      number: s.id,
      name: locale === "en" ? s.nameEn : s.nameAr,
      englishName: s.nameEn,
      englishNameTranslation: "",
      numberOfAyahs: s.ayahCount,
      revelationType:
        s.revelationPlace === "meccan" ? "Meccan" : "Medinan",
    })) as Surah[];

    requestCache.set(cacheKey, result);
    return result;
  }
}

/**
 * Get a specific Surah with its Ayahs
 */
export async function getSurahById(
  id: number,
  locale: Locale = "ar"
): Promise<{ surah: Surah; ayahs: Ayah[] } | null> {
  if (!id || id < 1 || id > 114) return null;

  debugLog("getSurahById request", { id, locale });

  const cacheKey = `surah_${id}_${locale}`;
  if (requestCache.has(cacheKey)) {
    debugLog("getSurahById cache hit");
    return requestCache.get(cacheKey);
  }

  // Try Supabase first
  const dbSurahs = await readSupabase<DbSurah[]>(
    `/rest/v1/quran_surahs?select=id,name_ar,name_en,name_translation,revelation_place,ayahs_count&id=eq.${id}&limit=1`
  );

  if (dbSurahs?.[0]) {
    const dbAyahs = await readSupabase<DbAyah[]>(
      `/rest/v1/quran_ayahs?select=id,surah_id,ayah_number,text_ar,text_en,text_uthmani,text_simple,page,juz,hizb,rub,sajda&surah_id=eq.${id}&order=ayah_number.asc`
    );

    const result = {
      surah: mapDbSurah(dbSurahs[0], locale),
      ayahs: (dbAyahs ?? []).map((ayah) => mapDbAyah(ayah, locale)),
    };

    requestCache.set(cacheKey, result);
    return result;
  }

  // Fallback to external API
  try {
    const { data: response } = await safeApiFetch<
      QuranApiResponse<{ ayahs: Ayah[] } & Surah>
    >(`${QURAN_API_BASE}/surah/${id}/${EDITIONS[locale]}`);

    if (!response?.data) return null;

    const { ayahs = [], ...surah } = response.data;

    debugLog("getSurahById API success", {
      surah: surah.number,
      ayahCount: ayahs.length,
    });

    const result = { surah, ayahs };
    requestCache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error("[quran-service] Failed to fetch surah:", error);
    return null;
  }
}

/**
 * Get a specific Ayah
 */
export async function getAyah(
  surahId: number,
  ayahId: number,
  locale: Locale = "ar"
): Promise<Ayah | null> {
  if (surahId < 1 || surahId > 114 || ayahId < 1) return null;

  debugLog("getAyah request", { surahId, ayahId, locale });

  const cacheKey = `ayah_${surahId}_${ayahId}_${locale}`;
  if (requestCache.has(cacheKey)) {
    debugLog("getAyah cache hit");
    return requestCache.get(cacheKey);
  }

  // Try Supabase first
  const dbAyahs = await readSupabase<DbAyah[]>(
    `/rest/v1/quran_ayahs?select=id,surah_id,ayah_number,text_ar,text_en,text_uthmani,text_simple,page,juz,hizb,rub,sajda&surah_id=eq.${surahId}&ayah_number=eq.${ayahId}&limit=1`
  );

  if (dbAyahs?.[0]) {
    const result = mapDbAyah(dbAyahs[0], locale);
    requestCache.set(cacheKey, result);
    return result;
  }

  // Fallback to external API
  try {
    const { data: response } = await safeApiFetch<QuranApiResponse<Ayah>>(
      `${QURAN_API_BASE}/ayah/${surahId}:${ayahId}/${EDITIONS[locale]}`
    );

    debugLog("getAyah API success", {
      number: response?.data?.numberInSurah ?? null,
    });

    const result = response?.data ?? null;
    requestCache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error("[quran-service] Failed to fetch ayah:", error);
    return null;
  }
}

/**
 * Get Tafsir (interpretation) for an Ayah
 */
export async function getTafsir(
  surahId: number,
  ayahId: number
): Promise<string | null> {
  if (surahId < 1 || surahId > 114 || ayahId < 1) return null;

  debugLog("getTafsir request", { surahId, ayahId });

  const cacheKey = `tafsir_${surahId}_${ayahId}`;
  if (requestCache.has(cacheKey)) {
    debugLog("getTafsir cache hit");
    return requestCache.get(cacheKey);
  }

  // Try Supabase first
  const dbTafsir = await readSupabase<DbTafsir[]>(
    `/rest/v1/quran_tafsir?select=tafsir_ar,tafsir_en&surah_id=eq.${surahId}&ayah_number=eq.${ayahId}&limit=1`
  );

  if (dbTafsir?.[0]) {
    const result = dbTafsir[0].tafsir_ar;
    requestCache.set(cacheKey, result);
    return result;
  }

  // Fallback to external API
  try {
    const { data: response } = await safeApiFetch<QuranApiResponse<Ayah>>(
      `${QURAN_API_BASE}/ayah/${surahId}:${ayahId}/${EDITIONS.tafsir}`
    );

    const result = response?.data?.text ?? null;
    requestCache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error("[quran-service] Failed to fetch tafsir:", error);
    return null;
  }
}

/**
 * Get a Juz (part) of the Quran
 */
export async function getJuz(
  juzId: number,
  locale: Locale = "ar"
): Promise<Juz | null> {
  if (juzId < 1 || juzId > 30) return null;

  try {
    const { data: response } = await safeApiFetch<QuranApiResponse<Juz>>(
      `${QURAN_API_BASE}/juz/${juzId}/${EDITIONS[locale]}`
    );

    return response?.data ?? null;
  } catch (error) {
    console.error("[quran-service] Failed to fetch juz:", error);
    return null;
  }
}

/**
 * Search the Quran
 */
export async function searchQuran(
  query: string,
  locale: Locale = "ar"
): Promise<Ayah[]> {
  const cleanQuery = query.trim();
  if (!cleanQuery) return [];

  const escapedQuery = cleanQuery.replace(/[*,()]/g, "");

  // Try Supabase first
  const dbMatches = await readSupabase<DbAyah[]>(
    `/rest/v1/quran_ayahs?select=id,surah_id,ayah_number,text_ar,text_en,text_uthmani,text_simple,page,juz,hizb,rub,sajda&or=${encodeURIComponent(
      `(text_ar.ilike.*${escapedQuery}*,text_simple.ilike.*${escapedQuery}*,text_uthmani.ilike.*${escapedQuery}*)`
    )}&limit=20`
  );

  if (dbMatches?.length)
    return dbMatches.map((ayah) => mapDbAyah(ayah, locale));

  // Fallback to external API
  try {
    const { data: response } = await safeApiFetch<
      QuranApiResponse<{ matches: Ayah[] }>
    >(
      `${QURAN_API_BASE}/search/${encodeURIComponent(
        cleanQuery
      )}/all/${EDITIONS[locale]}`
    );

    return response?.data?.matches ?? [];
  } catch (error) {
    if (error instanceof ServiceError) return [];
    throw error;
  }
}

/**
 * Get audio URL for a Surah with multiple fallback sources
 */
export function getAudioUrl(
  surahId: number,
  reciterCode: string
): { primary: string; fallback: string[] } {
  const surahNumber = String(surahId).padStart(3, "0");
  const primary = `${QURAN_CDN_URL}/${reciterCode}/${surahNumber}.mp3`;
  const fallback = [
    `${FALLBACK_CDN_URL}/${reciterCode}/${surahNumber}.mp3`,
  ];

  return { primary, fallback };
}
