import { createClient } from '@/lib/supabase/server';
import { getAllSurahs } from '@/lib/services/quran';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: surahs, error } = await supabase
      .from('quran_surahs')
      .select('*')
      .order('id', { ascending: true }); // id = surah number

    if (!error && surahs?.length) {
      return NextResponse.json(surahs);
    }
  } catch (error) {
    console.warn('[api/quran/surahs] Supabase unavailable; using Quran API fallback:', error);
  }

  try {
    return NextResponse.json(await getAllSurahs('ar'));
  } catch (error) {
    console.error('[api/quran/surahs] fallback failed:', error);
    return NextResponse.json({ error: 'Failed to fetch surahs' }, { status: 503 });
  }
}
