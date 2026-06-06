'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

interface ProphetSection {
  id: string;
  title_ar: string;
  title_en?: string;
  content_ar: string;
  content_en?: string;
  section_type?: string;
  order_num?: number;
}

interface Prophet {
  id: string;
  name_ar: string;
  name_en: string;
  bio_ar?: string;
  bio_en?: string;
  birth_place_ar?: string;
  death_place_ar?: string;
  featured_image_url?: string;
}

export default function ProphetDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [prophet, setProphet] = useState<Prophet | null>(null);
  const [sections, setSections] = useState<ProphetSection[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    const fetchProphet = async () => {
      try {
        setLoading(true);
        
        // Fetch prophet
        const prophetData = await supabase.request<Prophet[]>(
          `/rest/v1/prophets?select=*&slug=eq.${slug}&published=eq.true&limit=1`
        );

        if (prophetData && prophetData.length > 0) {
          const p = prophetData[0];
          setProphet(p);

          // Fetch sections
          const sectionsData = await supabase.request<ProphetSection[]>(
            `/rest/v1/prophet_sections?select=*&prophet_id=eq.${p.id}&order=order_num.asc`
          );

          setSections(sectionsData || []);
        }
      } catch (error) {
        console.error('Error fetching prophet:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProphet();
    }
  }, [slug]);

  if (loading) {
    return (
      <Container className="py-12">
        <p className="text-center text-brand-cream/70">جاري التحميل...</p>
      </Container>
    );
  }

  if (!prophet) {
    return (
      <Container className="py-12">
        <p className="text-center text-brand-cream/70">لم يتم العثور على النبي</p>
      </Container>
    );
  }

  return (
    <Container className="py-12 space-y-8 max-w-4xl">
      {prophet.featured_image_url && (
        <div className="w-full h-96 rounded-lg overflow-hidden">
          <img
            src={prophet.featured_image_url}
            alt={prophet.name_ar}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold text-brand-gold">{prophet.name_ar}</h1>
        {prophet.name_en && (
          <p className="text-xl text-brand-cream/70">{prophet.name_en}</p>
        )}
      </div>

      {/* Prophet Info */}
      <Card className="p-8 space-y-6 bg-black/30 border-brand-gold/30">
        {prophet.bio_ar && (
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-brand-gold">النبذة</h2>
            <p className="text-lg text-brand-cream/90 leading-relaxed" dir="rtl">
              {prophet.bio_ar}
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-brand-gold/20">
          {prophet.birth_place_ar && (
            <div className="space-y-2">
              <h3 className="font-bold text-brand-gold">مكان الميلاد</h3>
              <p className="text-brand-cream/80">{prophet.birth_place_ar}</p>
            </div>
          )}
          {prophet.death_place_ar && (
            <div className="space-y-2">
              <h3 className="font-bold text-brand-gold">مكان الوفاة</h3>
              <p className="text-brand-cream/80">{prophet.death_place_ar}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Sections */}
      {sections.length > 0 && (
        <div className="space-y-6">
          {sections.map((section, idx) => (
            <Card key={section.id} className="p-8 space-y-4 bg-black/30 border-brand-gold/30">
              <h2 className="text-2xl font-bold text-brand-gold">{section.title_ar}</h2>
              <div
                className="prose prose-invert max-w-none text-brand-cream leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{
                  __html: section.content_ar.replace(/\n/g, '<br/>'),
                }}
              />
            </Card>
          ))}
        </div>
      )}

      {/* Islamic Message */}
      <Card className="p-6 text-center space-y-3 bg-brand-gold/10">
        <h3 className="text-xl font-bold text-brand-gold">🕌 الأنبياء والرسل</h3>
        <p className="text-brand-cream/90 font-arabic text-lg leading-relaxed">
          قال تعالى: &quot;وَإِذْ أَخَذْنَا مِنَ النَّبِيِّينَ مِيثَاقَهُمْ وَمِنكَ وَمِن نُّوحٍ وَإِبْرَاهِيمَ وَمُوسَىٰ وَعِيسَىٰ ابْنِ مَرْيَمَ&quot;
        </p>
      </Card>
    </Container>
  );
}
