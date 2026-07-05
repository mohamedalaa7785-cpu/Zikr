'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidateTag } from 'next/cache';

export async function updateAppSettings(
  theme: 'light' | 'dark' | 'system',
  fontSize: 'small' | 'medium' | 'large'
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
      .from('app_settings')
      .upsert({
        user_id: user.id,
        theme,
        fontSize,
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;
    revalidateTag('app-settings', 'hours');
    return { success: true };
  } catch (error) {
    console.error('Update settings error:', error);
    return { success: false, error: 'Failed to update settings' };
  }
}

export async function deleteAccount(): Promise<{ success: boolean; error?: string }> {
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

    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) throw signOutError;

    const { error: deleteError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', user.id);

    if (deleteError) throw deleteError;

    return { success: true };
  } catch (error) {
    console.error('Delete account error:', error);
    return { success: false, error: 'Failed to delete account' };
  }
}

export async function exportUserData(): Promise<{ success: boolean; error?: string; data?: any }> {
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

    const [profile, favorites, progress] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('favorites').select('*').eq('user_id', user.id),
      supabase.from('reading_progress').select('*').eq('user_id', user.id),
    ]);

    const exportData = {
      profile: profile.data,
      favorites: favorites.data,
      readingProgress: progress.data,
      exportedAt: new Date().toISOString(),
    };

    return { success: true, data: exportData };
  } catch (error) {
    console.error('Export data error:', error);
    return { success: false, error: 'Failed to export data' };
  }
}
