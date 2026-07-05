export const dynamic = 'force-dynamic';
import { supabaseServerAnonRequest } from '@/lib/supabase/server';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';

type Battle = {
  id: string;
  name_ar: string;
  hijri_year: string | null;
  location_ar: string | null;
  commander_ar: string | null;
  army_size: string | null;
  result_ar: string | null;
  description_ar: string | null;
};

export default async function BattlesPage() {
  let battles: Battle[] = [];
  try {
    const data = await supabaseServerAnonRequest<Battle[]>(
      '/rest/v1/battles?select=id,name_ar,hijri_year,location_ar,commander_ar,army_size,result_ar,description_ar&published=eq.true&order=hijri_year.asc'
    );
    battles = data || [];
  } catch {
    battles = [];
  }

  return (
    <Container className='space-y-8 py-10 text-right'>
      <section className='space-y-3'>
        <h1 className='text-3xl font-bold text-brand-gold'>الغزوات</h1>
        <p className='max-w-3xl leading-8 arabic-muted'>
          غزوات النبي محمد ﷺ والمعارك الكبرى في صدر الإسلام.
        </p>
      </section>

      <section className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {battles.map((b) => (
          <Card key={b.id} className='space-y-3'>
            <div className='flex items-center gap-3'>
              <div className='text-3xl'>⚔️</div>
              <div>
                <h2 className='text-lg text-brand-gold'>{b.name_ar}</h2>
                {b.hijri_year && <p className='text-xs text-emerald-200'>{b.hijri_year}</p>}
              </div>
            </div>
            {b.location_ar && <p className='text-sm arabic-muted'>المكان: {b.location_ar}</p>}
            {b.commander_ar && <p className='text-sm arabic-muted'>القائد: {b.commander_ar}</p>}
            {b.army_size && <p className='text-sm arabic-muted'>الجيش: {b.army_size}</p>}
            {b.result_ar && <p className='text-sm text-brand-gold'>النتيجة: {b.result_ar}</p>}
            {b.description_ar && <p className='text-sm leading-7 arabic-muted line-clamp-3'>{b.description_ar}</p>}
          </Card>
        ))}
        {!battles.length && (
          <Card className='md:col-span-2 lg:col-span-3'>لا توجد غزوات حالياً.</Card>
        )}
      </section>
    </Container>
  );
}
