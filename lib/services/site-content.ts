import { supabaseServerAdminRequest } from '@/lib/supabase/server';

export type SiteSettingValue = {
  title?: string | null;
  body?: string | null;
  imageUrl?: string | null;
  logoUrl?: string | null;
  youtubeChannelUrl?: string | null;
  pinnedMessage?: string | null;
};

export type PinnedMessage = {
  id: string;
  title: string | null;
  body: string | null;
  type: string | null;
  is_active: boolean;
  priority: number;
};

export type Competition = {
  id: string;
  title: string;
  description: string | null;
  prize: string | null;
  starts_at: string | null;
  ends_at: string | null;
  metadata: { imageUrl?: string | null; rules?: string | null } | null;
};

export type MemorizationPlan = {
  id: string;
  title: string;
  cadence: string;
  target_ref: string | null;
  prompt: string | null;
  tajweed_focus: string | null;
};

export async function getSiteSetting(key: string) {
  const rows = await supabaseServerAdminRequest<Array<{ value: SiteSettingValue }>>(
    `/rest/v1/site_settings?select=value&key=eq.${encodeURIComponent(key)}&limit=1`,
    { cache: 'no-store' },
  ).catch(() => []);
  return rows[0]?.value ?? null;
}

export async function getPinnedMessages(limit = 3) {
  return supabaseServerAdminRequest<PinnedMessage[]>(
    `/rest/v1/pinned_messages?select=id,title,body,type,is_active,priority&is_active=eq.true&order=priority.desc,created_at.desc&limit=${limit}`,
    { cache: 'no-store' },
  ).catch(() => []);
}

export async function getCompetitions(limit = 20) {
  return supabaseServerAdminRequest<Competition[]>(
    `/rest/v1/competitions?select=id,title,description,prize,starts_at,ends_at,metadata&published=eq.true&order=created_at.desc&limit=${limit}`,
    { cache: 'no-store' },
  ).catch(() => []);
}

export async function getMemorizationPlans(limit = 12) {
  return supabaseServerAdminRequest<MemorizationPlan[]>(
    `/rest/v1/memorization_plans?select=id,title,cadence,target_ref,prompt,tajweed_focus&published=eq.true&order=created_at.desc&limit=${limit}`,
    { cache: 'no-store' },
  ).catch(() => []);
}
