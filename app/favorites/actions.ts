"use server";

/**
 * @openapi
 * POST /favorites/add (Server Action: addFavorite)
 * Summary: Add item to favorites
 * Tags: Favorites
 * Auth: Required
 * Request: itemRef (string), itemType (FavoriteItemType, default: quran)
 * Response: { success: true } | { error: string }
 *
 * DELETE /favorites/remove (Server Action: removeFavorite)
 * Summary: Remove item from favorites
 * Tags: Favorites
 * Auth: Required
 * Request: itemRef (string), itemType (FavoriteItemType, default: quran)
 * Response: { success: true } | { error: string }
 *
 * GET /favorites/check (Server Action: isFavorite)
 * Summary: Check if item is favorited
 * Tags: Favorites
 * Auth: Required
 * Request: itemRef (string), itemType (FavoriteItemType, default: quran)
 * Response: boolean
 */
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

/**
 * Batch check: returns a Set of item_refs that are favorited by the current user.
 * Use this instead of calling isFavorite N times on a list page.
 */
export async function getFavoritedRefs(
  itemRefs: string[],
  itemType: FavoriteItemType = "quran"
): Promise<Set<string>> {
  if (!itemRefs.length) return new Set();
  try {
    const user = await getSupabaseUser();
    const token = await getServerSessionToken();
    if (!user || !token) return new Set();

    const userFilter = encodeURIComponent(user.id);
    const typeFilter = encodeURIComponent(itemType);
    const refList = itemRefs.map(encodeURIComponent).join(",");
    const data = await supabaseServerAnonRequest<Array<{ item_ref: string }>>(
      `/rest/v1/favorites?user_id=eq.${userFilter}&item_type=eq.${typeFilter}&item_ref=in.(${refList})&select=item_ref`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return new Set(data.map((d) => d.item_ref));
  } catch {
    return new Set();
  }
}
