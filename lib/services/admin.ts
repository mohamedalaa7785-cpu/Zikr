import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export type AdminProfile = {
  id: string;
  email?: string;
  display_name: string | null;
  role: 'user' | 'admin';
};

export async function getCurrentProfile(): Promise<AdminProfile | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, display_name, role')
      .eq('id', user.id)
      .single();

    if (!profile) return { id: user.id, email: user.email, display_name: null, role: 'user' };
    return { ...profile, email: user.email };
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const profile = await getCurrentProfile();
  if (!profile) redirect('/auth/login?next=/admin');
  if (profile.role !== 'admin') redirect('/profile?error=admin_required');
  return profile;
}
