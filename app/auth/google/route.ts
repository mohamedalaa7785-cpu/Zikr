import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  buildOAuthRedirectUri,
  extractNextPath,
  getGoogleOAuthConfigStatus,
} from "@/lib/auth-enhanced";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const safePath = extractNextPath(request.nextUrl.searchParams);
  const redirectTo = buildOAuthRedirectUri(request.nextUrl.origin, safePath);
  const loginUrl = new URL("/auth/login", request.nextUrl.origin);
  loginUrl.searchParams.set("next", safePath);

  try {
    const configStatus = getGoogleOAuthConfigStatus();
    if (!configStatus.isReady) {
      console.error("[auth/google] Google OAuth config mismatch:", {
        missing: configStatus.missing,
        appCallbackUrl: configStatus.appCallbackUrl,
        configuredCallbackUrl: configStatus.configuredCallbackUrl,
      });
      loginUrl.searchParams.set("error", "google_oauth_unavailable");
      return NextResponse.redirect(loginUrl);
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        scopes: "email profile",
        queryParams: {
          access_type: "offline",
          prompt: "select_account",
        },
      },
    });

    if (error || !data.url) {
      loginUrl.searchParams.set("error", "google_oauth_unavailable");
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.redirect(data.url);
  } catch (error) {
    console.error("[auth/google] OAuth start failed:", error);
    loginUrl.searchParams.set("error", "google_oauth_failed");
    return NextResponse.redirect(loginUrl);
  }
}
