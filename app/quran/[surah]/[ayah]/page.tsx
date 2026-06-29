import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BookmarkButton } from '@/components/quran/bookmark-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { getAyah, getSurahById, getTafsir } from '@/lib/services/quran';
import { getAyahFromDb, getSurahFromDb, getTafsirFromDb } from '@/lib/services/quran-server';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Share2 } from 'lucide-react';

export const revalidate = 3600;

interface AyahPageProps {
  params: Promise<{ surah: string; ayah: string }>;
}

export async function generateMetadata({ params }: AyahPageProps): Promise<Metadata> {
  const p = await params;
  const surahId = Number.parseInt(p.surah, 10);
  const ayahId = Number.parseInt(p.ayah, 10);

  // Try DB first for metadata
  let surahData = Number.isNaN(surahId) ? null : await getSurahFromDb(surahId, 'ar');
  
  // Fallback to API
  if (!surahData && !Number.isNaN(surahId)) {
    surahData = await getSurahById(surahId, 'ar');
  }

  return {
    title: surahData ? `سورة ${surahData.surah.name} - الآية ${ayahId}` : `الآية ${p.ayah}`,
    description: 'قراءة الآية والتفسير والمشاركة',
    alternates: { canonical: `/quran/${p.surah}/${p.ayah}` },
  };
}

export default async function AyahPage({ params }: AyahPageProps) {
  const p = await params;
  const surahId = Number.parseInt(p.surah, 10);
  const ayahId = Number.parseInt(p.ayah, 10);

  if (Number.isNaN(surahId) || Number.isNaN(ayahId)) return notFound();

  // DB-First Strategy with parallel execution
  const [dbSurah, dbAyah, dbTafsir] = await Promise.all([
    getSurahFromDb(surahId, 'ar'),
    getAyahFromDb(surahId, ayahId, 'ar'),
    getTafsirFromDb(surahId, ayahId)
  ]);

  // Fallback logic
  let surahData = dbSurah;
  let ayah = dbAyah;
  let tafsir = dbTafsir;

  if (!surahData) {
    console.info(`[ayah-page] Surah DB miss for ${surahId}, falling back to API`);
    surahData = await getSurahById(surahId, 'ar');
  }

  if (!ayah) {
    console.info(`[ayah-page] Ayah DB miss for ${surahId}:${ayahId}, falling back to API`);
    ayah = await getAyah(surahId, ayahId, 'ar');
  }

  if (!tafsir) {
    console.info(`[ayah-page] Tafsir DB miss for ${surahId}:${ayahId}, falling back to API`);
    tafsir = await getTafsir(surahId, ayahId);
  }

  if (!surahData || !ayah) return notFound();

  return (
    <Container className='space-y-8 py-12 max-w-4xl'>
      <div className="flex justify-between items-center">
        <nav className='arabic-muted text-sm'>
          <Link href='/'>الرئيسية</Link> / <Link href='/quran'>القرآن</Link> /{' '}
          <Link href={`/quran/${surahData.surah.number}`}>سورة {surahData.surah.name}</Link> / الآية {ayah.numberInSurah}
        </nav>
        <Link href={`/quran/${surahData.surah.number}`}>
          <Button variant="ghost" size="sm">
            <ChevronLeft className="ml-2 h-4 w-4" />
            العودة للسورة
          </Button>
        </Link>
      </div>

      <Card className="shadow-lg border-brand-gold/20">
        <CardHeader className="text-center bg-muted/30 border-b">
          <CardTitle className="text-2xl text-brand-gold">
            سورة {surahData.surah.name} — الآية {ayah.numberInSurah}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-10">
          <p className='text-4xl leading-loose text-right font-arabic' dir="rtl">
            {ayah.text}
          </p>
          
          <div className='mt-8 flex items-center justify-between pt-6 border-t'>
            <div className="flex gap-4">
              <BookmarkButton keyRef={`quran:${surahId}:${ayah.numberInSurah}`} />
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="h-4 w-4" />
                مشاركة
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              الجزء {ayah.juz} | الصفحة {ayah.page}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-brand-gold border-r-4 border-brand-gold pr-4">التفسير الميسر</h2>
        <Card>
          <CardContent className="p-8">
            {tafsir ? (
              <p className="text-xl leading-relaxed text-right arabic-muted" dir="rtl">
                {tafsir}
              </p>
            ) : (
              <p className="text-center text-muted-foreground italic">جاري تحميل التفسير...</p>
            )}
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
