import { createClient } from '@/lib/supabase/server';
import { searchQuran } from '@/lib/services/quran';
import { NextRequest, NextResponse } from 'next/server';

interface SearchRow {
  id: string | number;
  title: string | null;
}

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get('q')?.trim();
    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }
    if (query.length > 100) {
      return NextResponse.json({ error: 'Search query is too long.' }, { status: 400 });
    }

    try {
      const supabase = await createClient();
      const searchTerm = `%${query}%`;

      const [quranResults, hadithResults, duaResults, storyResults, articleResults] = await Promise.all([
        supabase.from('quran_surahs').select('id, title:name_ar').ilike('name_ar', searchTerm).limit(5),
        supabase.from('hadiths').select('id, title:text_ar').ilike('text_ar', searchTerm).limit(5),
        supabase.from('duas').select('id, title:title_ar').ilike('title_ar', searchTerm).limit(5),
        supabase.from('stories').select('id, title').ilike('title', searchTerm).limit(5),
        supabase.from('articles').select('id, title:title_ar, slug').ilike('title_ar', searchTerm).limit(5),
      ]);

      const results = [
        ...((quranResults.data || []) as SearchRow[]).map((r) => ({ ...r, type: 'quran' })),
        ...((hadithResults.data || []) as SearchRow[]).map((r) => ({ ...r, type: 'hadith' })),
        ...((duaResults.data || []) as SearchRow[]).map((r) => ({ ...r, type: 'dua' })),
        ...((storyResults.data || []) as SearchRow[]).map((r) => ({ ...r, type: 'story' })),
        ...((articleResults.data || []) as SearchRow[]).map((r) => ({ ...r, type: 'article' })),
      ];

      return NextResponse.json(results);
    } catch (error) {
      console.warn('[api/search] Supabase unavailable; using Quran API fallback:', error);
      const quranResults = await searchQuran(query, 'ar');
      return NextResponse.json(
        quranResults.slice(0, 10).map((result) => ({
          id: `${result.number}-${result.numberInSurah}`,
          title: result.text,
          type: 'quran',
        })),
      );
    }
  } catch (error) {
    console.error('[api/search] GET error:', error);
    return NextResponse.json({ error: 'Failed to search' }, { status: 500 });
  }
}
