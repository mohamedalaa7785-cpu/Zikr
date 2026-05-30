import { safeApiFetch } from '@/lib/services/http';
import type { Hadith, HadithBook, HadithResponse } from '@/lib/types/hadith';
import type { PaginationMeta } from '@/lib/types/common';

const HADITH_API_BASE = 'https://api.hadith.gading.dev';

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export async function getHadithBooks(): Promise<HadithBook[]> {
  const { data: res } = await safeApiFetch<ApiResponse<Record<string, { name: string; available: number }>>>(`${HADITH_API_BASE}/books`);
  return Object.entries(res?.data ?? {}).map(([id, value]) => ({ id, ...value }));
}

export async function getHadithBook(slug: string, page = 1, limit = 20): Promise<HadithResponse<Hadith[]> | null> {
  const clean = slug.trim();
  if (!clean) return null;
  
  try {
    const { data: result } = await safeApiFetch<ApiResponse<{ name: string; id: string; available: number; requested: number; hadiths: Hadith[] }>>(
      `${HADITH_API_BASE}/books/${encodeURIComponent(clean)}?range=${page}-${page + limit - 1}`,
    );

    const total = result?.data?.available ?? 0;
  const pagination: PaginationMeta = {
    currentPage: page,
    pageSize: limit,
    totalItems: total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };

    return {
      name: result?.data?.name ?? clean,
      slug: result?.data?.id ?? clean,
      total,
      pagination,
      data: result?.data?.hadiths ?? [],
    };
  } catch (error) {
    console.error('[hadith-service] Failed to fetch book:', clean, error);
    return null;
  }
}

export async function getHadithByNumber(book: string, number: number): Promise<Hadith | null> {
  if (!book.trim() || number < 1) return null;
  const { data: res } = await safeApiFetch<ApiResponse<{ name: string; id: string; contents: Hadith }>>(
    `${HADITH_API_BASE}/books/${encodeURIComponent(book)}/${number}`,
  );
  return res?.data?.contents ?? null;
}

export async function searchHadith(query: string): Promise<Hadith[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const books = await getHadithBooks();
  const seedBooks = books.slice(0, 3);

  const collections = await Promise.all(seedBooks.map((book) => getHadithBook(book.id, 1, 50)));
  return collections
    .flatMap((collection) => collection?.data ?? [])
    .filter((item) => item.arab?.includes(q) || item.id?.toLowerCase().includes(q));
}
