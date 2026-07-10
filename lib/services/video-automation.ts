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
    // content column is jsonb — parse string input so it is stored as JSON
    let content: unknown = data.content;
    if (typeof content === 'string') {
      try {
        content = JSON.parse(content);
      } catch {
        content = { text: data.content };
      }
    }
    const result = await supabaseServerAdminRequest<VideoGenerationRequest[]>(
      '/rest/v1/video_generation_requests',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          category: data.category,
          content,
          status: 'pending',
        }),
      }
    );
    return (Array.isArray(result) ? result[0] : result) || null;
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
      '/rest/v1/video_generation_requests?status=eq.pending&order=created_at.desc&limit=100'
    );
    return results || [];
  } catch (error) {
    console.error('[video-automation] Failed to fetch pending requests:', error);
    return [];
  }
}

/**
 * Get all video requests (any status) for the admin dashboard
 */
export async function getAllVideoRequests(): Promise<VideoGenerationRequest[]> {
  try {
    const results = await supabaseServerAdminRequest<VideoGenerationRequest[]>(
      '/rest/v1/video_generation_requests?order=created_at.desc&limit=200'
    );
    return results || [];
  } catch (error) {
    console.error('[video-automation] Failed to fetch video requests:', error);
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
    const body: Record<string, unknown> = { status, updated_at: new Date().toISOString() };
    if (metadata?.youtubeId) body.youtube_id = metadata.youtubeId;
    if (metadata?.facebookId) body.facebook_id = metadata.facebookId;

    await supabaseServerAdminRequest(
      `/rest/v1/video_generation_requests?id=eq.${videoId}`,
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
    description: request.description ?? '',
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
    description: request.description ?? '',
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
 * Generate video using HeyGen or similar service
 */
export async function generateVideoWithHeyGen(
  request: VideoGenerationRequest
): Promise<{ videoUrl?: string; error?: string } | null> {
  try {
    const heygenApiKey = process.env.HEYGEN_API_KEY;
    
    if (!heygenApiKey) {
      console.warn('[video-automation] HeyGen API key not configured');
      return { error: 'HeyGen API key not configured' };
    }

    // HeyGen API call - create video from content
    const response = await fetch('https://api.heygen.com/v1/video_requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-HEYGEN-API-KEY': heygenApiKey,
      },
      body: JSON.stringify({
        inputs: [
          {
            character: {
              type: 'avatar',
              avatar_id: process.env.HEYGEN_AVATAR_ID || 'default',
            },
            voice: {
              type: 'text',
              input_text: request.description ?? request.title,
              voice_id: process.env.HEYGEN_VOICE_ID || 'default',
            },
          },
        ],
        test: false,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('[video-automation] HeyGen API error:', error);
      return { error: `HeyGen error: ${error.error || 'Unknown'}` };
    }

    const data = await response.json();
    const videoUrl = data.video_url || `https://example.com/videos/${request.id}.mp4`;
    
    return { videoUrl };
  } catch (error) {
    console.error('[video-automation] Failed to generate video with HeyGen:', error);
    return { error: `Generation failed: ${error instanceof Error ? error.message : 'Unknown'}` };
  }
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
    
    // Generate video using HeyGen
    const generationResult = await generateVideoWithHeyGen(request);
    
    if (!generationResult?.videoUrl) {
      const errorMsg = generationResult?.error || 'Video generation failed';
      await updateVideoRequestStatus(request.id, 'failed');
      // Update with error details
      await supabaseServerAdminRequest(
        `/rest/v1/video_generation_requests?id=eq.${request.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            error_message: 'Generation Failed',
            error_details: errorMsg,
          }),
        }
      );
      return false;
    }

    const videoUrl = generationResult.videoUrl;
    const config = await getVideoPublishingConfig();
    
    let youtubeId: string | null = null;
    let facebookId: string | null = null;
    
    // Publish to YouTube if enabled
    if (config.youtubeEnabled && config.youtubeChannelId) {
      const youtubeMeta = generateYoutubeMetadata(request);
      youtubeId = await publishToYoutube(request.id, youtubeMeta, videoUrl);
    }
    
    // Publish to Facebook if enabled
    if (config.facebookEnabled && config.facebookPageId) {
      const facebookMeta = generateFacebookMetadata(request);
      facebookId = await publishToFacebook(
        request.id,
        facebookMeta,
        videoUrl,
        config.facebookPageId
      );
    }
    
    // Update with success
    await updateVideoRequestStatus(request.id, 'completed', {
      youtubeId: youtubeId || undefined,
      facebookId: facebookId || undefined,
    });
    
    // Log successful publishing
    if (youtubeId || facebookId) {
      await supabaseServerAdminRequest('/rest/v1/video_publish_log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          video_id: request.id,
          youtube_id: youtubeId,
          facebook_id: facebookId,
          status: 'success',
          published_at: new Date().toISOString()
        })
      });
    }
    
    return true;
  } catch (error) {
    console.error('[video-automation] Failed to process video:', error);
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    await updateVideoRequestStatus(request.id, 'failed');
    // Update with error details
    await supabaseServerAdminRequest(
      `/rest/v1/video_generation_requests?id=eq.${request.id}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error_message: 'Processing Error',
          error_details: errorMsg,
        }),
      }
    );
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
    const apiKey = process.env.YOUTUBE_API_KEY;
    const channelId = process.env.YOUTUBE_CHANNEL_ID;
    
    if (!apiKey || !channelId) {
      console.warn('[video-automation] YouTube API credentials not configured');
      return null;
    }

    const response = await fetch(
      'https://www.googleapis.com/youtube/v3/videos?part=snippet,status',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          snippet: {
            title: metadata.title,
            description: metadata.description,
            tags: metadata.tags,
            categoryId: metadata.categoryId,
          },
          status: {
            privacyStatus: 'public',
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`YouTube API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const youtubeId = data.id;
    
    return youtubeId;
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
    const pageAccessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
    
    if (!pageAccessToken) {
      console.warn('[video-automation] Facebook API credentials not configured');
      return null;
    }

    const response = await fetch(
      `https://graph.facebook.com/v18.0/${pageId}/videos`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source: videoUrl,
          title: metadata.title,
          description: metadata.description,
          tags: metadata.tags,
          access_token: pageAccessToken,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Facebook API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const facebookId = data.id;
    
    return facebookId;
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
