import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('tawasheeh_categories')
      .select('id, name_ar, name_en, slug, description_ar, description_en, icon, order_num')
      .eq('published', true)
      .order('order_num', { ascending: true });

    if (error) {
      console.error('[tawasheeh-categories-api] Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch categories' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { data: data || [] },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        },
      }
    );
  } catch (error) {
    console.error('[tawasheeh-categories-api] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
