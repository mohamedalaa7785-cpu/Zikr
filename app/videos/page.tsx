'use client';

import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/ui/section-header';

export default function VideosPage() {
  const videos = [
    { title: 'تعليم الوضوء', category: 'تعليمي', duration: '5:30' },
    { title: 'شرح سورة الفاتحة', category: 'قرآني', duration: '12:45' },
    { title: 'قصة النبي محمد', category: 'سيرة', duration: '18:20' },
    { title: 'أحكام الصلاة', category: 'فقه', duration: '15:00' },
  ];

  return (
    <Container className="py-12 space-y-10">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-brand-gold">الفيديوهات</h1>
        <p className="max-w-2xl mx-auto text-lg leading-8 arabic-muted">
          شاهد أفضل الفيديوهات التعليمية الإسلامية
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {videos.map((video, idx) => (
          <Card key={idx} className="space-y-4 overflow-hidden hover:border-brand-gold/50 cursor-pointer">
            <div className="bg-brand-gold/10 h-40 flex items-center justify-center text-5xl">
              📹
            </div>
            <div className="p-4 space-y-3">
              <h3 className="text-lg font-bold text-brand-gold">{video.title}</h3>
              <div className="flex justify-between text-sm">
                <span className="text-brand-cream/60">{video.category}</span>
                <span className="text-brand-gold">{video.duration}</span>
              </div>
              <Button variant="secondary" className="w-full">
                شاهد الآن
              </Button>
            </div>
          </Card>
        ))}
      </section>
    </Container>
  );
}
