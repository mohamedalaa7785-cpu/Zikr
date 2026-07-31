import { NextRequest, NextResponse } from "next/server";
import { supabaseServerAdminRequest } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, platform, action } = body;

    if (!slug || !platform) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate platform
    const validPlatforms = ["facebook", "whatsapp", "twitter", "copy-link"];
    if (!validPlatforms.includes(platform)) {
      return NextResponse.json(
        { error: "Invalid platform" },
        { status: 400 }
      );
    }

    // Track share event
    const response = await supabaseServerAdminRequest(
      "/rest/v1/kids_content?slug=eq.${slug}",
      {
        method: "PATCH",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({
          shares: `shares + 1`,
        }),
      }
    );

    // Also track in analytics if available
    if (typeof window === "undefined" && process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
      // Server-side event tracking could be implemented here
      console.log(`[Kids] Share tracked: ${slug} via ${platform}`);
    }

    return NextResponse.json({
      success: true,
      message: `Share tracked on ${platform}`,
    });
  } catch (error) {
    console.error("[Kids Share Tracking Error]:", error);
    return NextResponse.json(
      { error: "Failed to track share" },
      { status: 500 }
    );
  }
}

/**
 * Track engagement metrics for kids content
 * POST /api/kids/track-share
 *
 * Body:
 * {
 *   slug: string (content slug)
 *   platform: string ('facebook', 'whatsapp', 'twitter', 'copy-link')
 *   action?: string ('share', 'like', 'complete')
 * }
 */
