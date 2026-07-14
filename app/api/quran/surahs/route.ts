import { createClient } from '@/lib/supabase/server';
import { getServerEnv } from '@/lib/env';
import { getAllSurahs } from '@/lib/services/quran';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const env = getServerEnv();
    if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json(await getAllSurahs('ar'));
    }

    const supabase = await createClient();
    const { data: surahs, error } = await supabase
      .from('quran_surahs')
      .select('*')
      .order('id', { ascending: true }); // id = surah number

    if (error) throw error;
    return NextResponse.json(surahs || []);
  } catch (error) {
    console.warn('[api/quran/surahs] DB unavailable, using Quran fallback:', error);
    const fallbackSurahs = await getAllSurahs('ar');
    return NextResponse.json(fallbackSurahs);
  }
}
