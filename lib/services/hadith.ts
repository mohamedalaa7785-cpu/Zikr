import { safeApiFetch } from "@/lib/services/http";
import { supabaseServerAnonRequest } from "@/lib/supabase/server";
import type { Hadith, HadithBook, HadithResponse } from "@/lib/types/hadith";
import type { PaginationMeta } from "@/lib/types/common";

const HADITH_API_BASE = "https://api.hadith.gading.dev";

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

type DbHadithBook = {
  id: string;
  slug: string;
  name_ar: string;
  name_en: string;
  hadith_count: number | null;
};

type DbHadith = {
  hadith_number: string;
  text_ar: string;
  ref: string | null;
};

async function readSupabase<T>(path: string): Promise<T | null> {
  try {
    return await supabaseServerAnonRequest<T>(path);
  } catch (error) {
    console.error(
      "[hadith-service] Supabase content read failed; falling back to external API:",
      error
    );
    return null;
  }
}

function mapDbHadithBook(book: DbHadithBook): HadithBook {
  return {
    id: book.slug,
    name: book.name_ar,
    available: book.hadith_count ?? 0,
  };
}

function mapDbHadith(hadith: DbHadith): Hadith {
  return {
    number: Number.parseInt(hadith.hadith_number, 10),
    arab: hadith.text_ar,
    id: hadith.ref ?? hadith.hadith_number,
  };
}

export async function getHadithBooks(): Promise<HadithBook[]> {
  const dbBooks = await readSupabase<DbHadithBook[]>(
    "/rest/v1/hadith_books?select=id,slug,name_ar,name_en,hadith_count&order=slug.asc"
  );
  if (dbBooks?.length) return dbBooks.map(mapDbHadithBook);

  const { data: res } = await safeApiFetch<
    ApiResponse<Record<string, { name: string; available: number }>>
  >(`${HADITH_API_BASE}/books`);
  return Object.entries(res?.data ?? {}).map(([id, value]) => ({
    id,
    ...value,
  }));
}

export async function getHadithBook(
  slug: string,
  page = 1,
  limit = 20
): Promise<HadithResponse<Hadith[]> | null> {
  const clean = slug.trim();
  if (!clean) return null;

  const dbBooks = await readSupabase<DbHadithBook[]>(
    `/rest/v1/hadith_books?select=id,slug,name_ar,name_en,hadith_count&slug=eq.${encodeURIComponent(clean)}&limit=1`
  );
  if (dbBooks?.[0]) {
    const from = Math.max(0, (page - 1) * limit);
    const dbHadiths = await readSupabase<DbHadith[]>(
      `/rest/v1/hadiths?select=hadith_number,text_ar,ref&book_id=eq.${dbBooks[0].id}&published=eq.true&order=hadith_number.asc&offset=${from}&limit=${limit}`
    );
    const total = dbBooks[0].hadith_count ?? dbHadiths?.length ?? 0;
    const pagination: PaginationMeta = {
      currentPage: page,
      pageSize: limit,
      totalItems: total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };

    return {
      name: dbBooks[0].name_ar,
      slug: dbBooks[0].slug,
      total,
      pagination,
      data: (dbHadiths ?? []).map(mapDbHadith),
    };
  }

  try {
    const { data: result } = await safeApiFetch<
      ApiResponse<{
        name: string;
        id: string;
        available: number;
        requested: number;
        hadiths: Hadith[];
      }>
    >(
      `${HADITH_API_BASE}/books/${encodeURIComponent(clean)}?range=${page}-${page + limit - 1}`
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
    console.error("[hadith-service] Failed to fetch book:", clean, error);
    return null;
  }
}

export async function getHadithByNumber(
  book: string,
  number: number
): Promise<Hadith | null> {
  if (!book.trim() || number < 1) return null;

  const dbBooks = await readSupabase<Pick<DbHadithBook, "id">[]>(
    `/rest/v1/hadith_books?select=id&slug=eq.${encodeURIComponent(book)}&limit=1`
  );
  if (dbBooks?.[0]) {
    const dbHadiths = await readSupabase<DbHadith[]>(
      `/rest/v1/hadiths?select=hadith_number,text_ar,ref&book_id=eq.${dbBooks[0].id}&hadith_number=eq.${number}&published=eq.true&limit=1`
    );
    if (dbHadiths?.[0]) return mapDbHadith(dbHadiths[0]);
  }

  const { data: res } = await safeApiFetch<
    ApiResponse<{ name: string; id: string; contents: Hadith }>
  >(`${HADITH_API_BASE}/books/${encodeURIComponent(book)}/${number}`);
  return res?.data?.contents ?? null;
}

export async function searchHadith(query: string): Promise<Hadith[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const escapedQuery = q.replace(/[*,()]/g, "");
  const dbHadiths = await readSupabase<DbHadith[]>(
    `/rest/v1/hadiths?select=hadith_number,text_ar,ref&published=eq.true&or=${encodeURIComponent(`(text_ar.ilike.*${escapedQuery}*,ref.ilike.*${escapedQuery}*)`)}&limit=50`
  );
  if (dbHadiths?.length) return dbHadiths.map(mapDbHadith);

  const books = await getHadithBooks();
  const seedBooks = books.slice(0, 3);

  const collections = await Promise.all(
    seedBooks.map(book => getHadithBook(book.id, 1, 50))
  );
  return collections
    .flatMap(collection => collection?.data ?? [])
    .filter(
      item => item.arab?.includes(q) || item.id?.toLowerCase().includes(q)
    );
}
