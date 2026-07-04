import { supabaseServerAnonRequest } from '@/lib/supabase/server';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';

type Conquest = {
  id: string;
  name_ar: string;
  hijri_year: string | null;
  commander_ar: string | null;
  region_ar: string | null;
  description_ar: string | null;
  result_ar: string | null;
};

export default async function ConquestsPage() {
  let conquests: Conquest[] = [];
  try {
    const data = await supabaseServerAnonRequest<Conquest[]>(
      '/rest/v1/conquests?select=id,name_ar,hijri_year,commander_ar,region_ar,description_ar,result_ar&published=eq.true&order=hijri_year.asc'
    );
    conquests = data || [];
  } catch {
    conquests = [];
  }

  return (
    <Container className='space-y-8 py-10 text-right'>
      <section className='space-y-3'>
        <h1 className='text-3xl font-bold text-brand-gold'>الفتوحات</h1>
        <p className='max-w-3xl leading-8 arabic-muted'>
          الفتوحات الإسلامية التي نشرت الإسلام في العالم.
        </p>
      </section>

      <section className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {conquests.map((c) => (
          <Card key={c.id} className='space-y-3'>
            <div className='flex items-center gap-3'>
              <div className='text-3xl'>🏰</div>
              <div>
                <h2 className='text-lg text-brand-gold'>{c.name_ar}</h2>
                {c.hijri_year && <p className='text-xs text-emerald-200'>{c.hijri_year}</p>}
              </div>
            </div>
            {c.commander_ar && <p className='text-sm arabic-muted'>القائد: {c.commander_ar}</p>}
            {c.region_ar && <p className='text-sm arabic-muted'>المنطقة: {c.region_ar}</p>}
            {c.description_ar && <p className='text-sm leading-7 arabic-muted line-clamp-3'>{c.description_ar}</p>}
            {c.result_ar && <p className='text-sm text-brand-gold'>النتيجة: {c.result_ar}</p>}
          </Card>
        ))}
        {!conquests.length && (
          <Card className='md:col-span-2 lg:col-span-3'>لا توجد فتوحات حالياً.</Card>
        )}
      </section>
    </Container>
  );
}
