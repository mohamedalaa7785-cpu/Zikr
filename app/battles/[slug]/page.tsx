export const dynamic = 'force-dynamic';
import { notFound } from 'next/navigation';
import { supabaseServerAnonRequest } from '@/lib/supabase/server';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Battle = {
  id: string;
  name_ar: string;
  name_en?: string;
  description_ar: string | null;
  description_en?: string | null;
  date_hijri: string | null;
  date_gregorian: string | null;
  location_ar: string | null;
  location_en?: string | null;
  published: boolean;
};

export default async function BattleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let battle: Battle | null = null;

  try {
    const data = await supabaseServerAnonRequest<Battle[]>(
      `/rest/v1/battles?select=*&slug=eq.${slug}&published=eq.true`
    );
    battle = data && data.length > 0 ? data[0] : null;
  } catch {
    battle = null;
  }

  if (!battle) notFound();

  return (
    <Container className="space-y-8 py-10 text-right">
      <Button href="/battles" variant="ghost">
        ← العودة إلى الغزوات
      </Button>

      <Card className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-brand-gold/10 pb-6">
          <div className="text-4xl">⚔️</div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-brand-gold">{battle.name_ar}</h1>
            {battle.name_en && <p className="text-sm text-muted-foreground">{battle.name_en}</p>}
          </div>
        </div>

        {/* Description */}
        {battle.description_ar && (
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-brand-gold">نبذة عن الغزوة</h2>
            <p className="leading-8 text-foreground whitespace-pre-wrap">{battle.description_ar}</p>
            {battle.description_en && (
              <p className="leading-8 text-muted-foreground mt-4">{battle.description_en}</p>
            )}
          </div>
        )}

        {/* Battle Info Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {battle.date_hijri && (
            <div className="rounded-lg border border-brand-gold/20 bg-brand-gold/5 p-4">
              <p className="text-xs font-semibold text-brand-gold uppercase">التاريخ الهجري</p>
              <p className="mt-2 text-lg font-semibold text-foreground">{battle.date_hijri}</p>
            </div>
          )}

          {battle.date_gregorian && (
            <div className="rounded-lg border border-brand-gold/20 bg-brand-gold/5 p-4">
              <p className="text-xs font-semibold text-brand-gold uppercase">التاريخ الميلادي</p>
              <p className="mt-2 text-lg font-semibold text-foreground">{battle.date_gregorian}</p>
            </div>
          )}

          {battle.location_ar && (
            <div className="rounded-lg border border-brand-gold/20 bg-brand-gold/5 p-4 sm:col-span-2">
              <p className="text-xs font-semibold text-brand-gold uppercase">مكان المعركة</p>
              <p className="mt-2 text-lg font-semibold text-foreground">{battle.location_ar}</p>
              {battle.location_en && (
                <p className="mt-1 text-sm text-muted-foreground">{battle.location_en}</p>
              )}
            </div>
          )}
        </div>
      </Card>
    </Container>
  );
}
