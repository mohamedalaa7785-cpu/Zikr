'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SectionHeader } from '@/components/ui/section-header';

const battles = [
  {
    id: 1,
    name: 'غزوة بدر',
    date: '2 هـ / 623 م',
    location: 'بدر',
    significance: 'أول معركة إسلامية، انتصار حاسم ضد المشركين',
    image: '⚔️',
  },
  {
    id: 2,
    name: 'غزوة أحد',
    date: '3 هـ / 625 م',
    location: 'أحد',
    significance: 'اختبار الصبر والثبات، استشهاد الكثير من الصحابة',
    image: '⚔️',
  },
  {
    id: 3,
    name: 'غزوة الخندق',
    date: '5 هـ / 627 م',
    location: 'المدينة',
    significance: 'حصار المدينة، نصر بدون قتال مباشر',
    image: '⚔️',
  },
  {
    id: 4,
    name: 'فتح خيبر',
    date: '7 هـ / 628 م',
    location: 'خيبر',
    significance: 'فتح معقل اليهود، نهاية تهديدهم للمدينة',
    image: '⚔️',
  },
  {
    id: 5,
    name: 'غزوة حنين',
    date: '8 هـ / 630 م',
    location: 'حنين',
    significance: 'فتح مكة، انتصار على قبائل ثقيف وهوازن',
    image: '⚔️',
  },
  {
    id: 6,
    name: 'معركة مؤتة',
    date: '8 هـ / 629 م',
    location: 'مؤتة',
    significance: 'أول معركة خارج الجزيرة، استشهاد القادة الثلاثة',
    image: '⚔️',
  },
];

export default function BattlesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBattles = battles.filter((battle) => {
    return !searchQuery || battle.name.includes(searchQuery) || battle.location.includes(searchQuery);
  });

  return (
    <Container className="py-12 space-y-10">
      {/* Hero */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-brand-gold">الغزوات الإسلامية</h1>
        <p className="max-w-2xl mx-auto text-lg leading-8 arabic-muted">
          تعرف على أهم الغزوات والمعارك الإسلامية في عهد النبي صلى الله عليه وسلم
        </p>
      </section>

      {/* Search Bar */}
      <section className="max-w-2xl mx-auto w-full">
        <div className="relative">
          <input
            type="text"
            placeholder="ابحث عن غزوة أو معركة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-4 rounded-xl border border-brand-gold/30 bg-black/20 text-brand-cream placeholder:text-brand-cream/40 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
          />
          <button className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold hover:text-brand-goldSoft">
            🔍
          </button>
        </div>
      </section>

      {/* Battles Grid */}
      <section className="space-y-6">
        <SectionHeader title="الغزوات والمعارك" />
        
        {filteredBattles.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredBattles.map((battle) => (
              <Card key={battle.id} className="overflow-hidden hover:border-brand-gold/50 transition-all group">
                <div className="h-40 bg-gradient-to-br from-brand-gold/20 to-brand-emerald/20 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform">
                  {battle.image}
                </div>
                <div className="p-4 space-y-3">
                  <h3 className="font-semibold text-brand-cream text-lg">{battle.name}</h3>
                  <div className="space-y-1 text-sm">
                    <p className="text-brand-gold/70">
                      <span className="font-semibold">التاريخ:</span> {battle.date}
                    </p>
                    <p className="text-brand-gold/70">
                      <span className="font-semibold">الموقع:</span> {battle.location}
                    </p>
                  </div>
                  <p className="text-sm leading-6 arabic-muted">{battle.significance}</p>
                  <Link href={`/battles/${battle.id}`}>
                    <Button size="sm" className="w-full">اقرأ المزيد</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center p-8">
            <p className="text-brand-cream/60">لم يتم العثور على نتائج</p>
          </Card>
        )}
      </section>

      {/* Timeline Section */}
      <section className="space-y-6">
        <SectionHeader title="الترتيب الزمني" />
        
        <div className="space-y-4">
          {filteredBattles.map((battle, idx) => (
            <Card key={battle.id} className="p-4 flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold font-bold shrink-0">
                {idx + 1}
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="font-semibold text-brand-cream">{battle.name}</h3>
                <p className="text-sm text-brand-gold/70">{battle.date}</p>
                <p className="text-sm leading-6 arabic-muted">{battle.significance}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Information Section */}
      <Card className="space-y-4 p-6">
        <h2 className="text-2xl font-bold text-brand-gold">أهمية الغزوات</h2>
        <ul className="text-sm leading-7 arabic-muted space-y-2">
          <li>• <strong className="text-brand-gold">نشر الدعوة:</strong> الغزوات كانت وسيلة لنشر الدعوة الإسلامية</li>
          <li>• <strong className="text-brand-gold">الدفاع:</strong> الدفاع عن المسلمين والدولة الإسلامية</li>
          <li>• <strong className="text-brand-gold">الدروس:</strong> استخراج الدروس والعبر من التاريخ</li>
          <li>• <strong className="text-brand-gold">التضحية:</strong> تضحيات الصحابة وشهاداتهم</li>
        </ul>
      </Card>

      {/* CTA */}
      <Card className="text-center py-8 space-y-4 bg-brand-gold/5">
        <h2 className="text-2xl text-brand-gold">تعرف على الفتوحات الإسلامية</h2>
        <p className="arabic-muted max-w-xl mx-auto leading-7">
          اقرأ عن الفتوحات الإسلامية الكبرى بعد عهد النبي صلى الله عليه وسلم
        </p>
        <Link href="/islamic-conquests">
          <Button>الفتوحات الإسلامية</Button>
        </Link>
      </Card>
    </Container>
  );
}
