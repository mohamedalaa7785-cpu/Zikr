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

    // Real analytics data from the database
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const [usersRes, behaviorCountRes, recentProfilesRes, behaviorRes, favoritesRes] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('user_behavior').select('id', { count: 'exact', head: true }),
      supabase
        .from('profiles')
        .select('created_at')
        .gte('created_at', thirtyDaysAgo),
      supabase
        .from('user_behavior')
        .select('created_at, user_id')
        .gte('created_at', thirtyDaysAgo),
      supabase.from('favorites').select('item_type, item_id'),
    ]);

    // Build a 30-day timeline from real records
    const timeline = Array.from({ length: 30 }, (_, i) => {
      const day = new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000);
      const dayKey = day.toISOString().slice(0, 10);
      const usersOnDay = (recentProfilesRes.data || []).filter(
        (p) => p.created_at?.slice(0, 10) === dayKey
      ).length;
      const eventsOnDay = (behaviorRes.data || []).filter(
        (b) => b.created_at?.slice(0, 10) === dayKey
      );
      const uniqueSessions = new Set(eventsOnDay.map((b) => b.user_id)).size;
      return {
        date: day.toLocaleDateString('ar-SA'),
        users: usersOnDay,
        sessions: uniqueSessions,
        pageViews: eventsOnDay.length,
        avgSessionDuration: 0,
      };
    });

    // Top content derived from real favorites counts
    const favCounts = new Map<string, { item_type: string; item_id: string; count: number }>();
    for (const f of favoritesRes.data || []) {
      const key = f.item_type + ':' + f.item_id;
      const entry = favCounts.get(key) || { item_type: f.item_type, item_id: f.item_id, count: 0 };
      entry.count++;
      favCounts.set(key, entry);
    }
    const topContent = [...favCounts.values()]
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map((c) => ({
        id: c.item_id,
        title: c.item_type + ' #' + c.item_id,
        views: 0,
        favorites: c.count,
      }));

    const analytics = {
      stats: {
        totalUsers: usersRes.count ?? 0,
        activeSessions: new Set((behaviorRes.data || []).map((b) => b.user_id)).size,
        totalPageViews: behaviorCountRes.count ?? 0,
        avgSessionDuration: 0,
      },
      timeline,
      topContent,
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
