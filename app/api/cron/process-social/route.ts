import { NextResponse } from "next/server";
import {
  getPendingSocialPublishItems,
  processSocialPublishItem,
} from "@/lib/services/social-publishing";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

const BATCH_SIZE = 10;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (process.env.NODE_ENV === "production" && !secret) {
    console.error(
      "[cron] CRON_SECRET is not configured — refusing to run social queue"
    );
    return new Response("Cron secret not configured", { status: 503 });
  }

  const authHeader = request.headers.get("authorization");
  if (secret && authHeader !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const items = await getPendingSocialPublishItems(BATCH_SIZE);
    if (items.length === 0) {
      return NextResponse.json({ message: "No queued social posts" });
    }

    const results: Array<{ id: string; success: boolean; error?: string }> = [];
    for (const item of items) {
      try {
        const success = await processSocialPublishItem(item);
        results.push({ id: item.id, success });
      } catch (error) {
        console.error(
          `[cron] Failed to process social queue item ${item.id}:`,
          error
        );
        results.push({ id: item.id, success: false, error: String(error) });
      }
    }

    return NextResponse.json({
      processed: results.length,
      succeeded: results.filter(result => result.success).length,
      results,
    });
  } catch (error) {
    console.error("[cron] Social publishing error:", error);
    return NextResponse.json(
      { error: "Failed to process social publishing queue" },
      { status: 500 }
    );
  }
}
