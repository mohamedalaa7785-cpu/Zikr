export const dynamic = 'force-dynamic';
import { supabaseServerAnonRequest } from '@/lib/supabase/server';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Swords } from 'lucide-react';
import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata({
  title: 'الغزوات',
  description: 'تعرف على غزوات الرسول صلى الله عليه وسلم: بدر وأحد والخندق وغيرها بالتفاصيل والتواريخ والمواقع.',
  path: '/battles',
});

type Battle = {
  id: string;
  name_ar: string;
  name_en?: string;
  date_hijri: string | null;
  date_gregorian: string | null;
  location_ar: string | null;
  location_en?: string | null;
  description_ar: string | null;
  description_en?: string | null;
  thumbnail_url: string | null;
  featured_image_url: string | null;
};

export default async function BattlesPage() {
  let battles: Battle[] = [];
  try {
    const data = await supabaseServerAnonRequest<Battle[]>(
      '/rest/v1/battles?select=id,name_ar,name_en,date_hijri,date_gregorian,location_ar,location_en,description_ar,description_en,thumbnail_url,featured_image_url&published=eq.true&order=order_num.asc'
    );
    battles = data || [];
  } catch (error) {
    console.error('Failed to fetch battles:', error);
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
              <Swords className='h-6 w-6 text-brand-gold/70 shrink-0' />
              <div>
                <h2 className='text-lg text-brand-gold'>{b.name_ar}</h2>
                {b.date_hijri && <p className='text-xs text-emerald-200'>{b.date_hijri}</p>}
              </div>
            </div>
            {b.location_ar && <p className='text-sm arabic-muted'>المكان: {b.location_ar}</p>}
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
