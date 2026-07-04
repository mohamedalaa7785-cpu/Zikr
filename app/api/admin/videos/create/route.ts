import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/services/admin';
import { createVideoGenerationRequest } from '@/lib/services/video-automation';

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    
    const body = await request.json();
    const { title, description, category, content } = body;
    
    // Validate required fields
    if (!title || !description || !category || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, category, content' },
        { status: 400 }
      );
    }
    
    // Validate category
    const validCategories = ['quran', 'hadith', 'story', 'dua', 'adhkar', 'other'];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: `Invalid category. Must be one of: ${validCategories.join(', ')}` },
        { status: 400 }
      );
    }
    
    const result = await createVideoGenerationRequest({
      title,
      description,
      category,
      content,
    });
    
    if (!result) {
      return NextResponse.json(
        { error: 'Failed to create video request' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('[api] Failed to create video request:', error);
    return NextResponse.json(
      { error: 'Failed to create video request' },
      { status: 500 }
    );
  }
}
