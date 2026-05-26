import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BookmarkButton } from '@/components/quran/bookmark-button';
import { QuranAudioPlayer } from '@/components/quran/audio-player';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { ayahs, surahs, tafsir } from '@/lib/data/content';

export async function generateMetadata({ params }: { params: Promise<{ surah: string }> }): Promise<Metadata> {
  const p = await params;
  const s = surahs.find((x) => String(x.id) === p.surah);
  return { title: s ? `سورة ${s.nameAr}` : 'سورة', description: 'قراءة وتفسير واستماع' };
}

export default async function SurahPage({ params }: { params: Promise<{ surah: string }> }) {
  const p = await params;
  const s = surahs.find((x) => String(x.id) === p.surah);
  if (!s) return notFound();
  const items = ayahs.filter((a) => a.surahId === s.id);
  return <Container className='py-12 space-y-6'><nav className='text-sm arabic-muted'><Link href='/'>الرئيسية</Link> / <Link href='/quran'>القرآن</Link> / {s.nameAr}</nav><h1 className='text-3xl text-brand-gold'>سورة {s.nameAr}</h1><QuranAudioPlayer surahId={s.id}/><div className='space-y-3'>{items.map((a)=>{const t=tafsir.find((x)=>x.surahId===a.surahId&&x.ayahNumber===a.ayahNumber);return <Card key={a.ayahNumber}><div className='flex justify-between gap-3'><p className='text-xl leading-loose'>{a.textUthmani}</p><BookmarkButton keyRef={`quran:${a.surahId}:${a.ayahNumber}`}/></div><p className='arabic-muted'>{a.textSimple}</p>{t&&<details className='mt-2'><summary>التفسير</summary><p className='mt-2 arabic-muted'>{t.text}</p></details>}<Link className='text-sm text-brand-gold' href={`/quran/${a.surahId}/${a.ayahNumber}`}>رابط الآية</Link></Card>;})}</div></Container>;
}
