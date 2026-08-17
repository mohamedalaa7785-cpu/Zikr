import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured()) return NextResponse.json([]);

  const query = request.nextUrl.searchParams.get('q')?.trim() ?? '';

  try {
    const supabase = await createClient();
    let requestQuery = supabase
      .from('articles')
      .select('id,title,slug,summary,author,category_id,created_at')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(query ? 12 : 60);

    if (query) {
      const escaped = query.replace(/[%(),]/g, ' ').trim();
      if (!escaped) return NextResponse.json([]);
      requestQuery = requestQuery.or(
        `title.ilike.%${escaped}%,summary.ilike.%${escaped}%,content.ilike.%${escaped}%,tags.cs.{${escaped}}`,
      );
    }

    const { data: articles, error } = await requestQuery;
    if (error) throw error;
    return NextResponse.json(articles ?? []);
  } catch (error) {
    console.error('[api/content/articles] GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}
