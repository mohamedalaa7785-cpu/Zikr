'use server';

import { supabaseServerAnonRequest } from "@/lib/supabase/server";
import type { Surah, Ayah, Reciter } from "@/lib/types/quran";

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

type DbReciter = {
  id: string;
  code: string;
  name_ar: string;
  name_en: string;
  base_url_template: string;
};

export async function getSurahFromDb(surahId: number): Promise<DbSurah | null> {
  try {
    const result = await supabaseServerAnonRequest<DbSurah[]>(
      `/rest/v1/quran_surahs?id=eq.${surahId}&select=id,name_ar,name_en,name_translation,revelation_place,ayahs_count`
    );
    return result?.[0] ?? null;
  } catch (error) {
    console.error(`[quran-server] Failed to fetch surah ${surahId}:`, error);
    return null;
  }
}

export async function getAyahFromDb(
  surahId: number,
  ayahNumber: number
): Promise<DbAyah | null> {
  try {
    const result = await supabaseServerAnonRequest<DbAyah[]>(
      `/rest/v1/quran_ayahs?surah_id=eq.${surahId}&ayah_number=eq.${ayahNumber}&limit=1`
    );
    return result?.[0] ?? null;
  } catch (error) {
    console.error(
      `[quran-server] Failed to fetch ayah ${surahId}:${ayahNumber}:`,
      error
    );
    return null;
  }
}

export async function getRecitersFromDb(): Promise<DbReciter[] | null> {
  try {
    const result = await supabaseServerAnonRequest<DbReciter[]>(
      `/rest/v1/quran_reciters?select=id,code,name_ar,name_en,base_url_template`
    );
    return result ?? null;
  } catch (error) {
    console.error("[quran-server] Failed to fetch reciters:", error);
    return null;
  }
}

export async function getTafsirFromDb(
  surahId: number,
  ayahNumber: number
): Promise<string | null> {
  try {
    const result = await supabaseServerAnonRequest<
      Array<{ tafsir_text: string }>
    >(
      `/rest/v1/quran_tafsir?surah_id=eq.${surahId}&ayah_number=eq.${ayahNumber}&limit=1&select=tafsir_text`
    );
    return result?.[0]?.tafsir_text ?? null;
  } catch (error) {
    console.error(
      `[quran-server] Failed to fetch tafsir ${surahId}:${ayahNumber}:`,
      error
    );
    return null;
  }
}
