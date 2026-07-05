'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidateTag } from 'next/cache';

export async function saveReadingProgress(
  scope: 'quran' | 'hadith' | 'stories',
  ref: string,
  progress: Record<string, any>
): Promise<{ success: boolean; error?: string }> {
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
      return { success: false, error: 'Unauthorized' };
    }

    const { error } = await supabase
      .from('reading_progress')
      .upsert({
        user_id: user.id,
        scope,
        ref,
        progress_json: progress,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)
      .eq('scope', scope)
      .eq('ref', ref);

    if (error) throw error;
    revalidateTag(`reading-progress-${scope}-${ref}`, 'hours');
    return { success: true };
  } catch (error) {
    console.error('Save reading progress error:', error);
    return { success: false, error: 'Failed to save progress' };
  }
}

export async function addBookmark(
  itemType: string,
  itemRef: string,
  label?: string
): Promise<{ success: boolean; error?: string }> {
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
      return { success: false, error: 'Unauthorized' };
    }

    const { error } = await supabase
      .from('bookmarks')
      .insert({
        user_id: user.id,
        item_type: itemType,
        item_ref: itemRef,
        label,
      });

    if (error) throw error;
    revalidateTag('user-bookmarks', 'hours');
    return { success: true };
  } catch (error) {
    console.error('Add bookmark error:', error);
    return { success: false, error: 'Failed to add bookmark' };
  }
}

export async function removeBookmark(id: string): Promise<{ success: boolean; error?: string }> {
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
      return { success: false, error: 'Unauthorized' };
    }

    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
    revalidateTag('user-bookmarks', 'hours');
    return { success: true };
  } catch (error) {
    console.error('Remove bookmark error:', error);
    return { success: false, error: 'Failed to remove bookmark' };
  }
}
