import { supabaseServerAdminRequest } from '@/lib/supabase/server';
import type { VideoGenerationRequest } from '@/lib/types/video';

export type { VideoGenerationRequest };

/**
 * Create a new video generation request
 */
export async function createVideoGenerationRequest(data: {
  title: string;
  description: string;
  category: string;
  content: string;
}): Promise<VideoGenerationRequest | null> {
  try {
    const result = await supabaseServerAdminRequest<VideoGenerationRequest>(
      '/rest/v1/videos',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          category: data.category,
          content: data.content,
          status: 'pending',
        }),
      }
    );
    return result || null;
  } catch (error) {
    console.error('[video-automation] Failed to create video request:', error);
    return null;
  }
}

/**
 * Get all pending video requests
 */
export async function getPendingVideoRequests(): Promise<VideoGenerationRequest[]> {
  try {
    const results = await supabaseServerAdminRequest<VideoGenerationRequest[]>(
      '/rest/v1/videos?status=eq.pending&limit=100'
    );
    return results || [];
  } catch (error) {
    console.error('[video-automation] Failed to fetch pending requests:', error);
    return [];
  }
}

/**
 * Update video request status
 */
export async function updateVideoRequestStatus(
  videoId: string,
  status: 'pending' | 'processing' | 'completed' | 'failed',
  metadata?: { youtubeId?: string; facebookId?: string }
): Promise<boolean> {
  try {
    const body: Record<string, unknown> = { status };
    if (metadata?.youtubeId) body.youtubeId = metadata.youtubeId;
    if (metadata?.facebookId) body.facebookId = metadata.facebookId;

    await supabaseServerAdminRequest(
      `/rest/v1/videos?id=eq.${videoId}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );
    return true;
  } catch (error) {
    console.error('[video-automation] Failed to update video request:', error);
    return false;
  }
}

/**
 * Generate metadata for YouTube
 */
export function generateYoutubeMetadata(request: VideoGenerationRequest) {
  return {
    title: request.title,
    description: request.description,
    tags: ['islamic', 'quran', 'hadith', 'dua', 'adhkar'],
    categoryId: '27', // Education
  };
}

/**
 * Generate metadata for Facebook
 */
export function generateFacebookMetadata(request: VideoGenerationRequest) {
  return {
    title: request.title,
    description: request.description,
    tags: ['islamic', 'quran', 'hadith', 'dua', 'adhkar'],
  };
}

/**
 * Create a video from Quran content
 */
export async function generateQuranVideo(
  surahId: number,
  ayahStart: number,
  ayahEnd: number,
  reciterId?: string
): Promise<VideoGenerationRequest | null> {
  const title = `سورة الفاتحة - آية ${ayahStart}:${ayahEnd}`;
  const description = `تلاوة من القرآن الكريم`;
  return createVideoGenerationRequest({
    title,
    description,
    category: 'quran',
    content: JSON.stringify({
      type: 'quran',
      surahId,
      ayahStart,
      ayahEnd,
      reciterId,
    }),
  });
}

/**
 * Create a video from Hadith content
 */
export async function generateHadithVideo(
  hadithId: string,
  bookId: string
): Promise<VideoGenerationRequest | null> {
  const title = `حديث شريف`;
  const description = `حديث من السنة النبوية الشريفة`;
  return createVideoGenerationRequest({
    title,
    description,
    category: 'hadith',
    content: JSON.stringify({
      type: 'hadith',
      hadithId,
      bookId,
    }),
  });
}

/**
 * Create a video from Islamic story
 */
export async function generateStoryVideo(
  storyId: string
): Promise<VideoGenerationRequest | null> {
  const title = `قصة إسلامية`;
  const description = `قصة إسلامية مؤثرة`;
  return createVideoGenerationRequest({
    title,
    description,
    category: 'story',
    content: JSON.stringify({
      type: 'story',
      storyId,
    }),
  });
}

/**
 * Create a video from Dua
 */
export async function generateDuaVideo(
  duaId: string
): Promise<VideoGenerationRequest | null> {
  const title = `دعاء مستجاب`;
  const description = `دعاء من أدعية القرآن والسنة`;
  return createVideoGenerationRequest({
    title,
    description,
    category: 'dua',
    content: JSON.stringify({
      type: 'dua',
      duaId,
    }),
  });
}

/**
 * Create a video from Adhkar
 */
export async function generateAdhkarVideo(
  adhkarType: 'morning' | 'evening' | 'prayer'
): Promise<VideoGenerationRequest | null> {
  const titles: Record<string, string> = {
    morning: 'أذكار الصباح',
    evening: 'أذكار المساء',
    prayer: 'أذكار بعد الصلاة',
  };
  return createVideoGenerationRequest({
    title: titles[adhkarType],
    description: `مجموعة أذكار ${titles[adhkarType]}`,
    category: 'adhkar',
    content: JSON.stringify({
      type: 'adhkar',
      adhkarType,
    }),
  });
}

/**
 * Process video generation request (to be called by backend job)
 */
export async function processVideoGenerationRequest(
  request: VideoGenerationRequest
): Promise<boolean> {
  try {
    // Update status to processing
    await updateVideoRequestStatus(request.id, 'processing');
    // TODO: Integrate with HeyGen or similar service to generate video
    // For now, this is a placeholder
    // Simulate video generation
    const videoUrl = `https://example.com/videos/${request.id}.mp4`;
    const thumbnailUrl = `https://example.com/thumbnails/${request.id}.jpg`;
    // Update with success
    await updateVideoRequestStatus(request.id, 'completed', {
      youtubeId: `yt_${request.id}`,
      facebookId: `fb_${request.id}`,
    });
    return true;
  } catch (error) {
    console.error('[video-automation] Failed to process video:', error);
    await updateVideoRequestStatus(request.id, 'failed');
    return false;
  }
}

/**
 * Publish video to YouTube
 */
export async function publishToYoutube(
  videoId: string,
  metadata: ReturnType<typeof generateYoutubeMetadata>,
  videoUrl: string
): Promise<string | null> {
  try {
    // TODO: Implement YouTube API integration
    // This would use the YouTube Data API v3
    console.log('[video-automation] Publishing to YouTube:', metadata.title);
    return `yt_${videoId}`;
  } catch (error) {
    console.error('[video-automation] Failed to publish to YouTube:', error);
    return null;
  }
}

/**
 * Publish video to Facebook
 */
export async function publishToFacebook(
  videoId: string,
  metadata: ReturnType<typeof generateFacebookMetadata>,
  videoUrl: string,
  pageId: string
): Promise<string | null> {
  try {
    // TODO: Implement Facebook Graph API integration
    console.log('[video-automation] Publishing to Facebook:', metadata.title);
    return `fb_${videoId}`;
  } catch (error) {
    console.error('[video-automation] Failed to publish to Facebook:', error);
    return null;
  }
}

/**
 * Get video publishing configuration
 */
export async function getVideoPublishingConfig() {
  return {
    youtubeEnabled: !!process.env.YOUTUBE_API_KEY,
    youtubeChannelId: process.env.YOUTUBE_CHANNEL_ID,
    facebookEnabled: !!process.env.FACEBOOK_PAGE_ACCESS_TOKEN,
    facebookPageId: process.env.FACEBOOK_PAGE_ID,
    autoPublish: process.env.VIDEO_AUTO_PUBLISH === 'true',
    publishSchedule: process.env.VIDEO_PUBLISH_SCHEDULE,
  };
}
