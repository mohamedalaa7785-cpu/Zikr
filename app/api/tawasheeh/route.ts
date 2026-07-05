import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const revalidate = 60; // Cache for 60 seconds

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const featured = searchParams.get('featured') === 'true';

    const supabase = createClient();

    let query = supabase
      .from('tawasheeh')
      .select(
        `
        id,
        title_ar,
        title_en,
        slug,
        description_ar,
        description_en,
        artist_ar,
        artist_en,
        duration,
        views,
        featured,
        category:tawasheeh_categories(id, name_ar, name_en, slug, icon),
        created_at,
        updated_at
        `,
        { count: 'exact' }
      )
      .eq('published', true)
      .range(offset, offset + limit - 1)
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false });

    // Filter by category if provided
    if (category) {
      query = query.eq('category_id', category);
    }

    // Filter by featured if requested
    if (featured) {
      query = query.eq('featured', true);
    }

    // Search by title or artist if provided
    if (search) {
      const searchTerm = `%${search}%`;
      query = query.or(
        `title_ar.ilike.${searchTerm},title_en.ilike.${searchTerm},artist_ar.ilike.${searchTerm},artist_en.ilike.${searchTerm}`
      );
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('[tawasheeh-api] Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch tawasheeh data' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        data: data || [],
        pagination: {
          total: count || 0,
          limit,
          offset,
          hasMore: offset + limit < (count || 0),
        },
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    );
  } catch (error) {
    console.error('[tawasheeh-api] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
