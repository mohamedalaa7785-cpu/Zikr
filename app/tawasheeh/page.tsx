'use client';

import { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SectionHeader } from '@/components/ui/section-header';

const categories = [
  { id: 1, name: 'التواشيح الكلاسيكية', icon: '🎵' },
  { id: 2, name: 'التواشيح الحديثة', icon: '🎶' },
  { id: 3, name: 'الأناشيد الإسلامية', icon: '🎤' },
  { id: 4, name: 'الأذكار الملحنة', icon: '🕌' },
];

const tawasheeh = [
  {
    id: 1,
    title: 'يا نور الله',
    artist: 'فريق التواشيح',
    category: 'التواشيح الكلاسيكية',
    duration: '4:32',
    views: '12.5K',
    featured: true,
  },
  {
    id: 2,
    title: 'سلام عليك',
    artist: 'الفنان المشهور',
    category: 'التواشيح الحديثة',
    duration: '5:15',
    views: '8.3K',
    featured: false,
  },
  {
    id: 3,
    title: 'يا إلهي',
    artist: 'فريق التواشيح',
    category: 'الأناشيد الإسلامية',
    duration: '3:45',
    views: '15.2K',
    featured: true,
  },
  {
    id: 4,
    title: 'سبحان الله',
    artist: 'المنشد الموهوب',
    category: 'الأذكار الملحنة',
    duration: '2:30',
    views: '9.8K',
    featured: false,
  },
  {
    id: 5,
    title: 'الحمد لله',
    artist: 'فريق التواشيح',
    category: 'الأذكار الملحنة',
    duration: '3:20',
    views: '11.4K',
    featured: true,
  },
  {
    id: 6,
    title: 'لا إله إلا الله',
    artist: 'الفنان المشهور',
    category: 'التواشيح الكلاسيكية',
    duration: '4:10',
    views: '13.7K',
    featured: false,
  },
];

export default function TawasheehPage() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<number[]>([]);

  const filteredTawasheeh = tawasheeh.filter((item) => {
    const matchesCategory = !selectedCategory || categories.find(c => c.id === selectedCategory)?.name === item.category;
    const matchesSearch = !searchQuery || item.title.includes(searchQuery) || item.artist.includes(searchQuery);
    return matchesCategory && matchesSearch;
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
        <h1 className="text-4xl font-bold text-brand-gold">التواشيح الإسلامية</h1>
        <p className="max-w-2xl mx-auto text-lg leading-8 arabic-muted">
          استمع إلى أجمل التواشيح والأناشيد الإسلامية
        </p>
      </section>

      {/* Search Bar */}
      <section className="max-w-2xl mx-auto w-full">
        <div className="relative">
          <input
            type="text"
            placeholder="ابحث عن تشويح أو منشد..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-4 rounded-xl border border-brand-gold/30 bg-black/20 text-brand-cream placeholder:text-brand-cream/40 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
          />
          <button className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold hover:text-brand-goldSoft">
            🔍
          </button>
        </div>
      </section>

      {/* Categories */}
      <section className="space-y-6">
        <SectionHeader title="التصنيفات" />
        
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <Card
              key={cat.id}
              onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
              className={`text-center p-4 cursor-pointer transition-all ${
                selectedCategory === cat.id
                  ? 'border-brand-gold bg-brand-gold/10'
                  : 'hover:border-brand-gold/50'
              }`}
            >
              <div className="text-3xl mb-2">{cat.icon}</div>
              <p className="text-sm font-semibold text-brand-cream">{cat.name}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Section */}
      <section className="space-y-6">
        <SectionHeader title="المختارة" />
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTawasheeh.filter(t => t.featured).map((item) => (
            <Card key={item.id} className="overflow-hidden hover:border-brand-gold/50 transition-all group">
              <div className="h-40 bg-gradient-to-br from-brand-gold/20 to-brand-emerald/20 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform relative">
                🎵
                <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded text-xs text-brand-cream">
                  {item.duration}
                </div>
              </div>
              <div className="p-4 space-y-3">
                <h3 className="font-semibold text-brand-cream text-lg">{item.title}</h3>
                <p className="text-sm text-brand-gold/70">{item.artist}</p>
                <p className="text-xs text-brand-cream/50">{item.views} مشاهدة</p>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">▶ استمع</Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => toggleFavorite(item.id)}
                  >
                    {favorites.includes(item.id) ? '❤️' : '🤍'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* All Tawasheeh */}
      <section className="space-y-6">
        <SectionHeader title={selectedCategory ? 'النتائج' : 'جميع التواشيح'} />
        
        {filteredTawasheeh.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTawasheeh.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:border-brand-gold/50 transition-all group">
                <div className="h-40 bg-gradient-to-br from-brand-gold/20 to-brand-emerald/20 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform relative">
                  🎵
                  <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded text-xs text-brand-cream">
                    {item.duration}
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <h3 className="font-semibold text-brand-cream">{item.title}</h3>
                  <p className="text-sm text-brand-gold/70">{item.artist}</p>
                  <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                  <p className="text-xs text-brand-cream/50">{item.views} مشاهدة</p>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">▶ استمع</Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => toggleFavorite(item.id)}
                    >
                      {favorites.includes(item.id) ? '❤️' : '🤍'}
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

      {/* CTA */}
      <Card className="text-center py-8 space-y-4 bg-brand-gold/5">
        <h2 className="text-2xl text-brand-gold">أنشئ قائمة تشغيل خاصة بك</h2>
        <p className="arabic-muted max-w-xl mx-auto leading-7">
          احفظ تواشيحك المفضلة وأنشئ قوائم تشغيل شخصية
        </p>
        <Button>إنشاء قائمة جديدة</Button>
      </Card>
    </Container>
  );
}
