import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { hadithBooks, hadiths } from '@/lib/data/content';

export default async function BookPage({ params }: { params: Promise<{ book: string }> }) {
  const p = await params;
  const book = hadithBooks.find((b) => b.slug === p.book);
  if (!book) return notFound();
  const rows = hadiths.filter((h) => h.bookId === book.id);
  return <Container className='py-12 space-y-4'><h1 className='text-3xl text-brand-gold'>{book.nameAr}</h1>{rows.map((h)=><Card key={h.id}><Link href={`/hadith/${book.slug}/${h.hadithNumber}`}>حديث رقم {h.hadithNumber}</Link><p className='arabic-muted mt-2 line-clamp-2'>{h.textAr}</p></Card>)}</Container>;
}
