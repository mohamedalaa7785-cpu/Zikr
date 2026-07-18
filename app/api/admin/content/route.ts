import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

interface AdminContentRow {
  id: string;
  title: string;
  published?: boolean | null;
  views?: number | null;
  created_at: string;
  updated_at: string;
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const [storiesRes, articlesRes] = await Promise.all([
      supabase.from('stories').select('id, title, published, views, created_at, updated_at'),
      supabase.from('articles').select('id, title, published, views, created_at, updated_at'),
    ]);

    const content = [
      ...((storiesRes.data || []) as AdminContentRow[]).map((s) => ({
        id: s.id,
        title: s.title,
        type: 'story',
        status: s.published ? 'published' : 'draft',
        views: s.views || 0,
        createdAt: s.created_at,
        updatedAt: s.updated_at,
      })),
      ...((articlesRes.data || []) as AdminContentRow[]).map((a) => ({
        id: a.id,
        title: a.title,
        type: 'article',
        status: a.published ? 'published' : 'draft',
        views: a.views || 0,
        createdAt: a.created_at,
        updatedAt: a.updated_at,
      })),
    ];

    return NextResponse.json(content);
  } catch (error) {
    console.error('[api/admin/content] GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}
