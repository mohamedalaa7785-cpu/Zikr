import { supabaseServerAnonRequest } from '@/lib/supabase/server';

export interface Scholar {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  bio?: string;
  tags?: string[];
}

const FALLBACK_SCHOLARS: Scholar[] = [
  { id: '1', slug: 'al-shaarawy', nameAr: 'محمد متولي الشعراوي', nameEn: 'Al-Shaarawy' },
  { id: '2', slug: 'mustafa-mahmoud', nameAr: 'مصطفى محمود', nameEn: 'Mustafa Mahmoud' },
  { id: '3', slug: 'zakir-naik', nameAr: 'ذاكر نايك', nameEn: 'Zakir Naik' },
];

export async function getAllScholars(): Promise<Scholar[]> {
  try {
    const data = await supabaseServerAnonRequest<Scholar[]>('/rest/v1/scholars?select=*');
    return data?.length ? data : FALLBACK_SCHOLARS;
  } catch {
    return FALLBACK_SCHOLARS;
  }
}

export async function getScholarBySlug(slug: string): Promise<Scholar | null> {
  const scholars = await getAllScholars();
  return scholars.find((s) => s.slug === slug) ?? null;
}

export async function searchScholars(query: string): Promise<Scholar[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const scholars = await getAllScholars();
  return scholars.filter((s) => s.nameAr.includes(q) || s.nameEn.toLowerCase().includes(q) || s.slug.includes(q));
}
