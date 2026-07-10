import { NextResponse } from 'next/server';
import { getPendingVideoRequests, processVideoGenerationRequest } from '@/lib/services/video-automation';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Basic security check: Verify CRON_SECRET if provided
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response('Unauthorized', { status: 401 });
    }

    const pendingRequests = await getPendingVideoRequests();
    
    if (pendingRequests.length === 0) {
      return NextResponse.json({ message: 'No pending video requests' });
    }

    
    const results = await Promise.all(
      pendingRequests.map(async (req) => {
        try {
          const success = await processVideoGenerationRequest(req);
          return { id: req.id, success };
        } catch (err) {
          console.error(`[cron] Failed to process video ${req.id}:`, err);
          return { id: req.id, success: false, error: String(err) };
        }
      })
    );

    return NextResponse.json({ 
      processed: pendingRequests.length,
      results 
    });
  } catch (error) {
    console.error('[cron] Video processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process videos' },
      { status: 500 }
    );
  }
}
