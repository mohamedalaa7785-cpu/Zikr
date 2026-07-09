import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabaseServerAnonRequest } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

interface Video {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  youtube_id: string | null;
  thumbnail_url: string | null;
  duration: number | null;
  views: number;
  published: boolean;
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return '';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default async function VideosPage() {
  let videos: Video[] = [];

  try {
    const data = await supabaseServerAnonRequest<Video[]>(
      '/rest/v1/videos?select=id,title,slug,description,youtube_id,thumbnail_url,duration,views,published&published=eq.true&order=created_at.desc&limit=20'
    );
    if (Array.isArray(data)) {
      videos = data.filter((v) => v.published);
    }
  } catch {
    // fallback to empty list
  }

  return (
    <Container className="py-12 space-y-10">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-brand-gold">الفيديوهات</h1>
        <p className="max-w-2xl mx-auto text-lg leading-8 arabic-muted">
          شاهد أفضل الفيديوهات التعليمية الإسلامية
        </p>
      </section>

      {videos.length === 0 ? (
        <Card className="p-8 text-center arabic-muted">لا توجد فيديوهات متاحة حالياً.</Card>
      ) : (
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <Card
              key={video.id}
              className="space-y-0 overflow-hidden hover:border-brand-gold/50 transition-colors"
            >
              {/* Thumbnail */}
              <div className="bg-brand-gold/10 h-48 flex items-center justify-center overflow-hidden relative">
                {video.thumbnail_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                ) : video.youtube_id ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`https://i.ytimg.com/vi/${video.youtube_id}/hqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-5xl">📹</span>
                )}
                {video.duration && (
                  <span className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                    {formatDuration(video.duration)}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-4 space-y-3">
                <h3 className="text-lg font-bold text-brand-gold line-clamp-2">
                  {video.title}
                </h3>
                {video.description && (
                  <p className="text-sm arabic-muted line-clamp-2">{video.description}</p>
                )}
                <div className="flex justify-between text-sm arabic-muted">
                  <span>{video.views.toLocaleString('ar-EG')} مشاهدة</span>
                </div>
                <Button href={`/videos/${video.slug}`} variant="secondary" className="w-full">
                  شاهد الآن
                </Button>
              </div>
            </Card>
          ))}
        </section>
      )}
    </Container>
  );
}
