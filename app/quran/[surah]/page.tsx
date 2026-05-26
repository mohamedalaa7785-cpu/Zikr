import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BookmarkButton } from '@/components/quran/bookmark-button';
import { QuranAudioPlayer } from '@/components/quran/audio-player';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { getSurahById } from '@/lib/services/quran';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ surah: string }> }): Promise<Metadata> {
  const p = await params;
  const id = Number.parseInt(p.surah, 10);
  if (Number.isNaN(id)) return { title: 'سورة', description: 'قراءة واستماع' };

  const result = await getSurahById(id, 'ar');
  return {
    title: result ? `سورة ${result.surah.name}` : 'سورة',
    description: 'قراءة وتفسير واستماع',
  };
}

export default async function SurahPage({ params }: { params: Promise<{ surah: string }> }) {
  const p = await params;
  const id = Number.parseInt(p.surah, 10);
  if (Number.isNaN(id)) return notFound();

  const result = await getSurahById(id, 'ar');
  if (!result) return notFound();

  return (
    <Container className='space-y-6 py-12'>
      <nav className='arabic-muted text-sm'>
        <Link href='/'>الرئيسية</Link> / <Link href='/quran'>القرآن</Link> / {result.surah.name}
      </nav>
      <h1 className='text-3xl text-brand-gold'>سورة {result.surah.name}</h1>
      <QuranAudioPlayer surahId={result.surah.number} />

      {result.ayahs.length === 0 ? (
        <Card className='p-4 arabic-muted'>لا توجد آيات متاحة لهذه السورة حاليًا.</Card>
      ) : (
        <div className='space-y-3'>
          {result.ayahs.map((ayah) => (
            <Card key={ayah.numberInSurah}>
              <div className='flex justify-between gap-3'>
                <p className='text-xl leading-loose'>{ayah.text}</p>
                <BookmarkButton keyRef={`quran:${result.surah.number}:${ayah.numberInSurah}`} />
              </div>
              <Link className='text-sm text-brand-gold' href={`/quran/${result.surah.number}/${ayah.numberInSurah}`}>
                رابط الآية
              </Link>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}
