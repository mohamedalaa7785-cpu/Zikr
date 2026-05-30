import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BookmarkButton } from '@/components/quran/bookmark-button';
import { QuranAudioPlayer } from '@/components/quran/audio-player';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { getSurahById } from '@/lib/services/quran';
import { Badge } from '@/components/ui/badge';

export const revalidate = 3600; // Surah page cache

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
      
      <div className="flex justify-between items-center">
        <h1 className='text-4xl font-bold text-brand-gold'>سورة {result.surah.name}</h1>
        <Badge variant="outline" className="text-lg px-4 py-1">
          {result.surah.numberOfAyahs} آية
        </Badge>
      </div>

      <QuranAudioPlayer surahId={result.surah.number} />

      {result.ayahs.length === 0 ? (
        <Card className='p-8 text-center arabic-muted'>لا توجد آيات متاحة لهذه السورة حاليًا.</Card>
      ) : (
        <div className='space-y-6'>
          {result.ayahs.map((ayah) => (
            <Card key={ayah.numberInSurah} className="p-6 hover:shadow-md transition-shadow">
              <div className='flex flex-col gap-4'>
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 text-right">
                    <p className='text-3xl leading-loose font-arabic' dir="rtl">
                      {ayah.text} 
                      <span className="inline-flex items-center justify-center w-10 h-10 mr-4 rounded-full border-2 border-brand-gold text-sm font-bold text-brand-gold">
                        {ayah.numberInSurah}
                      </span>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 pt-4 border-t border-muted">
                  <BookmarkButton keyRef={`quran:${result.surah.number}:${ayah.numberInSurah}`} />
                  <Link 
                    className='text-sm text-brand-gold hover:underline' 
                    href={`/quran/${result.surah.number}/${ayah.numberInSurah}`}
                  >
                    التفسير والتفاصيل
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}
