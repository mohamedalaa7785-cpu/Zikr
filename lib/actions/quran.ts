'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidateTag } from 'next/cache';

export async function addToQuranFavorites(surahId: number): Promise<{ success: boolean; error?: string }> {
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
      .from('quran_favorites')
      .insert({ user_id: user.id, surah_id: surahId });

    if (error) throw error;
    revalidateTag('quran-favorites', 'hours');
    return { success: true };
  } catch (error) {
    console.error('Add quran favorite error:', error);
    return { success: false, error: 'Failed to add favorite' };
  }
}

export async function removeFromQuranFavorites(surahId: number): Promise<{ success: boolean; error?: string }> {
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
      .from('quran_favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('surah_id', surahId);

    if (error) throw error;
    revalidateTag('quran-favorites', 'hours');
    return { success: true };
  } catch (error) {
    console.error('Remove quran favorite error:', error);
    return { success: false, error: 'Failed to remove favorite' };
  }
}

export async function recordQuranRead(
  surahId: number,
  ayahNumber: number
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
      .from('quran_reads')
      .insert({
        user_id: user.id,
        surah_id: surahId,
        ayah_number: ayahNumber,
        read_at: new Date().toISOString(),
      });

    if (error) throw error;
    revalidateTag('quran-reads', 'hours');
    return { success: true };
  } catch (error) {
    console.error('Record quran read error:', error);
    return { success: false, error: 'Failed to record read' };
  }
}
