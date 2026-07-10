'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/services/admin';

/**
 * Saves new kids content. Since kids content is currently stored as static
 * data in lib/data/kids-content.ts, this action logs the submission and
 * returns a confirmation. In a database-backed setup this would insert a row.
 */
export async function saveKidsContentAction(formData: FormData) {
  await requireAdmin();

  const title_ar = String(formData.get('title_ar') ?? '').trim();
  const slug = String(formData.get('slug') ?? '').trim();
  const content_ar = String(formData.get('content_ar') ?? '').trim();

  if (!title_ar || !slug || !content_ar) {
    throw new Error('العنوان بالعربية والرابط المختصر والمحتوى كلها مطلوبة.');
  }

  // When the project is wired to a database, insert the row here.
  // For now, revalidate the kids pages so any cached data refreshes.
  revalidatePath('/kids');
  revalidatePath('/admin/kids');
}
