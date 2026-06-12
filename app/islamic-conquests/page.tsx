'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SectionHeader } from '@/components/ui/section-header';

const conquests = [
  {
    id: 1,
    name: 'فتح مكة',
    date: '8 هـ / 630 م',
    leader: 'النبي محمد صلى الله عليه وسلم',
    location: 'مكة المكرمة',
    significance: 'فتح البيت الحرام، تطهيره من الأصنام',
    image: '🕌',
  },
  {
    id: 2,
    name: 'فتح الشام',
    date: '13-40 هـ / 634-661 م',
    leader: 'خالد بن الوليد، أبو عبيدة الجراح',
    location: 'بلاد الشام',
    significance: 'فتح دمشق والقدس وحلب وغيرها',
    image: '⚔️',
  },
  {
    id: 3,
    name: 'فتح مصر',
    date: '21 هـ / 641 م',
    leader: 'عمرو بن العاص',
    location: 'مصر',
    significance: 'فتح الإسكندرية والقاهرة',
    image: '⚔️',
  },
  {
    id: 4,
    name: 'معركة القادسية',
    date: '15 هـ / 636 م',
    leader: 'سعد بن أبي وقاص',
    location: 'العراق',
    significance: 'انتصار حاسم على الفرس، فتح العراق',
    image: '⚔️',
  },
  {
    id: 5,
    name: 'معركة اليرموك',
    date: '13 هـ / 634 م',
    leader: 'خالد بن الوليد',
    location: 'بلاد الشام',
    significance: 'انتصار على البيزنطيين، فتح الشام',
    image: '⚔️',
  },
  {
    id: 6,
    name: 'فتح الأندلس',
    date: '92 هـ / 711 م',
    leader: 'طارق بن زياد',
    location: 'الأندلس (إسبانيا)',
    significance: 'فتح شبه الجزيرة الإيبيرية',
    image: '🏰',
  },
];

export default function IslamicConquestsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConquests = conquests.filter((conquest) => {
    return !searchQuery || conquest.name.includes(searchQuery) || conquest.location.includes(searchQuery);
  });

  return (
    <Container className="py-12 space-y-10">
      {/* Hero */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-brand-gold">الفتوحات الإسلامية</h1>
        <p className="max-w-2xl mx-auto text-lg leading-8 arabic-muted">
          تعرف على أعظم الفتوحات الإسلامية التي غيرت مسار التاريخ
        </p>
      </section>

      {/* Search Bar */}
      <section className="max-w-2xl mx-auto w-full">
        <div className="relative">
          <input
            type="text"
            placeholder="ابحث عن فتح أو موقع..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-4 rounded-xl border border-brand-gold/30 bg-black/20 text-brand-cream placeholder:text-brand-cream/40 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
          />
          <button className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold hover:text-brand-goldSoft">
            🔍
          </button>
        </div>
      </section>

      {/* Conquests Grid */}
      <section className="space-y-6">
        <SectionHeader title="الفتوحات الكبرى" />
        
        {filteredConquests.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredConquests.map((conquest) => (
              <Card key={conquest.id} className="overflow-hidden hover:border-brand-gold/50 transition-all group">
                <div className="h-40 bg-gradient-to-br from-brand-gold/20 to-brand-emerald/20 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform">
                  {conquest.image}
                </div>
                <div className="p-4 space-y-3">
                  <h3 className="font-semibold text-brand-cream text-lg">{conquest.name}</h3>
                  <div className="space-y-1 text-sm">
                    <p className="text-brand-gold/70">
                      <span className="font-semibold">التاريخ:</span> {conquest.date}
                    </p>
                    <p className="text-brand-gold/70">
                      <span className="font-semibold">القائد:</span> {conquest.leader}
                    </p>
                    <p className="text-brand-gold/70">
                      <span className="font-semibold">الموقع:</span> {conquest.location}
                    </p>
                  </div>
                  <p className="text-sm leading-6 arabic-muted">{conquest.significance}</p>
                  <Link href={`/islamic-conquests/${conquest.id}`}>
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
          {filteredConquests.map((conquest, idx) => (
            <Card key={conquest.id} className="p-4 flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold font-bold shrink-0">
                {idx + 1}
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="font-semibold text-brand-cream">{conquest.name}</h3>
                <p className="text-sm text-brand-gold/70">{conquest.date}</p>
                <p className="text-sm text-brand-cream/60">القائد: {conquest.leader}</p>
                <p className="text-sm leading-6 arabic-muted">{conquest.significance}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Information Section */}
      <Card className="space-y-4 p-6">
        <h2 className="text-2xl font-bold text-brand-gold">مراحل الفتوحات</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <h3 className="font-semibold text-brand-gold">الفتوحات الراشدية</h3>
            <p className="text-sm leading-6 arabic-muted">
              الفتوحات في عهد الخلفاء الراشدين (13-40 هـ)، حيث فتحت الشام والعراق ومصر وليبيا.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-brand-gold">الفتوحات الأموية</h3>
            <p className="text-sm leading-6 arabic-muted">
              الفتوحات في العصر الأموي (41-132 هـ)، حيث امتد الفتح إلى الأندلس والهند.
            </p>
          </div>
        </div>
      </Card>

      {/* Impact Section */}
      <Card className="space-y-4 p-6 bg-brand-gold/5">
        <h2 className="text-2xl font-bold text-brand-gold">تأثير الفتوحات</h2>
        <ul className="text-sm leading-7 arabic-muted space-y-2">
          <li>• <strong className="text-brand-gold">نشر الإسلام:</strong> انتشار الدين الإسلامي في أنحاء العالم</li>
          <li>• <strong className="text-brand-gold">الحضارة:</strong> ازدهار الحضارة الإسلامية والعلوم</li>
          <li>• <strong className="text-brand-gold">التجارة:</strong> ازدهار طرق التجارة والاقتصاد</li>
          <li>• <strong className="text-brand-gold">الثقافة:</strong> انتشار الثقافة والعلوم الإسلامية</li>
        </ul>
      </Card>

      {/* CTA */}
      <Card className="text-center py-8 space-y-4 bg-brand-gold/5">
        <h2 className="text-2xl text-brand-gold">اكتشف المزيد عن التاريخ الإسلامي</h2>
        <p className="arabic-muted max-w-xl mx-auto leading-7">
          اقرأ عن الغزوات والمعارك الإسلامية والدروس المستفادة منها
        </p>
        <Link href="/battles">
          <Button>الغزوات الإسلامية</Button>
        </Link>
      </Card>
    </Container>
  );
}
