import { notFound } from 'next/navigation';
import { supabaseServerAnonRequest } from '@/lib/supabase/server';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Conquest = {
  id: string;
  name_ar: string;
  name_en?: string;
  description_ar: string | null;
  description_en?: string | null;
  date_hijri: string | null;
  date_gregorian: string | null;
  location_ar: string | null;
  location_en?: string | null;
  leader_ar: string | null;
  leader_en?: string | null;
  published: boolean;
};

export default async function ConquestDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let conquest: Conquest | null = null;

  try {
    const data = await supabaseServerAnonRequest<Conquest[]>(
      `/rest/v1/conquests?select=*&slug=eq.${slug}&published=eq.true`
    );
    conquest = data && data.length > 0 ? data[0] : null;
  } catch {
    conquest = null;
  }

  if (!conquest) notFound();

  return (
    <Container className="space-y-8 py-10 text-right">
      <Button href="/conquests" variant="ghost">
        ← العودة إلى الفتوحات
      </Button>

      <Card className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-brand-gold/10 pb-6">
          <div className="text-4xl">🏰</div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-brand-gold">{conquest.name_ar}</h1>
            {conquest.name_en && <p className="text-sm text-muted-foreground">{conquest.name_en}</p>}
          </div>
        </div>

        {/* Description */}
        {conquest.description_ar && (
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-brand-gold">نبذة عن الفتح</h2>
            <p className="leading-8 text-foreground whitespace-pre-wrap">{conquest.description_ar}</p>
            {conquest.description_en && (
              <p className="leading-8 text-muted-foreground mt-4">{conquest.description_en}</p>
            )}
          </div>
        )}

        {/* Conquest Info Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {conquest.date_hijri && (
            <div className="rounded-lg border border-brand-gold/20 bg-brand-gold/5 p-4">
              <p className="text-xs font-semibold text-brand-gold uppercase">التاريخ الهجري</p>
              <p className="mt-2 text-lg font-semibold text-foreground">{conquest.date_hijri}</p>
            </div>
          )}

          {conquest.date_gregorian && (
            <div className="rounded-lg border border-brand-gold/20 bg-brand-gold/5 p-4">
              <p className="text-xs font-semibold text-brand-gold uppercase">التاريخ الميلادي</p>
              <p className="mt-2 text-lg font-semibold text-foreground">{conquest.date_gregorian}</p>
            </div>
          )}

          {conquest.leader_ar && (
            <div className="rounded-lg border border-brand-gold/20 bg-brand-gold/5 p-4 sm:col-span-2">
              <p className="text-xs font-semibold text-brand-gold uppercase">القائد</p>
              <p className="mt-2 text-lg font-semibold text-foreground">{conquest.leader_ar}</p>
              {conquest.leader_en && (
                <p className="mt-1 text-sm text-muted-foreground">{conquest.leader_en}</p>
              )}
            </div>
          )}

          {conquest.location_ar && (
            <div className="rounded-lg border border-brand-gold/20 bg-brand-gold/5 p-4 sm:col-span-2">
              <p className="text-xs font-semibold text-brand-gold uppercase">مكان الفتح</p>
              <p className="mt-2 text-lg font-semibold text-foreground">{conquest.location_ar}</p>
              {conquest.location_en && (
                <p className="mt-1 text-sm text-muted-foreground">{conquest.location_en}</p>
              )}
            </div>
          )}
        </div>
      </Card>
    </Container>
  );
}
