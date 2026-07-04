import { supabaseServerAnonRequest } from '@/lib/supabase/server';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Reciter = {
  id: string;
  name_ar: string;
  name_en: string;
  style: string | null;
};

export default async function RecitersPage() {
  let reciters: Reciter[] = [];
  try {
    const data = await supabaseServerAnonRequest<Reciter[]>(
      '/rest/v1/quran_reciters?select=id,name_ar,name_en,style&order=name_ar.asc'
    );
    reciters = data || [];
  } catch {
    reciters = [];
  }

  return (
    <Container className='space-y-8 py-10 text-right'>
      <section className='space-y-3'>
        <h1 className='text-3xl font-bold text-brand-gold'>قراء القرآن الكريم</h1>
        <p className='max-w-3xl leading-8 arabic-muted'>
          استمع لتلاوات القرآن الكريم بأصوات نخبة من أشهر القراء حول العالم.
        </p>
      </section>

      <section className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {reciters.map((reciter) => (
          <Card key={reciter.id} className='space-y-3'>
            <div className='flex items-center gap-4'>
              <div className='flex h-16 w-16 items-center justify-center rounded-full bg-brand-gold/20 text-2xl'>
                🎙️
              </div>
              <div>
                <h2 className='text-lg text-brand-gold'>{reciter.name_ar}</h2>
                <p className='text-sm arabic-muted'>{reciter.name_en}</p>
                {reciter.style && (
                  <p className='text-xs text-emerald-200'>الأسلوب: {reciter.style}</p>
                )}
              </div>
            </div>
            <Button href={`/quran?reciter=${reciter.id}`} className='w-full'>
              استماع للسور
            </Button>
          </Card>
        ))}
        {!reciters.length && (
          <Card className='md:col-span-2 lg:col-span-3'>
            لا يوجد قراء حالياً. يمكن للأدمن إضافتهم من لوحة التحكم.
          </Card>
        )}
      </section>
    </Container>
  );
}
