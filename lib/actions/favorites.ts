'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidateTag } from 'next/cache';

export async function addFavorite(
  itemType: string,
  itemRef: string
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
      .from('favorites')
      .insert({
        user_id: user.id,
        item_type: itemType,
        item_ref: itemRef,
      });

    if (error) throw error;
    revalidateTag('user-favorites', 'hours');
    return { success: true };
  } catch (error) {
    console.error('Add favorite error:', error);
    return { success: false, error: 'Failed to add favorite' };
  }
}

export async function removeFavorite(
  itemType: string,
  itemRef: string
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
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('item_type', itemType)
      .eq('item_ref', itemRef);

    if (error) throw error;
    revalidateTag('user-favorites', 'hours');
    return { success: true };
  } catch (error) {
    console.error('Remove favorite error:', error);
    return { success: false, error: 'Failed to remove favorite' };
  }
}

export async function clearFavorites(): Promise<{ success: boolean; error?: string }> {
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
      .from('favorites')
      .delete()
      .eq('user_id', user.id);

    if (error) throw error;
    revalidateTag('user-favorites', 'hours');
    return { success: true };
  } catch (error) {
    console.error('Clear favorites error:', error);
    return { success: false, error: 'Failed to clear favorites' };
  }
}
