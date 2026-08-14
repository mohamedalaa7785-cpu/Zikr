import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/services/admin';
import { createVideoGenerationRequest } from '@/lib/services/video-automation';

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminApi();
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    
    const body = await request.json();
    const { title, description, category, content } = body;
    
    // Validate required fields
    if (!title || !description || !category || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, category, content' },
        { status: 400 }
      );
    }
    
    let contentObject: Record<string, unknown>;
    try {
      const parsed = typeof content === 'string' ? JSON.parse(content) : content;
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('invalid content');
      contentObject = parsed as Record<string, unknown>;
    } catch {
      return NextResponse.json({ error: 'Content must be valid JSON.' }, { status: 400 });
    }

    const narration = ['prompt', 'script', 'text']
      .map((field) => contentObject[field])
      .find((value): value is string => typeof value === 'string' && value.trim().length > 0)
      ?.replace(/\s+/g, ' ')
      .trim() ?? '';
    if (narration.length < 30) {
      return NextResponse.json(
        { error: 'An explicit narration of at least 30 characters is required.' },
        { status: 400 },
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
      content: contentObject,
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
