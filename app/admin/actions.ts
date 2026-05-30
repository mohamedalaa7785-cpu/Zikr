'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/services/admin';
import { supabaseServerAdminRequest } from '@/lib/supabase/server';

type JsonRecord = Record<string, unknown>;

function value(formData: FormData, key: string) {
  const raw = String(formData.get(key) ?? '').trim();
  return raw || null;
}

function bool(formData: FormData, key: string) {
  return formData.get(key) === 'on';
}

export async function saveSiteSettingAction(formData: FormData) {
  await requireAdmin();
  const key = String(formData.get('key') ?? '').trim();
  if (!key) throw new Error('مفتاح الإعداد مطلوب.');

  const payload: JsonRecord = {
    key,
    value: {
      title: value(formData, 'title'),
      body: value(formData, 'body'),
      imageUrl: value(formData, 'imageUrl'),
      logoUrl: value(formData, 'logoUrl'),
      youtubeChannelUrl: value(formData, 'youtubeChannelUrl'),
      pinnedMessage: value(formData, 'pinnedMessage'),
    },
    updated_at: new Date().toISOString(),
  };

  await supabaseServerAdminRequest('/rest/v1/site_settings?on_conflict=key', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify(payload),
  });

  revalidatePath('/admin');
  revalidatePath('/');
}

export async function saveStoryAction(formData: FormData) {
  await requireAdmin();
  const title = String(formData.get('title') ?? '').trim();
  const slug = String(formData.get('slug') ?? '').trim();
  const content = String(formData.get('content') ?? '').trim();
  if (!title || !slug || !content) throw new Error('العنوان والرابط والمحتوى مطلوبة.');

  await supabaseServerAdminRequest('/rest/v1/stories?on_conflict=slug', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({
      title,
      slug,
      content,
      category: value(formData, 'category') ?? 'faith',
      mood: value(formData, 'mood'),
      published: bool(formData, 'published'),
      metadata: { coverImage: value(formData, 'coverImage') },
      updated_at: new Date().toISOString(),
    }),
  });

  revalidatePath('/admin');
  revalidatePath('/stories');
}

export async function saveCompetitionAction(formData: FormData) {
  await requireAdmin();
  const title = String(formData.get('title') ?? '').trim();
  if (!title) throw new Error('عنوان المسابقة مطلوب.');

  await supabaseServerAdminRequest('/rest/v1/competitions', {
    method: 'POST',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({
      title,
      description: value(formData, 'description'),
      prize: value(formData, 'prize'),
      starts_at: value(formData, 'startsAt'),
      ends_at: value(formData, 'endsAt'),
      published: bool(formData, 'published'),
      metadata: { imageUrl: value(formData, 'imageUrl'), rules: value(formData, 'rules') },
    }),
  });

  revalidatePath('/admin');
}

export async function savePinnedMessageAction(formData: FormData) {
  await requireAdmin();
  const body = String(formData.get('body') ?? '').trim();
  if (!body) throw new Error('نص الرسالة المثبتة مطلوب.');

  await supabaseServerAdminRequest('/rest/v1/pinned_messages', {
    method: 'POST',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({
      title: value(formData, 'title') ?? 'رسالة مثبتة',
      body,
      cta_label: value(formData, 'ctaLabel'),
      cta_href: value(formData, 'ctaHref'),
      published: bool(formData, 'published'),
    }),
  });

  revalidatePath('/admin');
  revalidatePath('/');
}

export async function saveMemorizationPlanAction(formData: FormData) {
  await requireAdmin();
  const title = String(formData.get('title') ?? '').trim();
  if (!title) throw new Error('عنوان خطة الحفظ مطلوب.');

  await supabaseServerAdminRequest('/rest/v1/memorization_plans', {
    method: 'POST',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({
      title,
      cadence: value(formData, 'cadence') ?? 'daily',
      target_ref: value(formData, 'targetRef'),
      prompt: value(formData, 'prompt'),
      tajweed_focus: value(formData, 'tajweedFocus'),
      published: bool(formData, 'published'),
    }),
  });

  revalidatePath('/admin');
  revalidatePath('/memorization');
}
