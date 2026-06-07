"use server";

import { revalidatePath } from "next/cache";
import {
  getServerSessionToken,
  getSupabaseUser,
  supabaseServerAnonRequest,
} from "@/lib/supabase/server";

export type FavoriteItemType = "quran" | "hadith" | "story" | "scholar" | "dua";

type FavoriteActionResult = { success: true } | { error: string };

function favoriteFilter(
  userId: string,
  itemRef: string,
  itemType: FavoriteItemType
) {
  const userFilter = encodeURIComponent(userId);
  const refFilter = encodeURIComponent(itemRef);
  const typeFilter = encodeURIComponent(itemType);
  return `user_id=eq.${userFilter}&item_type=eq.${typeFilter}&item_ref=eq.${refFilter}`;
}

export async function addFavorite(
  itemRef: string,
  itemType: FavoriteItemType = "quran"
): Promise<FavoriteActionResult> {
  const user = await getSupabaseUser();
  const token = await getServerSessionToken();
  if (!user || !token) return { error: "Unauthorized" };

  try {
    await supabaseServerAnonRequest("/rest/v1/favorites", {
      method: "POST",
      body: JSON.stringify({
        user_id: user.id,
        item_type: itemType,
        item_ref: itemRef,
      }),
      headers: {
        Authorization: `Bearer ${token}`,
        Prefer: "return=minimal",
      },
    });
    revalidatePath("/favorites");
    return { success: true };
  } catch (error) {
    console.error("Failed to add favorite:", error);
    return { error: "Failed to add favorite" };
  }
}

export async function removeFavorite(
  itemRef: string,
  itemType: FavoriteItemType = "quran"
): Promise<FavoriteActionResult> {
  const user = await getSupabaseUser();
  const token = await getServerSessionToken();
  if (!user || !token) return { error: "Unauthorized" };

  try {
    await supabaseServerAnonRequest(
      `/rest/v1/favorites?${favoriteFilter(user.id, itemRef, itemType)}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Prefer: "return=minimal",
        },
      }
    );
    revalidatePath("/favorites");
    return { success: true };
  } catch (error) {
    console.error("Failed to remove favorite:", error);
    return { error: "Failed to remove favorite" };
  }
}

export async function isFavorite(
  itemRef: string,
  itemType: FavoriteItemType = "quran"
) {
  const user = await getSupabaseUser();
  const token = await getServerSessionToken();
  if (!user || !token) return false;

  try {
    const data = await supabaseServerAnonRequest<Array<{ id: string }>>(
      `/rest/v1/favorites?${favoriteFilter(user.id, itemRef, itemType)}&select=id`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data.length > 0;
  } catch {
    return false;
  }
}
