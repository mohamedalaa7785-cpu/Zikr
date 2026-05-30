import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { getYoutubeChannelFeed } from '@/lib/services/youtube';

export default async function YoutubePage() {
  const feed = await getYoutubeChannelFeed(36);

  return <Container className='space-y-8 py-10 text-right'>
    <section className='space-y-3'>
      <h1 className='text-3xl font-bold text-brand-gold'>قناة اليوتيوب</h1>
      <p className='max-w-3xl leading-8 arabic-muted'>كل الفيديوهات والبلاي ليست الخاصة بقناة الموقع تظهر هنا تلقائيًا من YouTube API عند إعداد YOUTUBE_API_KEY و YOUTUBE_CHANNEL_ID.</p>
      {feed.channelId ? <Button href={`https://www.youtube.com/channel/${feed.channelId}`} variant='secondary'>فتح القناة</Button> : null}
    </section>

    {feed.error ? <Card className='border-amber-300/40 text-amber-100'>تنبيه: {feed.error}</Card> : null}

    <section className='space-y-4'>
      <h2 className='text-2xl text-brand-gold'>أحدث الفيديوهات</h2>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {feed.videos.map((video) => <Card key={video.id} className='space-y-3 overflow-hidden'>
          <a href={`https://www.youtube.com/watch?v=${video.id}`} target='_blank' rel='noreferrer' className='block'>
            {video.thumbnailUrl ? <Image src={video.thumbnailUrl} alt={video.title} width={640} height={360} className='aspect-video w-full rounded-xl object-cover' /> : <div className='aspect-video rounded-xl bg-black/30' />}
          </a>
          <h3 className='font-semibold leading-7 text-brand-cream'>{video.title}</h3>
          <p className='line-clamp-3 text-sm leading-6 arabic-muted'>{video.description}</p>
          <Button href={`https://www.youtube.com/watch?v=${video.id}`} variant='ghost'>مشاهدة</Button>
        </Card>)}
        {!feed.videos.length ? <Card className='md:col-span-2 lg:col-span-3'>لا توجد فيديوهات للعرض الآن أو لم يتم إعداد API بعد.</Card> : null}
      </div>
    </section>

    <section className='space-y-4'>
      <h2 className='text-2xl text-brand-gold'>كل قوائم التشغيل</h2>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {feed.playlists.map((playlist) => <Card key={playlist.id} className='space-y-3'>
          <a href={`https://www.youtube.com/playlist?list=${playlist.id}`} target='_blank' rel='noreferrer' className='block'>
            {playlist.thumbnailUrl ? <Image src={playlist.thumbnailUrl} alt={playlist.title} width={640} height={360} className='aspect-video w-full rounded-xl object-cover' /> : <div className='aspect-video rounded-xl bg-black/30' />}
          </a>
          <h3 className='font-semibold leading-7 text-brand-cream'>{playlist.title}</h3>
          <p className='text-sm arabic-muted'>{playlist.itemCount ?? 0} فيديو</p>
          <p className='line-clamp-3 text-sm leading-6 arabic-muted'>{playlist.description}</p>
          <Button href={`https://www.youtube.com/playlist?list=${playlist.id}`} variant='ghost'>فتح البلاي ليست</Button>
        </Card>)}
        {!feed.playlists.length ? <Card className='md:col-span-2 lg:col-span-3'>لا توجد Playlists للعرض الآن أو لم يتم إعداد API بعد.</Card> : null}
      </div>
    </section>
  </Container>;
}
