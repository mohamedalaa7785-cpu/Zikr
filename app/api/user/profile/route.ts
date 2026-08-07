import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

function getUserMetadataValue(metadata: Record<string, unknown>, ...keys: string[]) {
  for (const key of keys) {
    const value = metadata[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return null;
}

export async function GET() {
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

    if (profile) return NextResponse.json(profile);

    const metadata = user.user_metadata ?? {};
    const now = new Date().toISOString();

    return NextResponse.json({
      id: user.id,
      email: user.email ?? null,
      display_name:
        getUserMetadataValue(metadata, 'display_name', 'full_name', 'name') ??
        user.email?.split('@')[0] ??
        null,
      avatar_url: getUserMetadataValue(metadata, 'avatar_url', 'picture'),
      locale: 'ar',
      role: 'user',
      created_at: user.created_at ?? now,
      updated_at: now,
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
      .upsert({
        id: user.id,
        email: user.email ?? null,
        display_name: body.display_name ?? body.displayName,
        locale: body.locale,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(profile);
  } catch (error) {
    console.error('[api/user/profile] PUT error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
