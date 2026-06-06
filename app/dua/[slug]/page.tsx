'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

interface Dua {
  id: string;
  title_ar: string;
  title_en: string;
  text_ar: string;
  text_en?: string;
  occasion_ar?: string;
  occasion_en?: string;
  source_ar?: string;
  source_en?: string;
  benefits_ar?: string;
  benefits_en?: string;
}

export default function DuaDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [dua, setDua] = useState<Dua | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    const fetchDua = async () => {
      try {
        setLoading(true);
        const data = await supabase.request<Dua[]>(
          `/rest/v1/duas?select=*&slug=eq.${slug}&published=eq.true&limit=1`
        );

        if (data && data.length > 0) {
          setDua(data[0]);
        }
      } catch (error) {
        console.error('Error fetching dua:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchDua();
    }
  }, [slug]);

  const copyToClipboard = () => {
    if (dua) {
      navigator.clipboard.writeText(dua.text_ar);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <Container className="py-12">
        <p className="text-center text-brand-cream/70">جاري التحميل...</p>
      </Container>
    );
  }

  if (!dua) {
    return (
      <Container className="py-12">
        <p className="text-center text-brand-cream/70">لم يتم العثور على الدعاء</p>
      </Container>
    );
  }

  return (
    <Container className="py-12 space-y-8 max-w-2xl">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-brand-gold">{dua.title_ar}</h1>
        {dua.title_en && (
          <p className="text-brand-cream/70">{dua.title_en}</p>
        )}
      </div>

      <Card className="p-8 space-y-6 bg-black/30 border-brand-gold/30">
        <div className="space-y-4">
          <p className="text-2xl font-arabic leading-relaxed text-brand-cream text-center" dir="rtl">
            {dua.text_ar}
          </p>
          {dua.text_en && (
            <p className="text-lg text-brand-cream/80 leading-relaxed text-center">
              {dua.text_en}
            </p>
          )}
        </div>

        <div className="flex justify-center">
          <Button
            onClick={copyToClipboard}
            variant={copied ? 'primary' : 'outline'}
          >
            {copied ? '✓ تم النسخ' : 'نسخ الدعاء'}
          </Button>
        </div>
      </Card>

      {/* Details */}
      <div className="space-y-4">
        {dua.occasion_ar && (
          <Card className="p-4 space-y-2 border-brand-gold/20">
            <h3 className="text-lg font-bold text-brand-gold">المناسبة</h3>
            <p className="text-brand-cream/90">{dua.occasion_ar}</p>
          </Card>
        )}

        {dua.source_ar && (
          <Card className="p-4 space-y-2 border-brand-gold/20">
            <h3 className="text-lg font-bold text-brand-gold">المصدر</h3>
            <p className="text-brand-cream/90">{dua.source_ar}</p>
          </Card>
        )}

        {dua.benefits_ar && (
          <Card className="p-4 space-y-2 border-brand-gold/20">
            <h3 className="text-lg font-bold text-brand-gold">الفوائد</h3>
            <p className="text-brand-cream/90">{dua.benefits_ar}</p>
          </Card>
        )}
      </div>

      <Card className="p-6 text-center space-y-3 bg-brand-gold/10">
        <h3 className="text-xl font-bold text-brand-gold">فضل الدعاء</h3>
        <p className="text-brand-cream/90 font-arabic text-lg leading-relaxed">
          قال رسول الله ﷺ: &quot;الدعاء هو العبادة&quot;
        </p>
      </Card>
    </Container>
  );
}
