import { safeFetchJson } from "@/lib/services/_http";
import type { ServiceResult, SupportedLocale } from "@/lib/types/common";
import type { Hadith, HadithBook, HadithBookPage, HadithResponse, HadithSearchHit } from "@/lib/types/hadith";

const HADITH_BASE_URL = "https://api.hadith.gading.dev";

async function fetchHadith<T>(path: string): Promise<ServiceResult<HadithResponse<T>>> {
  return safeFetchJson<HadithResponse<T>>(`${HADITH_BASE_URL}${path}`, undefined, {
    revalidate: 1800,
    tags: ["hadith"],
  });
}

export async function getHadithBooks(): Promise<ServiceResult<HadithBook[]>> {
  const response = await fetchHadith<HadithBook[]>("/books");
  return { ...response, data: response.data?.data ?? null };
}

export async function getHadithBook(slug: string, page = 1, limit = 20): Promise<ServiceResult<HadithBookPage>> {
  const response = await fetchHadith<{ name: string; id: string; available: number; requested: number; hadiths: Hadith[] }>(
    `/books/${encodeURIComponent(slug)}?range=${(page - 1) * limit + 1}-${page * limit}`,
  );

  const data = response.data?.data;
  return {
    ...response,
    data: data
      ? {
          name: data.name,
          slug: data.id,
          hadiths: data.hadiths,
          pagination: {
            currentPage: page,
            perPage: limit,
            totalItems: data.available,
            totalPages: Math.ceil(data.available / limit),
          },
        }
      : null,
  };
}

export async function getHadithByNumber(book: string, number: number): Promise<ServiceResult<Hadith>> {
  const response = await fetchHadith<{ contents: { number: number; arab: string; id: string }[] }>(`/books/${book}/${number}`);
  const hadith = response.data?.data?.contents?.[0] ?? null;
  return { ...response, data: hadith };
}

export async function searchHadith(query: string): Promise<ServiceResult<HadithSearchHit[]>> {
  const books = await getHadithBooks();
  if (!books.data || books.error) return { ...books, data: [] };

  const results: HadithSearchHit[] = [];
  const limitedBooks = books.data.slice(0, 5);
  for (const book of limitedBooks) {
    const page = await getHadithBook(book.id, 1, 40);
    if (!page.data) continue;
    const matches = page.data.hadiths.filter((h) => h.arab.includes(query) || h.id.toLowerCase().includes(query.toLowerCase()));
    results.push(
      ...matches.map((h) => ({
        id: `${book.id}:${h.number}`,
        book: book.name,
        number: h.number,
        text: h.arab || h.id,
        locale: (h.arab ? "ar" : "en") as SupportedLocale,
      })),
    );
  }

  return { data: results, error: null, fetchedAt: new Date().toISOString(), fromCache: false };
}
