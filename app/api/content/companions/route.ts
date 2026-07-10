import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: companions, error } = await supabase
      .from('companions')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(companions || []);
  } catch (error) {
    console.error('[api/content/companions] GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch companions' }, { status: 500 });
  }
}
