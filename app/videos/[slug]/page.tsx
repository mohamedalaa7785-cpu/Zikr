'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

interface Video {
  id: string;
  title: string;
  description?: string;
  youtube_id?: string;
  thumbnail_url?: string;
  duration?: number;
  views: number;
  metadata?: Record<string, unknown>;
}

export default function VideoDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    const fetchVideo = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const { data } = await supabase
          .from('videos')
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .limit(1)
          .single();

        if (data) {
          setVideo(data);
          // Increment view count silently
          supabase
            .from('videos')
            .update({ views: (data.views ?? 0) + 1 })
            .eq('id', data.id)
            .then(() => {});
        }
      } catch {
        setVideo(null);
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [slug]);

  if (loading) {
    return <Container className="py-12"><p className="text-center text-brand-cream/70">جاري التحميل...</p></Container>;
  }
  if (!video) {
    return <Container className="py-12"><p className="text-center text-brand-cream/70">لم يتم العثور على الفيديو</p></Container>;
  }

  return (
    <Container className="py-12 space-y-8 max-w-4xl">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-brand-gold">{video.title}</h1>
      </div>

      {video.youtube_id && (
        <div className="w-full aspect-video rounded-lg overflow-hidden">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${video.youtube_id}`}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      <Card className="p-6 space-y-4 bg-black/30 border-brand-gold/30">
        <div className="flex justify-between items-center text-sm text-brand-cream/70">
          <span>{video.views} مشاهدة</span>
          {video.duration && (
            <span>
              {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
            </span>
          )}
        </div>
        {video.description && (
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-brand-gold">الوصف</h3>
            <p className="text-brand-cream/90 leading-relaxed">{video.description}</p>
          </div>
        )}
      </Card>

      {video.metadata && Object.keys(video.metadata).length > 0 && (
        <Card className="p-6 space-y-4 bg-black/30 border-brand-gold/30">
          <h3 className="text-lg font-bold text-brand-gold">معلومات إضافية</h3>
          <div className="space-y-2 text-sm text-brand-cream/80">
            {Object.entries(video.metadata).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-brand-cream/60">{key}:</span>
                <span>{String(value)}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </Container>
  );
}
