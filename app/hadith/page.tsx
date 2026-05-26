import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { hadithBooks } from '@/lib/data/content';

export default function HadithPage(){return <Container className='py-12 space-y-4'><h1 className='text-3xl text-brand-gold'>الأحاديث</h1>{hadithBooks.map(b=><Card key={b.id}><Link href={`/hadith/${b.slug}`}>{b.nameAr}</Link></Card>)}</Container>}
