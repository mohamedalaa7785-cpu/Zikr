'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

interface DuaCategory {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  icon?: string;
}

interface Dua {
  id: string;
  title_ar: string;
  title_en: string;
  slug: string;
  text_ar: string;
  occasion_ar?: string;
  source_ar?: string;
  benefits_ar?: string;
}

export default function DuaPage() {
  const [categories, setCategories] = useState<DuaCategory[]>([]);
  const [duas, setDuas] = useState<Dua[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories
        const categoriesData = await supabase.request<DuaCategory[]>(
          '/rest/v1/dua_categories?select=*&published=eq.true'
        );

        if (categoriesData) {
          setCategories(categoriesData);
          if (categoriesData.length > 0) {
            setSelectedCategory(categoriesData[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchDuas = async () => {
      if (!selectedCategory) return;

      try {
        let query = '/rest/v1/duas?select=*&published=eq.true';

        if (selectedCategory !== 'all') {
          query += `&category_id=eq.${selectedCategory}`;
        }

        if (searchQuery) {
          query += `&title_ar=ilike.%${searchQuery}%`;
        }

        const data = await supabase.request<Dua[]>(query);
        setDuas(data || []);
      } catch (error) {
        console.error('Error fetching duas:', error);
        setDuas([]);
      }
    };

    fetchDuas();
  }, [selectedCategory, searchQuery]);

  return (
    <Container className="py-12 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-brand-gold">الأدعية الإسلامية</h1>
        <p className="text-brand-cream/70 max-w-2xl mx-auto">
          مجموعة شاملة من الأدعية القرآنية والنبوية والمأثورة
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex justify-center">
        <Input
          type="text"
          placeholder="ابحث عن دعاء..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Categories */}
      {!loading && categories.length > 0 && (
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            variant={selectedCategory === 'all' ? 'primary' : 'outline'}
            onClick={() => setSelectedCategory('all')}
          >
            الكل
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? 'primary' : 'outline'}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.icon && <span className="mr-2">{cat.icon}</span>}
              {cat.name_ar}
            </Button>
          ))}
        </div>
      )}

      {/* Duas Grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-brand-cream/70">جاري التحميل...</p>
        </div>
      ) : duas.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-brand-cream/70">لا توجد أدعية في هذه الفئة</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {duas.map((dua) => (
            <Link key={dua.id} href={`/dua/${dua.slug}`}>
              <Card className="p-6 space-y-3 hover:border-brand-gold/50 transition-colors cursor-pointer">
                <h3 className="text-xl font-bold text-brand-gold">{dua.title_ar}</h3>
                <p className="text-brand-cream/90 line-clamp-2 text-lg leading-relaxed" dir="rtl">
                  {dua.text_ar}
                </p>
                {dua.occasion_ar && (
                  <p className="text-sm text-brand-gold/70">
                    <span className="font-bold">المناسبة:</span> {dua.occasion_ar}
                  </p>
                )}
                {dua.source_ar && (
                  <p className="text-xs text-brand-cream/60">
                    المصدر: {dua.source_ar}
                  </p>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </Container>
  );
}
