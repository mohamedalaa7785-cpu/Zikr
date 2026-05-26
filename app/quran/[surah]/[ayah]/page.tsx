import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BookmarkButton } from '@/components/quran/bookmark-button';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { ayahs, surahs, tafsir } from '@/lib/data/content';

export async function generateMetadata({ params }: { params: Promise<{ surah: string; ayah: string }> }): Promise<Metadata> {
  const p = await params;
  const surah = surahs.find((s) => String(s.id) === p.surah);
  return {
    title: surah ? `سورة ${surah.nameAr} - الآية ${p.ayah}` : `الآية ${p.ayah}`,
    description: 'قراءة الآية مع التفسير والمشاركة',
    alternates: { canonical: `/quran/${p.surah}/${p.ayah}` }
  };
}

export default async function AyahPage({ params }: { params: Promise<{ surah: string; ayah: string }> }) {
  const p = await params;
  const surah = surahs.find((s) => String(s.id) === p.surah);
  if (!surah) return notFound();

  const ayahNumber = Number.parseInt(p.ayah, 10);
  const ayah = ayahs.find((a) => a.surahId === surah.id && a.ayahNumber === ayahNumber);
  if (!ayah) return notFound();

  const tafsirRow = tafsir.find((t) => t.surahId === surah.id && t.ayahNumber === ayahNumber);
  const shareHref = `/quran/${surah.id}/${ayah.ayahNumber}`;

  return (
    <Container className='py-12 space-y-6'>
      <nav className='text-sm arabic-muted'>
        <Link href='/'>الرئيسية</Link> / <Link href='/quran'>القرآن</Link> /{' '}
        <Link href={`/quran/${surah.id}`}>سورة {surah.nameAr}</Link> / الآية {ayah.ayahNumber}
      </nav>
      <Card>
        <h1 className='text-2xl text-brand-gold'>سورة {surah.nameAr} — الآية {ayah.ayahNumber}</h1>
        <p className='mt-4 text-2xl leading-loose'>{ayah.textUthmani}</p>
        <p className='mt-3 arabic-muted'>{ayah.textSimple}</p>
        <div className='mt-4 flex items-center gap-4'>
          <BookmarkButton keyRef={`quran:${surah.id}:${ayah.ayahNumber}`} />
          <Link href={shareHref} className='text-sm text-brand-gold'>نسخ رابط الآية</Link>
        </div>
        {tafsirRow ? (
          <div className='mt-6 rounded-xl border border-brand-gold/20 bg-black/10 p-4'>
            <h2 className='font-semibold text-brand-gold'>{tafsirRow.source}</h2>
            <p className='mt-2 arabic-muted'>{tafsirRow.text}</p>
          </div>
        ) : null}
      </Card>
    </Container>
  );
}
