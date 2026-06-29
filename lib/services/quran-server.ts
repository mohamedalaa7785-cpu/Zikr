'use server';

import { supabaseServerAnonRequest } from "@/lib/supabase/server";
import type { Surah, Ayah, Reciter } from "@/lib/types/quran";
import { 
  mapDbSurah, 
  mapDbAyah, 
  mapDbReciter,
  type DbSurah,
  type DbAyah,
  type DbReciter,
  type DbTafsir,
  type Locale
} from "./quran";

/**
 * DB-First Quran Service (Server-Only)
 * This module interacts directly with Supabase REST API.
 */

export async function getAllSurahsFromDb(locale: Locale = "ar"): Promise<Surah[] | null> {
  try {
    const dbSurahs = await supabaseServerAnonRequest<DbSurah[]>(
      "/rest/v1/quran_surahs?select=id,name_ar,name_en,name_translation,revelation_place,ayahs_count&order=id.asc"
    );
    
    if (!dbSurahs?.length) return null;
    return dbSurahs.map(surah => mapDbSurah(surah, locale));
  } catch (error) {
    console.error("[quran-server] getAllSurahsFromDb failed:", error);
    return null;
  }
}

export async function getSurahFromDb(
  surahId: number, 
  locale: Locale = "ar"
): Promise<{ surah: Surah; ayahs: Ayah[] } | null> {
  try {
    // 1. Get Surah Metadata
    const dbSurahs = await supabaseServerAnonRequest<DbSurah[]>(
      `/rest/v1/quran_surahs?id=eq.${surahId}&select=id,name_ar,name_en,name_translation,revelation_place,ayahs_count`
    );
    
    if (!dbSurahs?.[0]) return null;

    // 2. Get Ayahs for this Surah
    const dbAyahs = await supabaseServerAnonRequest<DbAyah[]>(
      `/rest/v1/quran_ayahs?surah_id=eq.${surahId}&select=id,surah_id,ayah_number,text_ar,text_en,text_uthmani,text_simple,page,juz,hizb,rub,sajda&order=ayah_number.asc`
    );

    return {
      surah: mapDbSurah(dbSurahs[0], locale),
      ayahs: (dbAyahs ?? []).map(ayah => mapDbAyah(ayah, locale)),
    };
  } catch (error) {
    console.error(`[quran-server] getSurahFromDb failed for ${surahId}:`, error);
    return null;
  }
}

export async function getAyahFromDb(
  surahId: number,
  ayahNumber: number,
  locale: Locale = "ar"
): Promise<Ayah | null> {
  try {
    const result = await supabaseServerAnonRequest<DbAyah[]>(
      `/rest/v1/quran_ayahs?surah_id=eq.${surahId}&ayah_number=eq.${ayahNumber}&limit=1&select=id,surah_id,ayah_number,text_ar,text_en,text_uthmani,text_simple,page,juz,hizb,rub,sajda`
    );
    
    if (!result?.[0]) return null;
    return mapDbAyah(result[0], locale);
  } catch (error) {
    console.error(`[quran-server] getAyahFromDb failed for ${surahId}:${ayahNumber}:`, error);
    return null;
  }
}

export async function getTafsirFromDb(
  surahId: number,
  ayahNumber: number
): Promise<string | null> {
  try {
    // Note: Column name is tafsir_ar in DB
    const result = await supabaseServerAnonRequest<Array<{ tafsir_ar: string }>>(
      `/rest/v1/quran_tafsir?surah_id=eq.${surahId}&ayah_number=eq.${ayahNumber}&limit=1&select=tafsir_ar`
    );
    return result?.[0]?.tafsir_ar ?? null;
  } catch (error) {
    console.error(`[quran-server] getTafsirFromDb failed for ${surahId}:${ayahNumber}:`, error);
    return null;
  }
}

export async function getRecitersFromDb(): Promise<Reciter[] | null> {
  try {
    const dbReciters = await supabaseServerAnonRequest<DbReciter[]>(
      "/rest/v1/quran_reciters?select=id,code,name_ar,name_en,base_url_template&order=name_en.asc"
    );
    
    if (!dbReciters?.length) return null;
    return dbReciters.map(mapDbReciter);
  } catch (error) {
    console.error("[quran-server] getRecitersFromDb failed:", error);
    return null;
  }
}
