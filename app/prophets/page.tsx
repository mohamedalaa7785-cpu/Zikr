'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

interface Prophet {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  bio_ar?: string;
  featured_image_url?: string;
  thumbnail_url?: string;
  order_num?: number;
}

export default function ProphetsPage() {
  const [prophets, setProphets] = useState<Prophet[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    const fetchProphets = async () => {
      try {
        setLoading(true);
        
        let query = '/rest/v1/prophets?select=*&published=eq.true&order=order_num.asc';

        if (searchQuery) {
          query += `&name_ar=ilike.%${searchQuery}%`;
        }

        const data = await supabase.request<Prophet[]>(query);
        setProphets(data || []);
      } catch (error) {
        console.error('Error fetching prophets:', error);
        setProphets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProphets();
  }, [searchQuery]);

  return (
    <Container className="py-12 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-brand-gold">قصص الأنبياء والرسل</h1>
        <p className="text-brand-cream/70 max-w-2xl mx-auto">
          تعرف على قصص الأنبياء والرسل عليهم السلام وحياتهم الكريمة
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex justify-center">
        <Input
          type="text"
          placeholder="ابحث عن نبي أو رسول..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Prophets Grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-brand-cream/70">جاري التحميل...</p>
        </div>
      ) : prophets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-brand-cream/70">لم يتم العثور على أنبياء</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {prophets.map((prophet) => (
            <Link key={prophet.id} href={`/prophets/${prophet.slug}`}>
              <Card className="h-full overflow-hidden hover:border-brand-gold/50 transition-colors cursor-pointer flex flex-col">
                {prophet.featured_image_url || prophet.thumbnail_url ? (
                  <div className="w-full h-48 bg-brand-gold/10 overflow-hidden">
                    <img
                      src={prophet.featured_image_url || prophet.thumbnail_url}
                      alt={prophet.name_ar}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-brand-gold/20 to-brand-gold/5 flex items-center justify-center">
                    <span className="text-6xl">👳</span>
                  </div>
                )}
                <div className="p-6 space-y-3 flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold text-brand-gold">{prophet.name_ar}</h3>
                  {prophet.name_en && (
                    <p className="text-sm text-brand-cream/70">{prophet.name_en}</p>
                  )}
                  {prophet.bio_ar && (
                    <p className="text-brand-cream/80 line-clamp-3 flex-1">
                      {prophet.bio_ar}
                    </p>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Islamic Message */}
      <Card className="p-6 text-center space-y-3 bg-brand-gold/10">
        <h3 className="text-xl font-bold text-brand-gold">🕌 الأنبياء والرسل</h3>
        <p className="text-brand-cream/90 font-arabic text-lg leading-relaxed">
          قال تعالى: &quot;تِلْكَ الرُّسُلُ فَضَّلْنَا بَعْضَهُمْ عَلَىٰ بَعْضٍ مِّنْهُم مَّن كَلَّمَ اللَّهُ وَرَفَعَ بَعْضَهُمْ دَرَجَاتٍ&quot;
        </p>
      </Card>
    </Container>
  );
}
