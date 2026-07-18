"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/services/admin";
import { supabaseServerAdminRequest } from "@/lib/supabase/server";

function value(formData: FormData, key: string) {
  const raw = String(formData.get(key) ?? "").trim();
  return raw || null;
}

function parseQuizData(raw: string | null) {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    throw new Error("بيانات اللعبة / الاختبار يجب أن تكون JSON صحيح.");
  }
}

export async function saveKidsContentAction(formData: FormData) {
  await requireAdmin();

  const title_ar = String(formData.get("title_ar") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const content_ar = String(formData.get("content_ar") ?? "").trim();

  if (!title_ar || !slug || !content_ar) {
    throw new Error("العنوان بالعربية والرابط المختصر والمحتوى كلها مطلوبة.");
  }

  await supabaseServerAdminRequest("/rest/v1/kids_content?on_conflict=slug", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({
      title_ar,
      title_en: value(formData, "title_en") ?? title_ar,
      slug,
      type: value(formData, "type") ?? "story",
      content_ar,
      content_en: value(formData, "content_en"),
      age_group: value(formData, "age_group") ?? "6-8",
      featured_image_url: value(formData, "featured_image_url"),
      video_url: value(formData, "video_url"),
      quiz_data: parseQuizData(value(formData, "quiz_data")),
      published: formData.get("published") !== "off",
      metadata: {
        reward: value(formData, "reward"),
        memorizationTarget: value(formData, "memorization_target"),
      },
      updated_at: new Date().toISOString(),
    }),
  });

  revalidatePath("/kids");
  revalidatePath(`/kids/${slug}`);
  revalidatePath("/admin/kids");
}
