'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidateTag } from 'next/cache';

export async function completeAdhkar(adhkarId: string): Promise<{ success: boolean; error?: string }> {
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
      .from('adhkar_completions')
      .insert({
        user_id: user.id,
        adhkar_id: adhkarId,
        completed_at: new Date().toISOString(),
      });

    if (error) throw error;
    revalidateTag('adhkar-completions', 'hours');
    return { success: true };
  } catch (error) {
    console.error('Complete adhkar error:', error);
    return { success: false, error: 'Failed to complete adhkar' };
  }
}

export async function trackAdhkarStreak(): Promise<{ success: boolean; error?: string }> {
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
      .from('adhkar_streaks')
      .upsert({
        user_id: user.id,
        streak: 1,
        last_completed_at: new Date().toISOString(),
      });

    if (error) throw error;
    revalidateTag('adhkar-streaks', 'hours');
    return { success: true };
  } catch (error) {
    console.error('Track streak error:', error);
    return { success: false, error: 'Failed to track streak' };
  }
}

export async function shareAdhkarCompletion(adhkarId: string): Promise<{ success: boolean; error?: string }> {
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
      .from('social_shares')
      .insert({
        user_id: user.id,
        content_type: 'adhkar',
        content_id: adhkarId,
        shared_at: new Date().toISOString(),
      });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Share adhkar error:', error);
    return { success: false, error: 'Failed to share' };
  }
}
