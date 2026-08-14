import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

const VALID_PLATFORMS = new Set([
  "facebook",
  "whatsapp",
  "twitter",
  "copy-link",
]);
const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]*$/;

type ShareRequest = {
  slug?: unknown;
  platform?: unknown;
  action?: unknown;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ShareRequest;
    const slug = typeof body.slug === "string" ? body.slug.trim() : "";
    const platform = typeof body.platform === "string" ? body.platform : "";
    const action = body.action === undefined ? "share" : body.action;

    if (!slug || slug.length > 160 || !SLUG_PATTERN.test(slug)) {
      return NextResponse.json(
        { error: "Invalid content slug" },
        { status: 400 }
      );
    }

    if (!VALID_PLATFORMS.has(platform)) {
      return NextResponse.json({ error: "Invalid platform" }, { status: 400 });
    }

    if (action !== "share") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase.rpc(
      "increment_kids_content_shares",
      {
        p_slug: slug,
      }
    );

    if (error) {
      console.error("[Kids Share Tracking Error] RPC failed:", error);
      return NextResponse.json(
        { error: "Failed to track share" },
        { status: 500 }
      );
    }

    const updated = Array.isArray(data) ? data[0] : data;
    if (!updated) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      platform,
      shares: updated.shares,
    });
  } catch (error) {
    console.error("[Kids Share Tracking Error] Request failed:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
