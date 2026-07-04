'use client';

import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SectionHeader } from '@/components/ui/section-header';
import { useState } from 'react';

export default function RecitersPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const reciters = [
    { name: 'عبد الرحمن السديس', country: 'السعودية', type: 'تجويد' },
    { name: 'محمود خليل الحصري', country: 'مصر', type: 'مرتل' },
    { name: 'عبد الباسط عبد الصمد', country: 'مصر', type: 'معلم' },
    { name: 'محمد صديق المنشاوي', country: 'مصر', type: 'مرتل' },
    { name: 'سعد الغامدي', country: 'السعودية', type: 'تجويد' },
    { name: 'أحمد العجمي', country: 'الكويت', type: 'تجويد' },
    { name: 'إبراهيم الأخضر', country: 'ليبيا', type: 'تجويد' },
    { name: 'يوسف القرضاوي', country: 'قطر', type: 'تعليمي' },
  ];

  const filtered = reciters.filter(r =>
    r.name.includes(searchQuery) || r.country.includes(searchQuery)
  );

  return (
    <Container className="py-12 space-y-10">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-brand-gold">القراء الكرام</h1>
        <p className="max-w-2xl mx-auto text-lg leading-8 arabic-muted">
          استمع لأشهر القراء والمقرئين المعروفين بجودة قراءتهم للقرآن الكريم
        </p>
      </section>

      <section className="flex gap-2">
        <Input
          type="text"
          placeholder="ابحث عن قارئ..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button variant="primary">بحث</Button>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((reciter, idx) => (
          <Card key={idx} className="p-6 space-y-4 text-center hover:border-brand-gold/50 cursor-pointer transition-all">
            <div className="text-5xl">🎤</div>
            <div>
              <h3 className="text-lg font-bold text-brand-gold">{reciter.name}</h3>
              <p className="text-sm text-brand-cream/60">{reciter.country}</p>
              <span className="inline-block text-xs bg-brand-gold/10 text-brand-gold px-2 py-1 rounded mt-2">
                {reciter.type}
              </span>
            </div>
            <Button href={`/reciters/${reciter.name.toLowerCase().replace(/\s+/g, '-')}`} variant="secondary" className="w-full">
              استمع
            </Button>
          </Card>
        ))}
      </section>
    </Container>
  );
}
