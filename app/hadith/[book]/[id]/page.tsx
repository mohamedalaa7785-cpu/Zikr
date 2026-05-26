import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BookmarkButton } from '@/components/quran/bookmark-button';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { hadithBooks, hadiths } from '@/lib/data/content';

export async function generateMetadata({ params }: { params: Promise<{ book: string; id: string }> }): Promise<Metadata> {
  const p = await params;
  return { title: `حديث ${p.id}`, description: 'شرح الحديث' };
}

export default async function HadithDetail({ params }: { params: Promise<{ book: string; id: string }> }) {
  const p = await params;
  const book = hadithBooks.find((b) => b.slug === p.book);
  if (!book) return notFound();
  const h = hadiths.find((x) => x.bookId === book.id && x.hadithNumber === p.id);
  if (!h) return notFound();
  return <Container className='py-12'><Card><h1 className='text-2xl text-brand-gold'>{book.nameAr} - {h.hadithNumber}</h1><p className='mt-4 text-xl leading-loose'>{h.textAr}</p><div className='mt-4 grid gap-2 arabic-muted'><p>الراوي: {h.narrator}</p><p>الدرجة: {h.grade}</p><p>الباب: {h.chapter}</p></div><div className='mt-4 flex gap-4'><BookmarkButton keyRef={`hadith:${h.ref}`}/><a className='text-sm text-brand-gold' href={`https://example.com/hadith/${h.ref}`}>مشاركة</a></div></Card></Container>;
}
