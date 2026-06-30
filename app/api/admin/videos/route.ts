import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/services/admin';
import { getPendingVideoRequests } from '@/lib/services/video-automation';

export async function GET() {
  try {
    await requireAdmin();
    const requests = await getPendingVideoRequests();
    return NextResponse.json(requests);
  } catch (error) {
    console.error('[api] Failed to fetch video requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch video requests' },
      { status: 500 }
    );
  }
}
