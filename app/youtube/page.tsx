'use client';

import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/ui/section-header';

export default function YoutubePage() {
  return (
    <Container className="py-12 space-y-10">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-brand-gold">قناتنا على يوتيوب</h1>
        <p className="max-w-2xl mx-auto text-lg leading-8 arabic-muted">
          اشترك في قناتنا على يوتيوب للحصول على أحدث المحتوى الإسلامي
        </p>
      </section>

      <Card className="p-8 text-center space-y-6">
        <div className="text-6xl">📺</div>
        <h2 className="text-2xl font-bold text-brand-cream">اشترك الآن</h2>
        <p className="text-brand-cream/60 max-w-2xl mx-auto">
          تابع قناتنا على يوتيوب للحصول على الفيديوهات التعليمية والإسلامية الجديدة كل أسبوع
        </p>
        <Button 
          href="https://www.youtube.com/zikr" 
          variant="primary" 
          target="_blank"
          rel="noopener noreferrer"
        >
          الذهاب للقناة
        </Button>
      </Card>

      <section className="space-y-6">
        <SectionHeader title="أحدث الفيديوهات" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="space-y-3">
              <div className="bg-brand-gold/10 h-40 flex items-center justify-center text-4xl">
                🎥
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold text-brand-cream">الفيديو رقم {i}</h3>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </Container>
  );
}
