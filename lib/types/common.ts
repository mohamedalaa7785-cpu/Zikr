export type SupportedLocale = "ar" | "en";

export interface ServiceError {
  message: string;
  code: string;
  status?: number;
  cause?: unknown;
}

export interface ServiceResult<T> {
  data: T | null;
  error: ServiceError | null;
  fetchedAt: string;
  fromCache: boolean;
}

export interface FetchOptions {
  timeoutMs?: number;
  revalidate?: number;
  cache?: RequestCache;
  tags?: string[];
}

export interface PaginationMeta {
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}

export interface SearchResult<T = unknown> {
  source: "quran" | "hadith" | "scholars" | "stories";
  id: string;
  title: string;
  snippet?: string;
  locale?: SupportedLocale;
  score?: number;
  payload: T;
}
