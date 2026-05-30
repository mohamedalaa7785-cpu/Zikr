import { safeFetchJson } from "@/lib/services/_http";
import type { ServiceResult, SupportedLocale } from "@/lib/types/common";
import type { Ayah, Juz, QuranApiResponse, QuranSearchHit, Surah } from "@/lib/types/quran";

const QURAN_BASE_URL = "https://api.alquran.cloud/v1";

async function fetchQuran<T>(path: string): Promise<ServiceResult<QuranApiResponse<T>>> {
  return safeFetchJson<QuranApiResponse<T>>(`${QURAN_BASE_URL}${path}`, undefined, {
    revalidate: 600,
    tags: ["quran"],
  });
}

export async function getAllSurahs(): Promise<ServiceResult<Surah[]>> {
  const response = await fetchQuran<Surah[]>("/surah");
  return { ...response, data: response.data?.data ?? null };
}

export async function getSurahById(id: number, locale: SupportedLocale = "ar"): Promise<ServiceResult<Ayah[]>> {
  const edition = locale === "ar" ? "quran-uthmani" : "en.asad";
  const response = await fetchQuran<{ ayahs: Ayah[] }>(`/surah/${id}/${edition}`);
  return { ...response, data: response.data?.data?.ayahs ?? null };
}

export async function getAyah(surahId: number, ayahId: number, locale: SupportedLocale = "ar"): Promise<ServiceResult<Ayah>> {
  const edition = locale === "ar" ? "quran-uthmani" : "en.asad";
  const response = await fetchQuran<Ayah>(`/ayah/${surahId}:${ayahId}/${edition}`);
  return { ...response, data: response.data?.data ?? null };
}

export async function getJuz(juzId: number, locale: SupportedLocale = "ar"): Promise<ServiceResult<Juz>> {
  const edition = locale === "ar" ? "quran-uthmani" : "en.asad";
  const response = await fetchQuran<Juz>(`/juz/${juzId}/${edition}`);
  return { ...response, data: response.data?.data ?? null };
}

export async function searchQuran(query: string, locale: SupportedLocale = "ar"): Promise<ServiceResult<QuranSearchHit[]>> {
  const trimmed = query.trim();
  if (!trimmed) {
    return { data: [], error: null, fetchedAt: new Date().toISOString(), fromCache: false };
  }

  const edition = locale === "ar" ? "quran-uthmani" : "en.asad";
  const response = await fetchQuran<{ matches: Ayah[] }>(`/search/${encodeURIComponent(trimmed)}/all/${edition}`);

  return {
    ...response,
    data:
      response.data?.data?.matches?.map((ayah) => ({
        id: `${ayah.surah.number}:${ayah.numberInSurah}`,
        surahNumber: ayah.surah.number,
        ayahNumber: ayah.numberInSurah,
        text: ayah.text,
        locale,
      })) ?? [],
  };
}

// NOTE: We intentionally keep payloads generic to support future tafsir/audio enrichments.
