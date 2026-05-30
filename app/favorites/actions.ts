'use server';

import { revalidatePath } from 'next/cache';
import { supabaseServerAnonRequest } from '@/lib/supabase/server';
import { getSupabaseUser } from '@/lib/supabase/server';

export async function addFavorite(itemRef: string, itemType: string = 'quran') {
  const user = await getSupabaseUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    await supabaseServerAnonRequest('/rest/v1/favorites', {
      method: 'POST',
      body: JSON.stringify({
        user_id: user.id,
        item_type: itemType,
        item_ref: itemRef,
      }),
      headers: {
        Prefer: 'return=minimal',
      },
    });
    revalidatePath('/favorites');
    return { success: true };
  } catch (error) {
    console.error('Failed to add favorite:', error);
    return { error: 'Failed to add favorite' };
  }
}

export async function removeFavorite(itemRef: string) {
  const user = await getSupabaseUser();
  if (!user) return { error: 'Unauthorized' };

  try {
    await supabaseServerAnonRequest(`/rest/v1/favorites?user_id=eq.${user.id}&item_ref=eq.${itemRef}`, {
      method: 'DELETE',
    });
    revalidatePath('/favorites');
    return { success: true };
  } catch (error) {
    console.error('Failed to remove favorite:', error);
    return { error: 'Failed to remove favorite' };
  }
}

export async function isFavorite(itemRef: string) {
  const user = await getSupabaseUser();
  if (!user) return false;

  try {
    const data = await supabaseServerAnonRequest<any[]>(`/rest/v1/favorites?user_id=eq.${user.id}&item_ref=eq.${itemRef}&select=id`);
    return data && data.length > 0;
  } catch (error) {
    return false;
  }
}
