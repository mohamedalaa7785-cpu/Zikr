import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: surahs, error } = await supabase
      .from('quran_surahs')
      .select('*')
      .order('id', { ascending: true }); // id = surah number

    if (error) throw error;
    return NextResponse.json(surahs || []);
  } catch (error) {
    console.error('[api/quran/surahs] GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch surahs' }, { status: 500 });
  }
}
