'use client';

import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SectionHeader } from '@/components/ui/section-header';
import { useState } from 'react';

export default function TawasheehPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const tawasheeh = [
    { title: 'تواشيح دينية', artist: 'فنانون متعددون', category: 'ديني' },
    { title: 'أنشودة المولد', artist: 'عبد الله القصار', category: 'مولد' },
    { title: 'تواشيح رمضانية', artist: 'فرقة التواشيح الدينية', category: 'رمضاني' },
    { title: 'مدائح الرسول', artist: 'مجموعة فنانين', category: 'مديح' },
  ];

  const filtered = tawasheeh.filter(t =>
    t.title.includes(searchQuery) || t.artist.includes(searchQuery)
  );

  return (
    <Container className="py-12 space-y-10">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-brand-gold">التواشيح الدينية</h1>
        <p className="max-w-2xl mx-auto text-lg leading-8 arabic-muted">
          استمع لأجمل التواشيح والأناشيد الدينية الإسلامية
        </p>
      </section>

      <section className="flex gap-2">
        <Input
          type="text"
          placeholder="ابحث عن تشيح..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button variant="primary">بحث</Button>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {filtered.map((item, idx) => (
          <Card key={idx} className="p-6 space-y-3">
            <div className="text-4xl text-center">🎵</div>
            <h3 className="text-lg font-bold text-brand-gold">{item.title}</h3>
            <p className="text-sm text-brand-cream/60">{item.artist}</p>
            <span className="inline-block text-xs bg-brand-gold/10 text-brand-gold px-2 py-1 rounded">
              {item.category}
            </span>
            <Button variant="secondary" className="w-full">
              استمع
            </Button>
          </Card>
        ))}
      </section>
    </Container>
  );
}
