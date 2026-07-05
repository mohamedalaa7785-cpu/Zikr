'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidateTag } from 'next/cache';

export async function saveSearchQuery(query: string): Promise<{ success: boolean; error?: string }> {
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
    if (authError || !user) return { success: false, error: 'Unauthorized' };

    const { error } = await supabase
      .from('search_history')
      .insert({
        user_id: user.id,
        query,
        searched_at: new Date().toISOString(),
      });

    if (error) throw error;
    revalidateTag('search-history', 'hours');
    return { success: true };
  } catch (error) {
    console.error('Save search query error:', error);
    return { success: false, error: 'Failed to save search' };
  }
}

export async function clearSearchHistory(): Promise<{ success: boolean; error?: string }> {
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
    if (authError || !user) return { success: false, error: 'Unauthorized' };

    const { error } = await supabase
      .from('search_history')
      .delete()
      .eq('user_id', user.id);

    if (error) throw error;
    revalidateTag('search-history', 'hours');
    return { success: true };
  } catch (error) {
    console.error('Clear search history error:', error);
    return { success: false, error: 'Failed to clear history' };
  }
}
