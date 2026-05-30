import { redirect } from 'next/navigation';
import { getSupabaseUser, supabaseServerAdminRequest } from '@/lib/supabase/server';

export type AdminProfile = {
  id: string;
  email?: string;
  display_name: string | null;
  role: 'user' | 'admin';
};

export async function getCurrentProfile(): Promise<AdminProfile | null> {
  const user = await getSupabaseUser().catch(() => null);
  if (!user) return null;

  const profiles = await supabaseServerAdminRequest<AdminProfile[]>(
    `/rest/v1/profiles?select=id,display_name,role&id=eq.${user.id}&limit=1`,
    { cache: 'no-store' }
  ).catch(() => []);

  const profile = profiles[0];
  if (!profile) return { id: user.id, email: user.email, display_name: null, role: 'user' };
  return { ...profile, email: user.email };
}

export async function requireAdmin() {
  const profile = await getCurrentProfile();
  if (!profile) redirect('/auth/login?next=/admin');
  if (profile.role !== 'admin') redirect('/profile?error=admin_required');
  return profile;
}
