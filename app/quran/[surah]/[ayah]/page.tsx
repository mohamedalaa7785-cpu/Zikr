import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BookmarkButton } from '@/components/quran/bookmark-button';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { getAyah, getSurahById } from '@/lib/services/quran';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ surah: string; ayah: string }> }): Promise<Metadata> {
  const p = await params;
  const surahId = Number.parseInt(p.surah, 10);
  const ayahId = Number.parseInt(p.ayah, 10);

  const surahData = Number.isNaN(surahId) ? null : await getSurahById(surahId, 'ar');

  return {
    title: surahData ? `سورة ${surahData.surah.name} - الآية ${ayahId}` : `الآية ${p.ayah}`,
    description: 'قراءة الآية والمشاركة',
    alternates: { canonical: `/quran/${p.surah}/${p.ayah}` },
  };
}

export default async function AyahPage({ params }: { params: Promise<{ surah: string; ayah: string }> }) {
  const p = await params;
  const surahId = Number.parseInt(p.surah, 10);
  const ayahId = Number.parseInt(p.ayah, 10);

  if (Number.isNaN(surahId) || Number.isNaN(ayahId)) return notFound();

  const [surahData, ayah] = await Promise.all([getSurahById(surahId, 'ar'), getAyah(surahId, ayahId, 'ar')]);

  if (!surahData || !ayah) return notFound();

  return (
    <Container className='space-y-6 py-12'>
      <nav className='arabic-muted text-sm'>
        <Link href='/'>الرئيسية</Link> / <Link href='/quran'>القرآن</Link> /{' '}
        <Link href={`/quran/${surahData.surah.number}`}>سورة {surahData.surah.name}</Link> / الآية {ayah.numberInSurah}
      </nav>
      <Card>
        <h1 className='text-2xl text-brand-gold'>
          سورة {surahData.surah.name} — الآية {ayah.numberInSurah}
        </h1>
        <p className='mt-4 text-2xl leading-loose'>{ayah.text}</p>
        <div className='mt-4 flex items-center gap-4'>
          <BookmarkButton keyRef={`quran:${surahId}:${ayah.numberInSurah}`} />
          <Link href={`/quran/${surahId}/${ayah.numberInSurah}`} className='text-sm text-brand-gold'>
            نسخ رابط الآية
          </Link>
        </div>
      </Card>
    </Container>
  );
}
