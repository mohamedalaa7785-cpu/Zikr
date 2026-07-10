'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function uploadAvatarAction(formData: FormData) {
  const avatarBase64 = String(formData.get('avatarBase64') || '').trim();

  if (!avatarBase64.startsWith('data:image/')) {
    throw new Error('صيغة الصورة غير صالحة');
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  await supabase.from('profiles').upsert({
    id: user.id,
    avatar_url: avatarBase64,
    updated_at: new Date().toISOString(),
  });

  revalidatePath('/profile');
}
