'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SectionHeader } from '@/components/ui/section-header';
import { getSurahIdFromName } from '@/lib/utils/surah-mapping';

const tafsirBooks = [
  {
    id: 1,
    name: 'تفسير الجلالين',
    author: 'جلال الدين المحلي والسيوطي',
    description: 'تفسير موجز وسهل الفهم، يتميز بالاختصار والوضوح',
    type: 'موجز',
  },
  {
    id: 2,
    name: 'تفسير ابن كثير',
    author: 'إسماعيل بن عمر بن كثير',
    description: 'تفسير شامل يعتمد على السنة والآثار',
    type: 'شامل',
  },
  {
    id: 3,
    name: 'تفسير الطبري',
    author: 'محمد بن جرير الطبري',
    description: 'من أقدم وأشهر التفاسير، يركز على اللغة والأثر',
    type: 'شامل',
  },
  {
    id: 4,
    name: 'تفسير القرطبي',
    author: 'أبو عبدالله القرطبي',
    description: 'تفسير يجمع بين الفقه والتفسير',
    type: 'فقهي',
  },
  {
    id: 5,
    name: 'تفسير الزمخشري',
    author: 'جار الله الزمخشري',
    description: 'تفسير يركز على الجوانب اللغوية والبلاغية',
    type: 'لغوي',
  },
  {
    id: 6,
    name: 'تفسير الرازي',
    author: 'فخر الدين الرازي',
    description: 'تفسير عميق يناقش القضايا العقدية والفلسفية',
    type: 'عقدي',
  },
];

const recentAyahs = [
  { surah: 2, surahName: 'البقرة', ayah: 216, text: 'وَعَسَىٰ أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ' },
  { surah: 3, surahName: 'آل عمران', ayah: 139, text: 'فَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ' },
  { surah: 4, surahName: 'النساء', ayah: 28, text: 'يُرِيدُ اللَّهُ أَن يُخَفِّفَ عَنكُمْ' },
];

export default function TafsirPage() {
  const [selectedBook, setSelectedBook] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBooks = tafsirBooks.filter((book) => {
    return !searchQuery || book.name.includes(searchQuery) || book.author.includes(searchQuery);
  });

  return (
    <Container className="py-12 space-y-10">
      {/* Hero */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-brand-gold">التفسير</h1>
        <p className="max-w-2xl mx-auto text-lg leading-8 arabic-muted">
          اقرأ تفسيرات معتمدة لآيات القرآن الكريم
        </p>
      </section>

      {/* Search Bar */}
      <section className="max-w-2xl mx-auto w-full">
        <div className="relative">
          <input
            type="text"
            placeholder="ابحث عن تفسير أو كتاب..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-4 rounded-xl border border-brand-gold/30 bg-black/20 text-brand-cream placeholder:text-brand-cream/40 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
          />
          <button className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold hover:text-brand-goldSoft">
            🔍
          </button>
        </div>
      </section>

      {/* Tafsir Books */}
      <section className="space-y-6">
        <SectionHeader title="كتب التفسير المعتمدة" />
        
        {filteredBooks.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredBooks.map((book) => (
              <Card 
                key={book.id} 
                onClick={() => setSelectedBook(selectedBook === book.id ? null : book.id)}
                className={`p-4 cursor-pointer transition-all ${
                  selectedBook === book.id
                    ? 'border-brand-gold bg-brand-gold/10'
                    : 'hover:border-brand-gold/50'
                }`}
              >
                <div className="space-y-3">
                  <h3 className="font-semibold text-brand-cream text-lg">{book.name}</h3>
                  <p className="text-sm text-brand-gold/70">{book.author}</p>
                  <Badge variant="secondary" className="text-xs">{book.type}</Badge>
                  <p className="text-sm leading-6 arabic-muted">{book.description}</p>
                  <Link href={`/tafsir/${book.id}`}>
                    <Button size="sm" className="w-full">اقرأ التفسير</Button>
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

      {/* Recent Ayahs */}
      <section className="space-y-6">
        <SectionHeader title="آيات قرآنية مشهورة" />
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recentAyahs.map((ayah, idx) => (
            <Card key={idx} className="p-4 space-y-3 hover:border-brand-gold/50 transition-all">
              <p className="text-lg leading-relaxed text-right font-arabic text-brand-cream">
                {ayah.text}
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-brand-gold/70">{ayah.surahName} - {ayah.ayah}</span>
                <Link href={`/quran/${ayah.surah}/${ayah.ayah}`}>
                  <Button size="sm" variant="outline">اقرأ التفسير</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Types of Tafsir */}
      <section className="space-y-6">
        <SectionHeader title="أنواع التفسير" />
        
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="space-y-3">
            <h3 className="text-lg font-bold text-brand-gold">التفسير الموجز</h3>
            <p className="text-sm leading-6 arabic-muted">
              تفسير مختصر يركز على المعاني الأساسية للآيات، مثل تفسير الجلالين.
            </p>
          </Card>
          <Card className="space-y-3">
            <h3 className="text-lg font-bold text-brand-gold">التفسير الشامل</h3>
            <p className="text-sm leading-6 arabic-muted">
              تفسير مفصل يتناول جميع جوانب الآية، مثل تفسير ابن كثير والطبري.
            </p>
          </Card>
          <Card className="space-y-3">
            <h3 className="text-lg font-bold text-brand-gold">التفسير الفقهي</h3>
            <p className="text-sm leading-6 arabic-muted">
              تفسير يركز على الأحكام الفقهية والقضايا الشرعية، مثل تفسير القرطبي.
            </p>
          </Card>
          <Card className="space-y-3">
            <h3 className="text-lg font-bold text-brand-gold">التفسير اللغوي</h3>
            <p className="text-sm leading-6 arabic-muted">
              تفسير يركز على الجوانب اللغوية والبلاغية، مثل تفسير الزمخشري.
            </p>
          </Card>
        </div>
      </section>

      {/* Search by Surah */}
      <section className="space-y-6">
        <SectionHeader title="ابحث حسب السورة" />
        
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {['الفاتحة', 'البقرة', 'آل عمران', 'النساء', 'المائدة', 'الأنعام', 'الأعراف', 'الأنفال'].map((surahName) => {
            const surahId = getSurahIdFromName(surahName);
            return surahId ? (
              <Link key={surahName} href={`/quran/${surahId}`}>
                <Button variant="outline" className="w-full">{surahName}</Button>
              </Link>
            ) : null;
          })}
        </div>
      </section>

      {/* CTA */}
      <Card className="text-center py-8 space-y-4 bg-brand-gold/5">
        <h2 className="text-2xl text-brand-gold">اقرأ القرآن الكريم</h2>
        <p className="arabic-muted max-w-xl mx-auto leading-7">
          اقرأ القرآن الكريم مع التفسير والترجمة والتلاوة الصوتية
        </p>
        <Link href="/quran">
          <Button>اذهب إلى القرآن</Button>
        </Link>
      </Card>
    </Container>
  );
}
