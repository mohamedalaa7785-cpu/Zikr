import { safeApiFetch } from "@/lib/services/http";
import { supabaseServerAnonRequest } from "@/lib/supabase/server";
import { ServiceError } from "@/lib/types/common";
import type { Ayah, Juz, QuranApiResponse, Surah } from "@/lib/types/quran";
import { surahs as fallbackSurahs } from "@/lib/data/content";

const QURAN_API_BASE = "https://api.alquran.cloud/v1";
const DEBUG_QURAN = process.env.NODE_ENV !== "production";

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

export async function getAllSurahs(locale: Locale = "ar"): Promise<Surah[]> {
  debugLog("getAllSurahs request", { locale });

  const dbSurahs = await readSupabase<DbSurah[]>(
    "/rest/v1/quran_surahs?select=id,name_ar,name_en,name_translation,revelation_place,ayahs_count&order=order.asc"
  );
  if (dbSurahs?.length) {
    debugLog("getAllSurahs Supabase success", { count: dbSurahs.length });
    return dbSurahs.map(surah => mapDbSurah(surah, locale));
  }

  try {
    const { data: response } = await safeApiFetch<QuranApiResponse<Surah[]>>(
      `${QURAN_API_BASE}/surah`
    );
    if (!response || !Array.isArray(response.data)) {
      throw new Error("Invalid response from Quran API");
    }
    debugLog("getAllSurahs API success", { count: response.data.length });
    return locale === "en"
      ? response.data.map(surah => ({ ...surah, name: surah.englishName }))
      : response.data;
  } catch (error) {
    console.error(
      "[quran-service] Failed to fetch surahs, using fallback:",
      error
    );
    return fallbackSurahs.map(s => ({
      number: s.id,
      name: locale === "en" ? s.nameEn : s.nameAr,
      englishName: s.nameEn,
      englishNameTranslation: "",
      numberOfAyahs: s.ayahCount,
      revelationType: s.revelationPlace === "meccan" ? "Meccan" : "Medinan",
    })) as Surah[];
  }
}

export async function getSurahById(
  id: number,
  locale: Locale = "ar"
): Promise<{ surah: Surah; ayahs: Ayah[] } | null> {
  if (!id || id < 1 || id > 114) return null;

  debugLog("getSurahById request", { id, locale });

  const dbSurahs = await readSupabase<DbSurah[]>(
    `/rest/v1/quran_surahs?select=id,name_ar,name_en,name_translation,revelation_place,ayahs_count&id=eq.${id}&limit=1`
  );
  if (dbSurahs?.[0]) {
    const dbAyahs = await readSupabase<DbAyah[]>(
      `/rest/v1/quran_ayahs?select=id,surah_id,ayah_number,text_ar,text_en,text_uthmani,text_simple,page,juz,hizb,rub,sajda&surah_id=eq.${id}&order=ayah_number.asc`
    );
    return {
      surah: mapDbSurah(dbSurahs[0], locale),
      ayahs: (dbAyahs ?? []).map(ayah => mapDbAyah(ayah, locale)),
    };
  }

  const { data: response } = await safeApiFetch<
    QuranApiResponse<{ ayahs: Ayah[] } & Surah>
  >(`${QURAN_API_BASE}/surah/${id}/${EDITIONS[locale]}`);

  if (!response?.data) return null;
  const { ayahs = [], ...surah } = response.data;
  debugLog("getSurahById API success", {
    surah: surah.number,
    ayahCount: ayahs.length,
  });
  return { surah, ayahs };
}

export async function getAyah(
  surahId: number,
  ayahId: number,
  locale: Locale = "ar"
): Promise<Ayah | null> {
  if (surahId < 1 || surahId > 114 || ayahId < 1) return null;

  debugLog("getAyah request", { surahId, ayahId, locale });

  const dbAyahs = await readSupabase<DbAyah[]>(
    `/rest/v1/quran_ayahs?select=id,surah_id,ayah_number,text_ar,text_en,text_uthmani,text_simple,page,juz,hizb,rub,sajda&surah_id=eq.${surahId}&ayah_number=eq.${ayahId}&limit=1`
  );
  if (dbAyahs?.[0]) return mapDbAyah(dbAyahs[0], locale);

  const { data: response } = await safeApiFetch<QuranApiResponse<Ayah>>(
    `${QURAN_API_BASE}/ayah/${surahId}:${ayahId}/${EDITIONS[locale]}`
  );
  debugLog("getAyah API success", {
    number: response?.data?.numberInSurah ?? null,
  });
  return response?.data ?? null;
}

export async function getTafsir(
  surahId: number,
  ayahId: number
): Promise<string | null> {
  if (surahId < 1 || surahId > 114 || ayahId < 1) return null;

  debugLog("getTafsir request", { surahId, ayahId });

  const dbTafsir = await readSupabase<DbTafsir[]>(
    `/rest/v1/quran_tafsir?select=tafsir_ar,tafsir_en&surah_id=eq.${surahId}&ayah_number=eq.${ayahId}&limit=1`
  );
  if (dbTafsir?.[0]) return dbTafsir[0].tafsir_ar;

  const { data: response } = await safeApiFetch<QuranApiResponse<Ayah>>(
    `${QURAN_API_BASE}/ayah/${surahId}:${ayahId}/${EDITIONS.tafsir}`
  );
  return response?.data?.text ?? null;
}

export async function getJuz(
  juzId: number,
  locale: Locale = "ar"
): Promise<Juz | null> {
  if (juzId < 1 || juzId > 30) return null;

  const { data: response } = await safeApiFetch<QuranApiResponse<Juz>>(
    `${QURAN_API_BASE}/juz/${juzId}/${EDITIONS[locale]}`
  );
  return response?.data ?? null;
}

export async function searchQuran(
  query: string,
  locale: Locale = "ar"
): Promise<Ayah[]> {
  const cleanQuery = query.trim();
  if (!cleanQuery) return [];

  const escapedQuery = cleanQuery.replace(/[*,()]/g, "");
  const dbMatches = await readSupabase<DbAyah[]>(
    `/rest/v1/quran_ayahs?select=id,surah_id,ayah_number,text_ar,text_en,text_uthmani,text_simple,page,juz,hizb,rub,sajda&or=${encodeURIComponent(`(text_ar.ilike.*${escapedQuery}*,text_simple.ilike.*${escapedQuery}*,text_uthmani.ilike.*${escapedQuery}*)`)}&limit=20`
  );
  if (dbMatches?.length) return dbMatches.map(ayah => mapDbAyah(ayah, locale));

  try {
    const { data: response } = await safeApiFetch<
      QuranApiResponse<{ matches: Ayah[] }>
    >(
      `${QURAN_API_BASE}/search/${encodeURIComponent(cleanQuery)}/all/${EDITIONS[locale]}`
    );
    return response?.data?.matches ?? [];
  } catch (error) {
    if (error instanceof ServiceError) return [];
    throw error;
  }
}
