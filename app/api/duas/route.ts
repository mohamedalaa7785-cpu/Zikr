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
    const searchParams = request.nextUrl.searchParams;
    const categoryId = searchParams.get('category');

    let query = supabase.from('duas').select('*');
    
    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data: duas, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(duas || []);
  } catch (error) {
    console.error('Duas fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch duas' }, { status: 500 });
  }
}
