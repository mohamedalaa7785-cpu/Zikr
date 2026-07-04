'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidateTag } from 'next/cache';

export async function addToStoryFavorites(storyId: string): Promise<{ success: boolean; error?: string }> {
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
      .from('story_favorites')
      .insert({ user_id: user.id, story_id: storyId });

    if (error) throw error;
    revalidateTag('story-favorites');
    return { success: true };
  } catch (error) {
    console.error('Add story favorite error:', error);
    return { success: false, error: 'Failed to add favorite' };
  }
}

export async function markStoryAsRead(storyId: string): Promise<{ success: boolean; error?: string }> {
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
      .from('story_reads')
      .insert({
        user_id: user.id,
        story_id: storyId,
        read_at: new Date().toISOString(),
      });

    if (error) throw error;
    revalidateTag('story-reads');
    return { success: true };
  } catch (error) {
    console.error('Mark story as read error:', error);
    return { success: false, error: 'Failed to mark as read' };
  }
}

export async function addStoryRating(
  storyId: string,
  rating: number,
  comment?: string
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
    if (authError || !user) return { success: false, error: 'Unauthorized' };

    const { error } = await supabase
      .from('story_ratings')
      .upsert({
        user_id: user.id,
        story_id: storyId,
        rating,
        comment,
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;
    revalidateTag('story-ratings');
    return { success: true };
  } catch (error) {
    console.error('Add story rating error:', error);
    return { success: false, error: 'Failed to add rating' };
  }
}

export async function saveProphetNote(
  prophetId: string,
  note: string
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
    if (authError || !user) return { success: false, error: 'Unauthorized' };

    const { error } = await supabase
      .from('prophet_notes')
      .upsert({
        user_id: user.id,
        prophet_id: prophetId,
        note,
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;
    revalidateTag('prophet-notes');
    return { success: true };
  } catch (error) {
    console.error('Save prophet note error:', error);
    return { success: false, error: 'Failed to save note' };
  }
}
