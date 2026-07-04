export interface VideoGenerationRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  content: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  youtubeId?: string | null;
  facebookId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
