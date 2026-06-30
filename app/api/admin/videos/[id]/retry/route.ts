import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/services/admin';
import { updateVideoRequestStatus } from '@/lib/services/video-automation';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    
    const success = await updateVideoRequestStatus(params.id, 'pending');
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to retry video request' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[api] Failed to retry video request:', error);
    return NextResponse.json(
      { error: 'Failed to retry video request' },
      { status: 500 }
    );
  }
}
