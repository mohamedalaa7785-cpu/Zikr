export const dynamic = 'force-dynamic';
import { notFound } from 'next/navigation';
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
  birth_place_ar: string | null;
  death_place_ar: string | null;
  death_year: string | null;
};

export default async function CompanionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let companion: Companion | null = null;
  try {
    const data = await supabaseServerAnonRequest<Companion[]>(
      `/rest/v1/companions?select=id,name_ar,name_en,title_ar,bio_ar,birth_place_ar,death_place_ar,death_year&slug=eq.${slug}&published=eq.true`
    );
    companion = data && data.length > 0 ? data[0] : null;
  } catch {
    companion = null;
  }

  if (!companion) notFound();

  return (
    <Container className='space-y-8 py-10 text-right'>
      <Button href='/companions' variant='ghost'>← العودة للصحابة</Button>

      <Card className='space-y-4'>
        <div className='flex items-center gap-4'>
          <div className='flex h-20 w-20 items-center justify-center rounded-full bg-brand-gold/20 text-3xl'>
            ⭐
          </div>
          <div>
            <h1 className='text-2xl font-bold text-brand-gold'>{companion.name_ar}</h1>
            {companion.title_ar && <p className='text-emerald-200'>{companion.title_ar}</p>}
            <p className='text-sm arabic-muted'>{companion.name_en}</p>
          </div>
        </div>

        {companion.bio_ar && (
          <div className='space-y-2'>
            <h2 className='text-lg text-brand-gold'>السيرة</h2>
            <p className='leading-8 arabic-muted'>{companion.bio_ar}</p>
          </div>
        )}

        <div className='grid gap-3 sm:grid-cols-2'>
          {companion.birth_place_ar && (
            <div className='rounded-lg border border-brand-gold/10 p-3'>
              <p className='text-xs arabic-muted'>مكان الميلاد</p>
              <p className='text-sm'>{companion.birth_place_ar}</p>
            </div>
          )}
          {companion.death_place_ar && (
            <div className='rounded-lg border border-brand-gold/10 p-3'>
              <p className='text-xs arabic-muted'>مكان الوفاة</p>
              <p className='text-sm'>{companion.death_place_ar}</p>
            </div>
          )}
          {companion.death_year && (
            <div className='rounded-lg border border-brand-gold/10 p-3'>
              <p className='text-xs arabic-muted'>سنة الوفاة</p>
              <p className='text-sm'>{companion.death_year}</p>
            </div>
          )}
        </div>
      </Card>
    </Container>
  );
}
