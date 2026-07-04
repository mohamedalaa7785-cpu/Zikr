import { supabaseServerAnonRequest } from '@/lib/supabase/server';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Companion = {
  id: string;
  name_ar: string;
  name_en: string;
  title_ar: string | null;
  bio_ar: string | null;
  slug: string;
};

export default async function CompanionsPage() {
  let companions: Companion[] = [];
  try {
    const data = await supabaseServerAnonRequest<Companion[]>(
      '/rest/v1/companions?select=id,name_ar,name_en,title_ar,bio_ar,slug&published=eq.true&order=name_ar.asc'
    );
    companions = data || [];
  } catch {
    companions = [];
  }

  return (
    <Container className='space-y-8 py-10 text-right'>
      <section className='space-y-3'>
        <h1 className='text-3xl font-bold text-brand-gold'>الصحابة رضي الله عنهم</h1>
        <p className='max-w-3xl leading-8 arabic-muted'>
          سير أصحاب النبي محمد ﷺ، الذين حملوا الإسلام ونشروه في الآفاق.
        </p>
      </section>

      <section className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {companions.map((c) => (
          <Card key={c.id} className='space-y-3'>
            <div className='flex items-center gap-4'>
              <div className='flex h-16 w-16 items-center justify-center rounded-full bg-brand-gold/20 text-2xl'>
                ⭐
              </div>
              <div>
                <h2 className='text-lg text-brand-gold'>{c.name_ar}</h2>
                {c.title_ar && <p className='text-sm text-emerald-200'>{c.title_ar}</p>}
                <p className='text-xs arabic-muted'>{c.name_en}</p>
              </div>
            </div>
            {c.bio_ar && <p className='text-sm leading-7 arabic-muted line-clamp-3'>{c.bio_ar}</p>}
            <Button href={`/companions/${c.slug}`} variant='ghost' className='w-full'>
              قراءة السيرة
            </Button>
          </Card>
        ))}
        {!companions.length && (
          <Card className='md:col-span-2 lg:col-span-3'>لا يوجد صحابة حالياً.</Card>
        )}
      </section>
    </Container>
  );
}
