import { getAllSurahs } from '@/lib/services/quran';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { SurahSearch } from '@/components/quran/surah-search';

export const revalidate = 3600;

export default async function QuranPage() {
  const surahs = await getAllSurahs('ar');

  return (
    <Container className='space-y-4 py-12'>
      <h1 className='text-3xl text-brand-gold mb-6'>القرآن الكريم</h1>

      {surahs.length === 0 ? (
        <Card className='p-4 arabic-muted text-center'>لا توجد سور متاحة الآن. حاول مرة أخرى لاحقًا.</Card>
      ) : (
        <SurahSearch initialSurahs={surahs.map(s => ({
          number: s.number,
          name: s.name,
          numberOfAyahs: s.numberOfAyahs
        }))} />
      )}
    </Container>
  );
}
