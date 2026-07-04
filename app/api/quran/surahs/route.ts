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
    const { data: surahs, error } = await supabase
      .from('quran_surahs')
      .select('*')
      .order('order', { ascending: true });

    if (error) throw error;
    return NextResponse.json(surahs || []);
  } catch (error) {
    console.error('Surahs fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch surahs' }, { status: 500 });
  }
}
