import { supabaseServerAnonRequest } from '@/lib/supabase/server';
import { ServiceError } from '@/lib/types/common';

export interface Scholar {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  bioAr?: string;
  bioEn?: string;
  thumbnailUrl?: string;
  websiteUrl?: string;
  youtubeUrl?: string;
  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
  metadata?: Record<string, unknown>;
}

const FALLBACK_SCHOLARS: Scholar[] = [
  {
    id: '1',
    slug: 'al-shaarawy',
    nameAr: 'محمد متولي الشعراوي',
    nameEn: 'Al-Shaarawy',
    published: true,
  },
  { id: '2', slug: 'mustafa-mahmoud', nameAr: 'مصطفى محمود', nameEn: 'Mustafa Mahmoud', published: true },
  { id: '3', slug: 'zakir-naik', nameAr: 'ذاكر نايك', nameEn: 'Zakir Naik', published: true },
];

const CACHE_TTL = 10 * 60 * 1000; // 10 minutes
let cachedScholars: { data: Scholar[]; timestamp: number } | null = null;

export async function getAllScholars(): Promise<Scholar[]> {
  try {
    // Use cache if fresh
    if (cachedScholars && Date.now() - cachedScholars.timestamp < CACHE_TTL) {
      return cachedScholars.data;
    }

    const response = await supabaseServerAnonRequest<Scholar[]>(
      '/rest/v1/scholars?select=*&published=eq.true&limit=100&order=created_at.desc',
      { cache: 'force-cache', next: { revalidate: 3600 } },
    );

    // Type validation
    if (!Array.isArray(response)) {
      console.warn('[scholars] Invalid response type, got:', typeof response);
      cachedScholars = { data: FALLBACK_SCHOLARS, timestamp: Date.now() };
      return FALLBACK_SCHOLARS;
    }

    if (response.length === 0) {
      console.warn('[scholars] Supabase returned empty array, using fallback');
      cachedScholars = { data: FALLBACK_SCHOLARS, timestamp: Date.now() };
      return FALLBACK_SCHOLARS;
    }

    // Validate response shape
    const validated = response.every((item: any) => item.id && item.slug && item.nameAr && item.nameEn);

    if (!validated) {
      console.warn('[scholars] Response validation failed, using fallback');
      cachedScholars = { data: FALLBACK_SCHOLARS, timestamp: Date.now() };
      return FALLBACK_SCHOLARS;
    }

    cachedScholars = { data: response, timestamp: Date.now() };
    return response;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('[scholars] Failed to fetch from Supabase:', errorMsg);

    if (error instanceof ServiceError) {
      console.error('[scholars] Service error code:', error.code, 'Status:', error.statusCode);
    }

    return FALLBACK_SCHOLARS;
  }
}

export async function getScholarBySlug(slug: string): Promise<Scholar | null> {
  if (!slug || typeof slug !== 'string') return null;

  try {
    const response = await supabaseServerAnonRequest<Scholar[]>(
      `/rest/v1/scholars?slug=eq.${encodeURIComponent(slug)}&published=eq.true&limit=1`,
      { cache: 'force-cache', next: { revalidate: 3600 } },
    );

    if (!Array.isArray(response) || response.length === 0) {
      return null;
    }

    return response[0];
  } catch (error) {
    console.error('[scholars] Error fetching by slug:', slug, error);
    return null;
  }
}

export async function searchScholars(query: string): Promise<Scholar[]> {
  const q = query?.trim().toLowerCase();
  if (!q) return [];

  const scholars = await getAllScholars();
  return scholars.filter(
    (s) => s.nameAr?.toLowerCase().includes(q) || s.nameEn?.toLowerCase().includes(q) || s.slug?.includes(q),
  );
}

export async function getScholarsByIds(ids: string[]): Promise<Scholar[]> {
  if (!ids || ids.length === 0) return [];
  const scholars = await getAllScholars();
  return scholars.filter((s) => ids.includes(s.id));
}
