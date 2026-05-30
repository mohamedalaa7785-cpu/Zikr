import type { PaginationMeta, SupportedLocale } from "@/lib/types/common";

export interface HadithBook {
  id: string;
  name: string;
  available: number;
}

export interface Hadith {
  number: number;
  arab: string;
  id: string;
}

export interface HadithResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface HadithBookPage {
  name: string;
  slug: string;
  hadiths: Hadith[];
  pagination: PaginationMeta;
}

export interface HadithSearchHit {
  id: string;
  book: string;
  number: number;
  text: string;
  locale: SupportedLocale;
}
