/**
 * Matches the `video_generation_requests` table (snake_case, as returned by
 * the Supabase REST API — no field renaming happens between DB and app).
 */
export interface VideoGenerationRequest {
  id: string;
  title: string;
  description: string | null;
  category: string;
  content: unknown;
  duration?: number | null;
  thumbnail_url?: string | null;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  youtube_id?: string | null;
  facebook_id?: string | null;
  error_message?: string | null;
  error_details?: string | null;
  created_at: string;
  updated_at: string;
}
