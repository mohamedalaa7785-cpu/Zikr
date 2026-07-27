'use server';

import { createClient, getSupabaseUser } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface ReadingProgress {
  surah_id: number;
  ayah_number: number;
  surah_name?: string;
  updated_at?: string;
}

/**
 * Save or update a user's last reading position.
 * Called when user clicks "bookmark here" on an ayah.
 */
export async function saveReadingProgress(
  surahId: number,
  ayahNumber: number,
  surahName?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getSupabaseUser();
    if (!user) return { success: false, error: 'يجب تسجيل الدخول أولاً' };

    const supabase = await createClient();

    const { error } = await supabase
      .from('reading_progress')
      .upsert(
        {
          user_id: user.id,
          content_type: 'quran',
          content_id: String(surahId),
          position: ayahNumber,
          metadata: { surah_id: surahId, ayah_number: ayahNumber, surah_name: surahName },
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id,content_type,content_id',
        }
      );

    if (error) {
      console.error('[quran-actions] saveReadingProgress error:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/quran');
    return { success: true };
  } catch (err) {
    console.error('[quran-actions] saveReadingProgress exception:', err);
    return { success: false, error: 'حدث خطأ غير متوقع' };
  }
}

/**
 * Get user's last reading position for a specific surah.
 */
export async function getReadingProgress(surahId: number): Promise<ReadingProgress | null> {
  try {
    const user = await getSupabaseUser();
    if (!user) return null;

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('reading_progress')
      .select('content_id, position, metadata, updated_at')
      .eq('user_id', user.id)
      .eq('content_type', 'quran')
      .eq('content_id', String(surahId))
      .single();

    if (error || !data) return null;

    return {
      surah_id: surahId,
      ayah_number: data.position ?? 1,
      surah_name: (data.metadata as Record<string, string>)?.surah_name,
      updated_at: data.updated_at,
    };
  } catch {
    return null;
  }
}

/**
 * Get last read position across ALL surahs (for homepage banner).
 */
export async function getLastReadPosition(): Promise<ReadingProgress | null> {
  try {
    const user = await getSupabaseUser();
    if (!user) return null;

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('reading_progress')
      .select('content_id, position, metadata, updated_at')
      .eq('user_id', user.id)
      .eq('content_type', 'quran')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) return null;

    return {
      surah_id: Number(data.content_id),
      ayah_number: data.position ?? 1,
      surah_name: (data.metadata as Record<string, string>)?.surah_name,
      updated_at: data.updated_at,
    };
  } catch {
    return null;
  }
}

/**
 * Clear reading progress for a specific surah.
 */
export async function clearReadingProgress(
  surahId: number
): Promise<{ success: boolean }> {
  try {
    const user = await getSupabaseUser();
    if (!user) return { success: false };

    const supabase = await createClient();
    await supabase
      .from('reading_progress')
      .delete()
      .eq('user_id', user.id)
      .eq('content_type', 'quran')
      .eq('content_id', String(surahId));

    revalidatePath('/quran');
    return { success: true };
  } catch {
    return { success: false };
  }
}
