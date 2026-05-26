import Link from 'next/link';
import { getAllSurahs } from '@/lib/services/quran';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';

export const revalidate = 3600;

export default async function QuranPage() {
  const surahs = await getAllSurahs('ar');

  return (
    <Container className='space-y-4 py-12'>
      <h1 className='text-3xl text-brand-gold'>القرآن الكريم</h1>
      <input className='w-full rounded-lg bg-black/20 p-3' placeholder='ابحث عن سورة...' readOnly />

      {surahs.length === 0 ? (
        <Card className='p-4 arabic-muted'>لا توجد سور متاحة الآن. حاول مرة أخرى لاحقًا.</Card>
      ) : (
        <div className='grid gap-3'>
          {surahs.map((surah) => (
            <Card key={surah.number}>
              <Link href={`/quran/${surah.number}`} className='flex justify-between'>
                <span>{surah.name}</span>
                <span className='arabic-muted'>{surah.numberOfAyahs} آيات</span>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}
