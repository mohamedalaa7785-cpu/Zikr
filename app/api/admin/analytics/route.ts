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

    // Mock analytics data
    const analytics = {
      stats: {
        totalUsers: 1250,
        activeSessions: 42,
        totalPageViews: 28500,
        avgSessionDuration: 8.5,
      },
      timeline: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('ar-SA'),
        users: Math.floor(Math.random() * 100) + 50,
        sessions: Math.floor(Math.random() * 200) + 100,
        pageViews: Math.floor(Math.random() * 2000) + 500,
        avgSessionDuration: Math.random() * 10 + 5,
      })),
      topContent: [
        { id: '1', title: 'سورة الفاتحة', views: 5000, favorites: 1250 },
        { id: '2', title: 'قصة النبي محمد', views: 3500, favorites: 850 },
        { id: '3', title: 'أدعية السفر', views: 2800, favorites: 720 },
        { id: '4', title: 'سيرة عمر بن الخطاب', views: 2200, favorites: 550 },
      ],
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
