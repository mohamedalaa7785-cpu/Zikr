import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { ayahs, hadiths, surahs } from '@/lib/data/content';

function highlight(text: string, q: string): string {
  if (!q) return text;
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text.replace(new RegExp(escaped, 'gi'), (m) => `【${m}】`);
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }): Promise<Metadata> {
  const sp = await searchParams;
  const q = (sp.q || '').trim();
  return {
    title: q ? `نتائج البحث: ${q}` : 'البحث',
    description: 'البحث في القرآن والحديث',
    alternates: { canonical: q ? `/search?q=${encodeURIComponent(q)}` : '/search' }
  };
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; type?: string }> }) {
  const sp = await searchParams;
  const q = (sp.q || '').trim();
  const type = sp.type || 'all';
  const quran = q ? ayahs.filter((a) => a.textSimple.includes(q) || surahs.find((s) => s.id === a.surahId)?.nameAr.includes(q)) : [];
  const hadith = q ? hadiths.filter((h) => h.textAr.includes(q)) : [];

  return <Container className='py-12 space-y-4'><h1 className='text-3xl text-brand-gold'>البحث</h1><form className='flex gap-2'><input name='q' defaultValue={q} className='flex-1 rounded-lg bg-black/20 p-3' placeholder='ابحث في القرآن والحديث'/><select name='type' defaultValue={type} className='rounded-lg bg-black/20 p-3'><option value='all'>الكل</option><option value='quran'>القرآن</option><option value='hadith'>الحديث</option></select><button className='rounded-lg bg-brand-gold px-4 text-brand-emeraldDeep'>بحث</button></form>{(type==='all'||type==='quran')&&<Card><h2 className='mb-2 text-brand-gold'>نتائج القرآن</h2>{quran.length===0?<p className='arabic-muted'>لا نتائج.</p>:quran.map((r)=><p key={`${r.surahId}:${r.ayahNumber}`}>[{r.surahId}:{r.ayahNumber}] {highlight(r.textSimple,q)}</p>)}</Card>}{(type==='all'||type==='hadith')&&<Card><h2 className='mb-2 text-brand-gold'>نتائج الحديث</h2>{hadith.length===0?<p className='arabic-muted'>لا نتائج.</p>:hadith.map((h)=><p key={h.id}>{highlight(h.textAr,q)}</p>)}</Card>}</Container>;
}
