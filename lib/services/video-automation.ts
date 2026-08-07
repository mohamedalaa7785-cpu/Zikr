import { supabaseServerAdminRequest } from '@/lib/supabase/server';
import type { VideoGenerationRequest } from '@/lib/types/video';

export type { VideoGenerationRequest };

// Resolve env vars with numbered-suffix fallback (matches lib/env.ts).
// YouTube upload OAuth reuses the Google OAuth client when no dedicated
// YOUTUBE_CLIENT_* is provisioned.
function pickEnv(...bases: string[]): string | undefined {
  const suffixes = ['', '_2', '_3', '_19', '_20', '_22'];
  for (const base of bases) {
    for (const suffix of suffixes) {
      const value = process.env[`${base}${suffix}`];
      if (value) return value;
    }
  }
  return undefined;
}

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
 * Get pending video requests (oldest first so the queue is FIFO)
 */
export async function getPendingVideoRequests(limit = 100): Promise<VideoGenerationRequest[]> {
  try {
    const results = await supabaseServerAdminRequest<VideoGenerationRequest[]>(
      `/rest/v1/video_generation_requests?status=eq.pending&order=created_at.asc&limit=${limit}`
    );
    return results || [];
  } catch (error) {
    console.error('[video-automation] Failed to fetch pending requests:', error);
    return [];
  }
}

/**
 * Claim pending video requests before processing.
 *
 * The conditional PATCH (`id` + `status=eq.pending`) is an optimistic lock so
 * overlapping runners cannot process the same row twice. Claimed rows move
 * pending → processing before any external API side effects occur.
 */
export async function claimPendingVideoRequests(limit = 100): Promise<VideoGenerationRequest[]> {
  const pendingRequests = await getPendingVideoRequests(limit);
  const claimed: VideoGenerationRequest[] = [];

  for (const request of pendingRequests) {
    try {
      const result = await supabaseServerAdminRequest<VideoGenerationRequest[]>(
        `/rest/v1/video_generation_requests?id=eq.${encodeURIComponent(request.id)}&status=eq.pending`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Prefer: 'return=representation',
          },
          body: JSON.stringify({
            status: 'processing',
            error_message: null,
            error_details: null,
            updated_at: new Date().toISOString(),
          }),
        }
      );
      if (Array.isArray(result) && result[0]) claimed.push(result[0]);
    } catch (error) {
      console.error(`[video-automation] Failed to claim video request ${request.id}:`, error);
    }
  }

  return claimed;
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
 * Update video request status.
 * Resetting to `pending` (retry) clears previous error/publish state.
 */
export async function updateVideoRequestStatus(
  videoId: string,
  status: 'pending' | 'processing' | 'completed' | 'failed',
  metadata?: { youtubeId?: string; facebookId?: string; videoUrl?: string }
): Promise<boolean> {
  try {
    const body: Record<string, unknown> = { status, updated_at: new Date().toISOString() };
    if (metadata?.youtubeId) body.youtube_id = metadata.youtubeId;
    if (metadata?.facebookId) body.facebook_id = metadata.facebookId;
    if (metadata?.videoUrl) body.video_url = metadata.videoUrl;
    if (status === 'pending') {
      // Retry: clear stale error and publish state
      body.error_message = null;
      body.error_details = null;
      body.youtube_id = null;
      body.facebook_id = null;
    }

    await supabaseServerAdminRequest(`/rest/v1/video_generation_requests?id=eq.${videoId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return true;
  } catch (error) {
    console.error('[video-automation] Failed to update video request:', error);
    return false;
  }
}

/** Persist a failure with a human-readable message and technical details. */
async function markVideoFailed(videoId: string, message: string, details: string): Promise<void> {
  try {
    await supabaseServerAdminRequest(`/rest/v1/video_generation_requests?id=eq.${videoId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'failed',
        error_message: message,
        error_details: details.slice(0, 4000),
        updated_at: new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.error('[video-automation] Failed to record failure:', error);
  }
}

/** Append an entry to the publish log (best-effort, never throws). */
async function logPublishResult(entry: {
  videoId: string;
  youtubeId?: string | null;
  facebookId?: string | null;
  status: 'success' | 'partial' | 'failed';
}): Promise<void> {
  try {
    await supabaseServerAdminRequest('/rest/v1/video_publish_log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        video_id: entry.videoId,
        youtube_id: entry.youtubeId ?? null,
        facebook_id: entry.facebookId ?? null,
        status: entry.status,
        published_at: new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.error('[video-automation] Failed to write publish log:', error);
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
  const title = `تلاوة سورة رقم ${surahId} - الآيات ${ayahStart}-${ayahEnd}`;
  const description = `تلاوة من القرآن الكريم - سورة رقم ${surahId}، من الآية ${ayahStart} إلى الآية ${ayahEnd}`;
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
export async function generateStoryVideo(storyId: string): Promise<VideoGenerationRequest | null> {
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
export async function generateDuaVideo(duaId: string): Promise<VideoGenerationRequest | null> {
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


function requestContentObject(request: VideoGenerationRequest): Record<string, unknown> {
  return request.content && typeof request.content === 'object' && !Array.isArray(request.content)
    ? (request.content as Record<string, unknown>)
    : {};
}

function slugFromRequest(request: VideoGenerationRequest): string {
  const content = requestContentObject(request);
  const publicPath = content.publicPath;
  if (typeof publicPath === 'string') {
    const slug = publicPath.split('/').filter(Boolean).pop();
    if (slug) return slug;
  }
  return request.title
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || request.id;
}

async function publishGeneratedVideoOnSite(
  request: VideoGenerationRequest,
  videoUrl: string,
  youtubeId?: string | null,
  facebookId?: string | null
): Promise<void> {
  const content = requestContentObject(request);
  const slug = slugFromRequest(request);
  await supabaseServerAdminRequest('/rest/v1/videos?on_conflict=slug', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({
      title: request.title,
      slug,
      description: request.description,
      youtube_id: youtubeId ?? null,
      thumbnail_url: request.thumbnail_url ?? null,
      published: true,
      metadata: {
        ...(typeof content.metadata === 'object' && content.metadata !== null ? content.metadata : {}),
        generatedVideoUrl: videoUrl,
        facebookId: facebookId ?? null,
        source: 'video_generation_requests',
        requestId: request.id,
      },
      updated_at: new Date().toISOString(),
    }),
  });
}

// ─── Video generation (HeyGen) ───────────────────────────────────────────────

const HEYGEN_POLL_INTERVAL_MS = 5000;
const HEYGEN_MAX_POLLS = 48; // 4 minutes max within a single invocation

/**
 * Generate a video with HeyGen.
 * HeyGen generation is asynchronous: we submit the job, then poll the status
 * endpoint until the video is ready or a bounded timeout elapses.
 * Never returns a fabricated URL — a missing URL is a hard failure.
 */
export async function generateVideoWithHeyGen(
  request: VideoGenerationRequest
): Promise<{ videoUrl?: string; error?: string }> {
  const heygenApiKey = process.env.HEYGEN_API_KEY;

  if (!heygenApiKey) {
    return { error: 'HEYGEN_API_KEY is not configured' };
  }
  const avatarId = process.env.HEYGEN_AVATAR_ID;
  const voiceId = process.env.HEYGEN_VOICE_ID;
  if (!avatarId || !voiceId) {
    return { error: 'HEYGEN_AVATAR_ID / HEYGEN_VOICE_ID are not configured' };
  }

  try {
    // 1. Submit generation job (HeyGen v2 API)
    const createRes = await fetch('https://api.heygen.com/v2/video/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': heygenApiKey,
      },
      body: JSON.stringify({
        video_inputs: [
          {
            character: { type: 'avatar', avatar_id: avatarId },
            voice: {
              type: 'text',
              input_text: request.description || request.title,
              voice_id: voiceId,
            },
          },
        ],
        dimension: { width: 1280, height: 720 },
      }),
    });

    if (!createRes.ok) {
      const errBody = await createRes.text().catch(() => '');
      return { error: `HeyGen create failed (HTTP ${createRes.status}): ${errBody.slice(0, 500)}` };
    }

    const createData = (await createRes.json()) as { data?: { video_id?: string } };
    const heygenVideoId = createData.data?.video_id;
    if (!heygenVideoId) {
      return { error: 'HeyGen did not return a video_id' };
    }

    // 2. Poll status until completed / failed / timeout
    for (let i = 0; i < HEYGEN_MAX_POLLS; i++) {
      await new Promise((r) => setTimeout(r, HEYGEN_POLL_INTERVAL_MS));

      const statusRes = await fetch(
        `https://api.heygen.com/v1/video_status.get?video_id=${encodeURIComponent(heygenVideoId)}`,
        { headers: { 'X-Api-Key': heygenApiKey } }
      );
      if (!statusRes.ok) continue;

      const statusData = (await statusRes.json()) as {
        data?: { status?: string; video_url?: string; error?: { message?: string } };
      };
      const status = statusData.data?.status;

      if (status === 'completed') {
        const videoUrl = statusData.data?.video_url;
        if (!videoUrl) return { error: 'HeyGen reported completed but returned no video_url' };
        return { videoUrl };
      }
      if (status === 'failed') {
        return { error: `HeyGen generation failed: ${statusData.data?.error?.message ?? 'unknown'}` };
      }
      // pending / processing → keep polling
    }

    return { error: `HeyGen generation timed out (video_id=${heygenVideoId}); will retry on next run` };
  } catch (error) {
    return {
      error: `Generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

// ─── Publishing: YouTube (OAuth2 + resumable upload) ─────────────────────────

/**
 * Exchange the stored refresh token for a short-lived access token.
 * YouTube uploads REQUIRE OAuth2 — an API key alone cannot upload videos.
 */
async function getYoutubeAccessToken(): Promise<string | null> {
  const clientId = pickEnv('YOUTUBE_CLIENT_ID', 'GOOGLE_CLIENT_ID');
  const clientSecret = pickEnv('YOUTUBE_CLIENT_SECRET', 'GOOGLE_CLIENT_SECRET');
  const refreshToken = pickEnv('YOUTUBE_REFRESH_TOKEN');
  if (!clientId || !clientSecret || !refreshToken) return null;

  try {
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.error('[video-automation] YouTube token refresh failed:', res.status, body.slice(0, 300));
      return null;
    }
    const data = (await res.json()) as { access_token?: string };
    return data.access_token ?? null;
  } catch (error) {
    console.error('[video-automation] YouTube token refresh error:', error);
    return null;
  }
}

/**
 * Publish a video to YouTube: download the generated file, then upload it via
 * the resumable upload API with the video metadata.
 */
export async function publishToYoutube(
  videoId: string,
  metadata: ReturnType<typeof generateYoutubeMetadata>,
  videoUrl: string
): Promise<string | null> {
  try {
    const accessToken = await getYoutubeAccessToken();
    if (!accessToken) {
      console.warn(
        '[video-automation] YouTube OAuth not configured (YOUTUBE_CLIENT_ID / YOUTUBE_CLIENT_SECRET / YOUTUBE_REFRESH_TOKEN required)'
      );
      return null;
    }

    // 1. Fetch the generated video bytes
    const videoRes = await fetch(videoUrl);
    if (!videoRes.ok) {
      throw new Error(`Could not download generated video (HTTP ${videoRes.status})`);
    }
    const videoBuffer = await videoRes.arrayBuffer();

    // 2. Start a resumable upload session
    const initRes = await fetch(
      'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json; charset=UTF-8',
          'X-Upload-Content-Type': 'video/mp4',
          'X-Upload-Content-Length': String(videoBuffer.byteLength),
        },
        body: JSON.stringify({
          snippet: {
            title: metadata.title.slice(0, 100),
            description: metadata.description.slice(0, 5000),
            tags: metadata.tags,
            categoryId: metadata.categoryId,
          },
          status: { privacyStatus: 'public', selfDeclaredMadeForKids: false },
        }),
      }
    );
    if (!initRes.ok) {
      const body = await initRes.text().catch(() => '');
      throw new Error(`YouTube upload init failed (HTTP ${initRes.status}): ${body.slice(0, 300)}`);
    }
    const uploadLocation = initRes.headers.get('location');
    if (!uploadLocation) throw new Error('YouTube did not return an upload session URL');

    // 3. Upload the bytes
    const uploadRes = await fetch(uploadLocation, {
      method: 'PUT',
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Length': String(videoBuffer.byteLength),
      },
      body: videoBuffer,
    });
    if (!uploadRes.ok) {
      const body = await uploadRes.text().catch(() => '');
      throw new Error(`YouTube upload failed (HTTP ${uploadRes.status}): ${body.slice(0, 300)}`);
    }

    const data = (await uploadRes.json()) as { id?: string };
    return data.id ?? null;
  } catch (error) {
    console.error('[video-automation] Failed to publish to YouTube:', error);
    return null;
  }
}

// ─── Publishing: Facebook (Graph API file_url upload) ────────────────────────

/**
 * Publish a hosted video to a Facebook Page via the Graph API `file_url`
 * parameter (Graph pulls the file from the URL itself — no local upload needed).
 */
export async function publishToFacebook(
  videoId: string,
  metadata: ReturnType<typeof generateFacebookMetadata>,
  videoUrl: string,
  pageId: string
): Promise<string | null> {
  try {
    const pageAccessToken = pickEnv('FACEBOOK_PAGE_ACCESS_TOKEN');
    if (!pageAccessToken) {
      console.warn('[video-automation] FACEBOOK_PAGE_ACCESS_TOKEN not configured');
      return null;
    }

    const params = new URLSearchParams({
      file_url: videoUrl,
      title: metadata.title,
      description: metadata.description,
      access_token: pageAccessToken,
    });

    const response = await fetch(`https://graph.facebook.com/v21.0/${pageId}/videos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });

    if (!response.ok) {
      const error = (await response.json().catch(() => ({}))) as {
        error?: { message?: string };
      };
      throw new Error(`Facebook API error: ${error.error?.message || `HTTP ${response.status}`}`);
    }

    const data = (await response.json()) as { id?: string };
    return data.id ?? null;
  } catch (error) {
    console.error('[video-automation] Failed to publish to Facebook:', error);
    return null;
  }
}

// ─── Pipeline orchestration ──────────────────────────────────────────────────

/**
 * Process a single video generation request end-to-end.
 *
 * Status semantics (strict):
 * - `completed` ONLY when generation succeeded AND every enabled publish
 *   target succeeded. If no publish target is configured, generation success
 *   alone completes the request (the video URL is persisted).
 * - `failed` with error details in every other case.
 */
export async function processVideoGenerationRequest(
  request: VideoGenerationRequest,
  options: { alreadyClaimed?: boolean } = {}
): Promise<boolean> {
  try {
    if (!options.alreadyClaimed) {
      await updateVideoRequestStatus(request.id, 'processing');
    }

    // 1. Generate the video — no fabricated fallback URLs.
    const generationResult = await generateVideoWithHeyGen(request);
    if (!generationResult.videoUrl) {
      await markVideoFailed(
        request.id,
        'Generation Failed',
        generationResult.error || 'Video generation returned no URL'
      );
      return false;
    }
    const videoUrl = generationResult.videoUrl;

    // 2. Publish to every enabled target.
    const config = await getVideoPublishingConfig();
    const failures: string[] = [];
    let youtubeId: string | null = null;
    let facebookId: string | null = null;

    if (config.youtubeEnabled) {
      youtubeId = await publishToYoutube(request.id, generateYoutubeMetadata(request), videoUrl);
      if (!youtubeId) failures.push('YouTube publish failed');
    }

    if (config.facebookEnabled && config.facebookPageId) {
      facebookId = await publishToFacebook(
        request.id,
        generateFacebookMetadata(request),
        videoUrl,
        config.facebookPageId
      );
      if (!facebookId) failures.push('Facebook publish failed');
    }

    // 3. Record the outcome truthfully and keep the site video library in sync.
    if (youtubeId || facebookId || videoUrl) {
      await publishGeneratedVideoOnSite(request, videoUrl, youtubeId, facebookId);
    }

    if (failures.length > 0) {
      await markVideoFailed(request.id, 'Publish Failed', failures.join('; '));
      await logPublishResult({
        videoId: request.id,
        youtubeId,
        facebookId,
        status: youtubeId || facebookId ? 'partial' : 'failed',
      });
      // Persist whatever succeeded so a retry does not re-publish.
      if (youtubeId || facebookId) {
        await supabaseServerAdminRequest(`/rest/v1/video_generation_requests?id=eq.${request.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            youtube_id: youtubeId,
            facebook_id: facebookId,
            video_url: videoUrl,
          }),
        });
      }
      return false;
    }

    await updateVideoRequestStatus(request.id, 'completed', {
      youtubeId: youtubeId || undefined,
      facebookId: facebookId || undefined,
      videoUrl,
    });

    if (youtubeId || facebookId) {
      await logPublishResult({ videoId: request.id, youtubeId, facebookId, status: 'success' });
    }

    return true;
  } catch (error) {
    console.error('[video-automation] Failed to process video:', error);
    await markVideoFailed(
      request.id,
      'Processing Error',
      error instanceof Error ? error.message : 'Unknown error'
    );
    return false;
  }
}

/**
 * Get video publishing configuration.
 * YouTube is "enabled" only when the full OAuth credential set exists —
 * an API key alone cannot upload videos.
 */
export async function getVideoPublishingConfig() {
  const youtubeEnabled = Boolean(
    pickEnv('YOUTUBE_CLIENT_ID', 'GOOGLE_CLIENT_ID') &&
      pickEnv('YOUTUBE_CLIENT_SECRET', 'GOOGLE_CLIENT_SECRET') &&
      pickEnv('YOUTUBE_REFRESH_TOKEN')
  );
  return {
    youtubeEnabled,
    youtubeChannelId: pickEnv('YOUTUBE_CHANNEL_ID'),
    facebookEnabled: Boolean(
      pickEnv('FACEBOOK_PAGE_ACCESS_TOKEN') && pickEnv('FACEBOOK_PAGE_ID')
    ),
    facebookPageId: pickEnv('FACEBOOK_PAGE_ID'),
    autoPublish: pickEnv('VIDEO_AUTO_PUBLISH') === 'true',
    publishSchedule: pickEnv('VIDEO_PUBLISH_SCHEDULE'),
  };
}
