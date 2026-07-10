import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get('q');
    if (!query || query.trim().length < 2) {
      return NextResponse.json([]);
    }

    const supabase = await createClient();
    const searchTerm = `%${query.trim()}%`;

    const [quranResults, hadithResults, duaResults, storyResults] = await Promise.all([
      supabase.from('quran_surahs').select('id, title:name_ar').ilike('name_ar', searchTerm).limit(5),
      supabase.from('hadiths').select('id, title:text_ar').ilike('text_ar', searchTerm).limit(5),
      supabase.from('duas').select('id, title:title_ar').ilike('title_ar', searchTerm).limit(5),
      supabase.from('stories').select('id, title').ilike('title', searchTerm).limit(5),
    ]);

    const results = [
      ...(quranResults.data || []).map((r) => ({ ...r, type: 'quran' })),
      ...(hadithResults.data || []).map((r) => ({ ...r, type: 'hadith' })),
      ...(duaResults.data || []).map((r) => ({ ...r, type: 'dua' })),
      ...(storyResults.data || []).map((r) => ({ ...r, type: 'story' })),
    ];

    return NextResponse.json(results);
  } catch (error) {
    console.error('[api/search] GET error:', error);
    return NextResponse.json({ error: 'Failed to search' }, { status: 500 });
  }
}
