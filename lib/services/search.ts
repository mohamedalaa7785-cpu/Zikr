import type { SearchResult, ServiceResult } from "@/lib/types/common";
import { searchQuran } from "@/lib/services/quran";
import { searchHadith } from "@/lib/services/hadith";
import { searchScholars } from "@/lib/services/scholars";
import { getStories } from "@/lib/services/stories";

export async function globalSearch(query: string): Promise<ServiceResult<SearchResult[]>> {
  const [quran, hadith, scholars, stories] = await Promise.all([
    searchQuran(query, "ar"),
    searchHadith(query),
    searchScholars(query),
    getStories(),
  ]);

  const storyResults = (stories.data ?? [])
    .filter((story) => story.title.toLowerCase().includes(query.toLowerCase()) || story.summary.toLowerCase().includes(query.toLowerCase()))
    .map((story) => ({ source: "stories" as const, id: story.id, title: story.title, snippet: story.summary, payload: story }));

  const merged: SearchResult[] = [
    ...(quran.data ?? []).map((item) => ({ source: "quran" as const, id: item.id, title: `Quran ${item.surahNumber}:${item.ayahNumber}`, snippet: item.text, locale: item.locale, payload: item })),
    ...(hadith.data ?? []).map((item) => ({ source: "hadith" as const, id: item.id, title: `${item.book} #${item.number}`, snippet: item.text, locale: item.locale, payload: item })),
    ...(scholars.data ?? []).map((item) => ({ source: "scholars" as const, id: item.id, title: item.name, snippet: item.bio, payload: item })),
    ...storyResults,
  ];

  return { data: merged, error: null, fetchedAt: new Date().toISOString(), fromCache: false };
}
// Future: add ranking/scoring pipeline and search indexing adapters.
