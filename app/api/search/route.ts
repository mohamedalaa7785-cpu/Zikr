import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );

  try {
    const query = request.nextUrl.searchParams.get('q');
    if (!query) {
      return NextResponse.json([]);
    }

    const searchTerm = '%' + query + '%';

    const [quranResults, hadithResults, duaResults, storyResults] = await Promise.all([
      supabase
        .from('quran_surahs')
        .select('id, name_ar as title, "quran" as type')
        .ilike('name_ar', searchTerm)
        .limit(5),
      supabase
        .from('hadiths')
        .select('id, text_ar as title, "hadith" as type')
        .ilike('text_ar', searchTerm)
        .limit(5),
      supabase
        .from('duas')
        .select('id, title_ar as title, "dua" as type')
        .ilike('title_ar', searchTerm)
        .limit(5),
      supabase
        .from('stories')
        .select('id, title, "story" as type')
        .ilike('title', searchTerm)
        .limit(5),
    ]);

    const results = [
      ...(quranResults.data || []),
      ...(hadithResults.data || []),
      ...(duaResults.data || []),
      ...(storyResults.data || []),
    ];

    return NextResponse.json(results);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Failed to search' }, { status: 500 });
  }
}
