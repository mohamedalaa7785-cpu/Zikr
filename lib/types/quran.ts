import type { SupportedLocale } from "@/lib/types/common";

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
}

export interface Ayah {
  number: number;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  text: string;
  surah: Surah;
}

export interface Juz {
  number: number;
  ayahs: Ayah[];
}

export interface QuranApiResponse<T> {
  code: number;
  status: string;
  data: T;
}

export interface QuranSearchHit {
  id: string;
  surahNumber: number;
  ayahNumber: number;
  text: string;
  locale: SupportedLocale;
}
