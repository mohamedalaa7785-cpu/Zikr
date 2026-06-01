import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Badge } from '@/components/ui/badge';
import { SectionHeader } from '@/components/ui/section-header';
import { getYoutubeChannelFeed } from '@/lib/services/youtube';
import { getStories } from '@/lib/services/stories';

export const revalidate = 1800;

export default async function YoutubePage() {
  const [feed, stories] = await Promise.all([
    getYoutubeChannelFeed(36),
    getStories(),
  ]);

  return (
    <Container className="space-y-12 py-10 text-right">
      {/* Hero Section */}
      <section className="space-y-4">
        <h1 className="text-4xl font-bold text-brand-gold">المحتوى المرئي والقصص</h1>
        <p className="max-w-3xl text-lg leading-8 arabic-muted">
          استكشف مجموعة متنوعة من المحتوى الروحاني: فيديوهات من اليوتيوب وقصص إسلامية ملهمة من التاريخ والتراث.
        </p>
        {feed.channelId && (
          <div className="flex gap-3 flex-wrap">
            <Button href={`https://www.youtube.com/channel/${feed.channelId}`} variant="secondary">
              زيارة القناة على يوتيوب
            </Button>
            <Button href="/stories" variant="ghost">
              عرض جميع القصص
            </Button>
          </div>
        )}
      </section>

      {feed.error && (
        <Card className="border-amber-300/40 text-amber-100 p-4">
          <p className="font-medium">تنبيه:</p>
          <p>{feed.error}</p>
          <p className="text-sm mt-2 arabic-muted">
            تأكد من إعداد YOUTUBE_API_KEY و YOUTUBE_CHANNEL_ID في متغيرات البيئة.
          </p>
        </Card>
      )}

      {/* Latest Videos Section */}
      <section className="space-y-6">
        <SectionHeader
          title="أحدث الفيديوهات"
          subtitle="محتوى مرئي جديد من القناة"
        />

        {feed.videos.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="arabic-muted">لا توجد فيديوهات متاحة حالياً.</p>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {feed.videos.map((video) => (
              <Card key={video.id} className="space-y-3 overflow-hidden hover:border-brand-gold/40 transition-colors">
                <a
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block"
                >
                  {video.thumbnailUrl ? (
                    <Image
                      src={video.thumbnailUrl}
                      alt={video.title}
                      width={640}
                      height={360}
                      className="aspect-video w-full rounded-xl object-cover hover:opacity-90 transition-opacity"
                    />
                  ) : (
                    <div className="aspect-video rounded-xl bg-black/30 flex items-center justify-center">
                      <span className="arabic-muted">لا توجد صورة</span>
                    </div>
                  )}
                </a>
                <h3 className="font-semibold leading-7 text-brand-cream line-clamp-2">
                  {video.title}
                </h3>
                <p className="line-clamp-3 text-sm leading-6 arabic-muted">
                  {video.description}
                </p>
                <Button
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  variant="ghost"
                >
                  مشاهدة الفيديو
                </Button>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Playlists Section */}
      {feed.playlists.length > 0 && (
        <section className="space-y-6">
          <SectionHeader
            title="قوائم التشغيل"
            subtitle="سلاسل متكاملة من المحتوى"
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {feed.playlists.map((playlist) => (
              <Card key={playlist.id} className="space-y-3 hover:border-brand-gold/40 transition-colors">
                <a
                  href={`https://www.youtube.com/playlist?list=${playlist.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block"
                >
                  {playlist.thumbnailUrl ? (
                    <Image
                      src={playlist.thumbnailUrl}
                      alt={playlist.title}
                      width={640}
                      height={360}
                      className="aspect-video w-full rounded-xl object-cover hover:opacity-90 transition-opacity"
                    />
                  ) : (
                    <div className="aspect-video rounded-xl bg-black/30 flex items-center justify-center">
                      <span className="arabic-muted">لا توجد صورة</span>
                    </div>
                  )}
                </a>
                <h3 className="font-semibold leading-7 text-brand-cream line-clamp-2">
                  {playlist.title}
                </h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{playlist.itemCount ?? 0} فيديو</Badge>
                </div>
                <p className="line-clamp-3 text-sm leading-6 arabic-muted">
                  {playlist.description}
                </p>
                <Button
                  href={`https://www.youtube.com/playlist?list=${playlist.id}`}
                  variant="ghost"
                >
                  فتح القائمة
                </Button>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Stories Section - Removed: stories content moved to dedicated /stories page */}

      {/* Call to Action */}
      <section className="text-center space-y-4">
        <Card className="py-8 space-y-4">
          <h2 className="text-2xl text-brand-gold">هل لديك محتوى تريد مشاركته؟</h2>
          <p className="arabic-muted max-w-xl mx-auto leading-7">
            شاركنا قصصك وتجاربك الروحانية لتلهم الآخرين في رحلتهم الإيمانية.
          </p>
          <Button href="/auth/login" variant="secondary">
            سجل الدخول للمشاركة
          </Button>
        </Card>
      </section>
    </Container>
  );
}
