import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: books, error } = await supabase
      .from('hadith_books')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(books || []);
  } catch (error) {
    console.error('[api/hadith/books] GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 });
  }
}
