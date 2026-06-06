'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

interface KidsContent {
  id: string;
  title_ar: string;
  slug: string;
  type: 'story' | 'prayer' | 'wudu' | 'quiz' | 'game' | 'video';
  age_group: '3-5' | '6-8' | '9-12' | '13-15';
  featured_image_url?: string;
}

const typeLabels: Record<string, string> = {
  story: '📖 قصة',
  prayer: '🤲 دعاء',
  wudu: '💧 الوضوء',
  quiz: '❓ اختبار',
  game: '🎮 لعبة',
  video: '🎬 فيديو',
};

const ageGroupLabels: Record<string, string> = {
  '3-5': '3-5 سنوات',
  '6-8': '6-8 سنوات',
  '9-12': '9-12 سنة',
  '13-15': '13-15 سنة',
};

export default function KidsPage() {
  const [content, setContent] = useState<KidsContent[]>([]);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        
        let query = '/rest/v1/kids_content?select=*&published=eq.true&order=created_at.desc';

        if (selectedAgeGroup) {
          query += `&age_group=eq.${selectedAgeGroup}`;
        }

        if (selectedType) {
          query += `&type=eq.${selectedType}`;
        }

        const data = await supabase.request<KidsContent[]>(query);
        setContent(data || []);
      } catch (error) {
        console.error('Error fetching kids content:', error);
        setContent([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [selectedAgeGroup, selectedType]);

  return (
    <Container className="py-12 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-brand-gold">🌟 قسم الأطفال</h1>
        <p className="text-brand-cream/70 max-w-2xl mx-auto">
          محتوى تعليمي وترفيهي آمن ومناسب للأطفال
        </p>
      </div>

      {/* Age Group Filter */}
      <div className="space-y-3">
        <h3 className="text-center text-brand-gold font-bold">اختر فئة العمر:</h3>
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            variant={selectedAgeGroup === null ? 'primary' : 'outline'}
            onClick={() => setSelectedAgeGroup(null)}
          >
            الكل
          </Button>
          {Object.entries(ageGroupLabels).map(([key, label]) => (
            <Button
              key={key}
              variant={selectedAgeGroup === key ? 'primary' : 'outline'}
              onClick={() => setSelectedAgeGroup(key)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Type Filter */}
      <div className="space-y-3">
        <h3 className="text-center text-brand-gold font-bold">نوع المحتوى:</h3>
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            variant={selectedType === null ? 'primary' : 'outline'}
            onClick={() => setSelectedType(null)}
          >
            الكل
          </Button>
          {Object.entries(typeLabels).map(([key, label]) => (
            <Button
              key={key}
              variant={selectedType === key ? 'primary' : 'outline'}
              onClick={() => setSelectedType(key)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-brand-cream/70">جاري التحميل...</p>
        </div>
      ) : content.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-brand-cream/70">لا يوجد محتوى متاح حالياً</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {content.map((item) => (
            <Link key={item.id} href={`/kids/${item.slug}`}>
              <Card className="h-full overflow-hidden hover:border-brand-gold/50 transition-colors cursor-pointer flex flex-col">
                {item.featured_image_url && (
                  <div className="w-full h-40 bg-brand-gold/10 overflow-hidden">
                    <img
                      src={item.featured_image_url}
                      alt={item.title_ar}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                )}
                <div className="p-4 space-y-3 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-brand-gold">{item.title_ar}</h3>
                  <div className="flex gap-2 flex-wrap">
                    <span className="px-2 py-1 bg-brand-gold/20 text-brand-gold rounded text-xs">
                      {typeLabels[item.type]}
                    </span>
                    <span className="px-2 py-1 bg-brand-emerald/20 text-brand-emerald rounded text-xs">
                      {ageGroupLabels[item.age_group]}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Safety Message */}
      <Card className="p-6 text-center space-y-3 bg-brand-gold/10">
        <h3 className="text-xl font-bold text-brand-gold">🛡️ محتوى آمن</h3>
        <p className="text-brand-cream/90">
          جميع محتويات قسم الأطفال تم اختيارها بعناية لتكون آمنة وتعليمية ومناسبة لأعمارهم
        </p>
      </Card>
    </Container>
  );
}
