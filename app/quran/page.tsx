import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { surahs } from '@/lib/data/content';

export default function QuranPage(){return <Container className='py-12 space-y-4'><h1 className='text-3xl text-brand-gold'>القرآن الكريم</h1><input className='w-full rounded-lg bg-black/20 p-3' placeholder='ابحث عن سورة...' /><div className='grid gap-3'>{surahs.map(s=><Card key={s.id}><Link href={`/quran/${s.id}`} className='flex justify-between'><span>{s.nameAr}</span><span className='arabic-muted'>{s.ayahCount} آيات</span></Link></Card>)}</div></Container>}
