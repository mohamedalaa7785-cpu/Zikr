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
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch all content from different tables
    const [stories, articles] = await Promise.all([
      supabase.from('stories').select('*'),
      supabase.from('articles').select('*'),
    ]);

    // Combine and format content
    const content = [
      ...(stories.data?.map((s: any) => ({
        id: s.id,
        title: s.title,
        type: 'story',
        status: s.published ? 'published' : 'draft',
        views: s.views || 0,
        createdAt: s.created_at,
        updatedAt: s.updated_at,
      })) || []),
      ...(articles.data?.map((a: any) => ({
        id: a.id,
        title: a.title,
        type: 'article',
        status: a.published ? 'published' : 'draft',
        views: a.views || 0,
        createdAt: a.created_at,
        updatedAt: a.updated_at,
      })) || []),
    ];

    return NextResponse.json(content);
  } catch (error) {
    console.error('Content fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}
