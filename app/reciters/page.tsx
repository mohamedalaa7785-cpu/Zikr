'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SectionHeader } from '@/components/ui/section-header';

const reciters = [
  {
    id: 1,
    name: 'عبدالباسط عبدالصمد',
    narration: 'حفص عن عاصم',
    surahs: 114,
    image: '🎙️',
    featured: true,
    views: '250K',
  },
  {
    id: 2,
    name: 'محمد صديق المنشاوي',
    narration: 'حفص عن عاصم',
    surahs: 114,
    image: '🎙️',
    featured: true,
    views: '180K',
  },
  {
    id: 3,
    name: 'عبدالرحمن السديس',
    narration: 'حفص عن عاصم',
    surahs: 114,
    image: '🎙️',
    featured: false,
    views: '220K',
  },
  {
    id: 4,
    name: 'ياسين الجزائري',
    narration: 'حفص عن عاصم',
    surahs: 114,
    image: '🎙️',
    featured: false,
    views: '150K',
  },
  {
    id: 5,
    name: 'سعود الشريم',
    narration: 'حفص عن عاصم',
    surahs: 114,
    image: '🎙️',
    featured: true,
    views: '190K',
  },
  {
    id: 6,
    name: 'فارس عباد',
    narration: 'حفص عن عاصم',
    surahs: 114,
    image: '🎙️',
    featured: false,
    views: '120K',
  },
];

export default function RecitersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<number[]>([]);

  const filteredReciters = reciters.filter((reciter) => {
    return !searchQuery || reciter.name.includes(searchQuery) || reciter.narration.includes(searchQuery);
  });

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  return (
    <Container className="py-12 space-y-10">
      {/* Hero */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-brand-gold">القراء والمشايخ</h1>
        <p className="max-w-2xl mx-auto text-lg leading-8 arabic-muted">
          استمع إلى أفضل القراء والمشايخ في تلاوة القرآن الكريم
        </p>
      </section>

      {/* Search Bar */}
      <section className="max-w-2xl mx-auto w-full">
        <div className="relative">
          <input
            type="text"
            placeholder="ابحث عن قارئ أو رواية..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-4 rounded-xl border border-brand-gold/30 bg-black/20 text-brand-cream placeholder:text-brand-cream/40 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
          />
          <button className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold hover:text-brand-goldSoft">
            🔍
          </button>
        </div>
      </section>

      {/* Featured Reciters */}
      <section className="space-y-6">
        <SectionHeader title="القراء المشهورون" />
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredReciters.filter(r => r.featured).map((reciter) => (
            <Card key={reciter.id} className="overflow-hidden hover:border-brand-gold/50 transition-all group">
              <div className="h-40 bg-gradient-to-br from-brand-gold/20 to-brand-emerald/20 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform">
                {reciter.image}
              </div>
              <div className="p-4 space-y-3">
                <h3 className="font-semibold text-brand-cream text-lg">{reciter.name}</h3>
                <p className="text-sm text-brand-gold/70">{reciter.narration}</p>
                <div className="flex items-center justify-between text-xs text-brand-cream/50">
                  <span>{reciter.surahs} سورة</span>
                  <span>{reciter.views} استماع</span>
                </div>
                <div className="flex gap-2">
                  <Link href={`/reciters/${reciter.id}`} className="flex-1">
                    <Button size="sm" className="w-full">▶ استمع</Button>
                  </Link>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => toggleFavorite(reciter.id)}
                  >
                    {favorites.includes(reciter.id) ? '❤️' : '🤍'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* All Reciters */}
      <section className="space-y-6">
        <SectionHeader title="جميع القراء" />
        
        {filteredReciters.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredReciters.map((reciter) => (
              <Card key={reciter.id} className="overflow-hidden hover:border-brand-gold/50 transition-all group">
                <div className="h-40 bg-gradient-to-br from-brand-gold/20 to-brand-emerald/20 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform">
                  {reciter.image}
                </div>
                <div className="p-4 space-y-3">
                  <h3 className="font-semibold text-brand-cream">{reciter.name}</h3>
                  <p className="text-sm text-brand-gold/70">{reciter.narration}</p>
                  <Badge variant="secondary" className="text-xs">{reciter.surahs} سورة</Badge>
                  <p className="text-xs text-brand-cream/50">{reciter.views} استماع</p>
                  <div className="flex gap-2">
                    <Link href={`/reciters/${reciter.id}`} className="flex-1">
                      <Button size="sm" className="w-full">▶ استمع</Button>
                    </Link>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => toggleFavorite(reciter.id)}
                    >
                      {favorites.includes(reciter.id) ? '❤️' : '🤍'}
                    </Button>
                  </div>
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

      {/* Information Section */}
      <Card className="space-y-4 p-6">
        <h2 className="text-2xl font-bold text-brand-gold">عن الروايات</h2>
        <div className="space-y-3 text-sm leading-7 arabic-muted">
          <p>
            <strong className="text-brand-gold">رواية حفص عن عاصم:</strong> هي أشهر الروايات وأكثرها استخداماً في العالم الإسلامي، وهي الرواية المعتمدة في المصحف الشريف.
          </p>
          <p>
            <strong className="text-brand-gold">رواية ورش عن نافع:</strong> من أشهر الروايات المغاربية، وتتميز بخصائص صوتية مميزة.
          </p>
          <p>
            <strong className="text-brand-gold">رواية قالون عن نافع:</strong> رواية مصرية تتميز بالوضوح والجمال.
          </p>
        </div>
      </Card>

      {/* CTA */}
      <Card className="text-center py-8 space-y-4 bg-brand-gold/5">
        <h2 className="text-2xl text-brand-gold">استمع إلى القرآن الكريم</h2>
        <p className="arabic-muted max-w-xl mx-auto leading-7">
          اختر قارئك المفضل واستمع إلى تلاوة جميلة من كتاب الله
        </p>
        <Link href="/quran">
          <Button>اذهب إلى القرآن</Button>
        </Link>
      </Card>
    </Container>
  );
}
