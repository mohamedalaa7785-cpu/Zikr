'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SectionHeader } from '@/components/ui/section-header';

const companions = [
  {
    id: 1,
    name: 'أبو بكر الصديق',
    category: 'khalifah',
    categoryAr: 'خليفة راشد',
    bio: 'أول خليفة راشدي، وأقرب الصحابة إلى النبي صلى الله عليه وسلم',
    image: '👳',
  },
  {
    id: 2,
    name: 'عمر بن الخطاب',
    category: 'khalifah',
    categoryAr: 'خليفة راشد',
    bio: 'ثاني خليفة راشدي، فاروق الأمة الذي فرق الله به بين الحق والباطل',
    image: '👳',
  },
  {
    id: 3,
    name: 'عثمان بن عفان',
    category: 'khalifah',
    categoryAr: 'خليفة راشد',
    bio: 'ثالث خليفة راشدي، ذو النورين، صاحب الحياء والورع',
    image: '👳',
  },
  {
    id: 4,
    name: 'علي بن أبي طالب',
    category: 'khalifah',
    categoryAr: 'خليفة راشد',
    bio: 'رابع خليفة راشدي، أسد الله الغالب، وكاتب الوحي',
    image: '👳',
  },
  {
    id: 5,
    name: 'الزبير بن العوام',
    category: 'mubashsharun',
    categoryAr: 'العشرة المبشرين',
    bio: 'حواري الرسول، صاحب النسب والشرف، والشهيد الصالح',
    image: '👳',
  },
  {
    id: 6,
    name: 'سعد بن أبي وقاص',
    category: 'mubashsharun',
    categoryAr: 'العشرة المبشرين',
    bio: 'قاضي الأمصار، ودعاء النبي صلى الله عليه وسلم مستجاب',
    image: '👳',
  },
  {
    id: 7,
    name: 'عبدالرحمن بن عوف',
    category: 'mubashsharun',
    categoryAr: 'العشرة المبشرين',
    bio: 'التاجر الصالح، والمحسن الكريم، من أغنياء الصحابة',
    image: '👳',
  },
  {
    id: 8,
    name: 'خالد بن الوليد',
    category: 'sahaba',
    categoryAr: 'كبار الصحابة',
    bio: 'سيف الله المسلول، قائد الفتوحات الإسلامية',
    image: '👳',
  },
];

export default function CompanionsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'khalifah', name: 'الخلفاء الراشدون', icon: '👑' },
    { id: 'mubashsharun', name: 'العشرة المبشرين', icon: '⭐' },
    { id: 'sahaba', name: 'كبار الصحابة', icon: '🌟' },
  ];

  const filteredCompanions = companions.filter((companion) => {
    const matchesCategory = !selectedCategory || companion.category === selectedCategory;
    const matchesSearch = !searchQuery || companion.name.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <Container className="py-12 space-y-10">
      {/* Hero */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-brand-gold">الصحابة الكرام</h1>
        <p className="max-w-2xl mx-auto text-lg leading-8 arabic-muted">
          تعرف على حياة أصحاب النبي صلى الله عليه وسلم والخلفاء الراشدين
        </p>
      </section>

      {/* Search Bar */}
      <section className="max-w-2xl mx-auto w-full">
        <div className="relative">
          <input
            type="text"
            placeholder="ابحث عن صحابي..."
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
        
        <div className="grid gap-3 sm:grid-cols-3">
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

      {/* Companions Grid */}
      <section className="space-y-6">
        <SectionHeader 
          title={selectedCategory ? categories.find(c => c.id === selectedCategory)?.name || 'جميع الصحابة' : 'جميع الصحابة'} 
        />
        
        {filteredCompanions.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCompanions.map((companion) => (
              <Card key={companion.id} className="overflow-hidden hover:border-brand-gold/50 transition-all group">
                <div className="h-40 bg-gradient-to-br from-brand-gold/20 to-brand-emerald/20 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform">
                  {companion.image}
                </div>
                <div className="p-4 space-y-3">
                  <h3 className="font-semibold text-brand-cream text-lg">{companion.name}</h3>
                  <Badge variant="secondary" className="text-xs">{companion.categoryAr}</Badge>
                  <p className="text-sm leading-6 arabic-muted">{companion.bio}</p>
                  <Link href={`/companions/${companion.id}`}>
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

      {/* Information Section */}
      <Card className="space-y-4 p-6">
        <h2 className="text-2xl font-bold text-brand-gold">الخلفاء الراشدون</h2>
        <p className="text-sm leading-7 arabic-muted">
          هم أول أربعة خلفاء بعد النبي صلى الله عليه وسلم: أبو بكر الصديق، وعمر بن الخطاب، وعثمان بن عفان، وعلي بن أبي طالب. قال النبي صلى الله عليه وسلم: "عليكم بسنتي وسنة الخلفاء الراشدين المهديين من بعدي".
        </p>
      </Card>

      {/* CTA */}
      <Card className="text-center py-8 space-y-4 bg-brand-gold/5">
        <h2 className="text-2xl text-brand-gold">تعرف على المزيد</h2>
        <p className="arabic-muted max-w-xl mx-auto leading-7">
          اقرأ قصص الصحابة الملهمة والدروس المستفادة من حياتهم
        </p>
        <Link href="/stories">
          <Button>اقرأ القصص</Button>
        </Link>
      </Card>
    </Container>
  );
}
