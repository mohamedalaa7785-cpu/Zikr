import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: prophets, error } = await supabase
      .from('prophets')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(prophets || []);
  } catch (error) {
    console.error('[api/content/prophets] GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch prophets' }, { status: 500 });
  }
}
