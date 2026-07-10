import { NextResponse } from 'next/server';
import {
  getPendingVideoRequests,
  processVideoGenerationRequest,
} from '@/lib/services/video-automation';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

// Small batch, processed sequentially: video generation involves polling an
// external API, so a large parallel batch would blow the function timeout.
const BATCH_SIZE = 3;

export async function GET(request: Request) {
  // Fail closed in production: the cron endpoint must never be publicly
  // invocable without the secret Vercel Cron sends automatically.
  const secret = process.env.CRON_SECRET;
  if (process.env.NODE_ENV === 'production' && !secret) {
    console.error('[cron] CRON_SECRET is not configured — refusing to run');
    return new Response('Cron secret not configured', { status: 503 });
  }
  const authHeader = request.headers.get('authorization');
  if (secret && authHeader !== `Bearer ${secret}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const pendingRequests = await getPendingVideoRequests(BATCH_SIZE);

    if (pendingRequests.length === 0) {
      return NextResponse.json({ message: 'No pending video requests' });
    }

    const results: Array<{ id: string; success: boolean; error?: string }> = [];
    for (const req of pendingRequests) {
      try {
        const success = await processVideoGenerationRequest(req);
        results.push({ id: req.id, success });
      } catch (err) {
        console.error(`[cron] Failed to process video ${req.id}:`, err);
        results.push({ id: req.id, success: false, error: String(err) });
      }
    }

    return NextResponse.json({
      processed: results.length,
      succeeded: results.filter((r) => r.success).length,
      results,
    });
  } catch (error) {
    console.error('[cron] Video processing error:', error);
    return NextResponse.json({ error: 'Failed to process videos' }, { status: 500 });
  }
}
