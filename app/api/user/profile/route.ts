import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    return NextResponse.json(profile || {
      id: user.id,
      display_name: user.user_metadata?.display_name || null,
      avatar_url: user.user_metadata?.avatar_url || null,
      locale: 'ar',
      role: 'user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[api/user/profile] GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { data: profile, error } = await supabase
      .from('profiles')
      .update({
        display_name: body.display_name ?? body.displayName,
        locale: body.locale,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(profile);
  } catch (error) {
    console.error('[api/user/profile] PUT error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
