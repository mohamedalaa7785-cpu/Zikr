import { supabaseServerAnonRequest } from "@/lib/supabase/server";
import type { ServiceResult } from "@/lib/types/common";

export interface Scholar {
  id: string;
  name: string;
  slug: string;
  bio?: string;
  avatarUrl?: string;
}

type ScholarRow = { id: string | number; name: string; slug: string; bio?: string | null; avatar_url?: string | null };

const FALLBACK_SCHOLARS: Scholar[] = [
  { id: "1", name: "Al-Shaarawy", slug: "al-shaarawy" },
  { id: "2", name: "Mustafa Mahmoud", slug: "mustafa-mahmoud" },
  { id: "3", name: "Zakir Naik", slug: "zakir-naik" },
];

export async function getAllScholars(): Promise<ServiceResult<Scholar[]>> {
  try {
    const data = await supabaseServerAnonRequest<ScholarRow[]>("/rest/v1/scholars?select=id,name,slug,bio,avatar_url");
    const scholars = (data ?? []).map((item) => ({
      id: String(item.id),
      name: item.name,
      slug: item.slug,
      bio: item.bio ?? undefined,
      avatarUrl: item.avatar_url ?? undefined,
    }));
    return { data: scholars.length ? scholars : FALLBACK_SCHOLARS, error: null, fetchedAt: new Date().toISOString(), fromCache: false };
  } catch {
    return { data: FALLBACK_SCHOLARS, error: null, fetchedAt: new Date().toISOString(), fromCache: false };
  }
}

export async function getScholarBySlug(slug: string): Promise<ServiceResult<Scholar>> {
  const all = await getAllScholars();
  return { ...all, data: all.data?.find((s) => s.slug === slug) ?? null };
}

export async function searchScholars(query: string): Promise<ServiceResult<Scholar[]>> {
  const all = await getAllScholars();
  const q = query.toLowerCase().trim();
  return { ...all, data: all.data?.filter((s) => s.name.toLowerCase().includes(q) || s.slug.includes(q)) ?? [] };
}
