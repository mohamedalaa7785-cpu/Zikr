'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Surah {
  number: number;
  name: string;
  numberOfAyahs: number;
  englishName?: string;
  revelationType?: string;
}

export function SurahSearch({ initialSurahs }: { initialSurahs: Surah[] }) {
  const [query, setQuery] = useState('');

  const filteredSurahs = initialSurahs.filter(
    (s) => 
      s.name.includes(query) || 
      String(s.number) === query || 
      s.englishName?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className='space-y-8'>
      {/* Search Input */}
      <div className="relative max-w-2xl mx-auto">
        <input
          className='w-full rounded-2xl border border-brand-gold/20 bg-black/40 p-5 pr-14 text-xl text-brand-cream placeholder:text-brand-cream/30 focus:border-brand-gold/50 focus:outline-none focus:ring-1 focus:ring-brand-gold/50 transition-all shadow-xl'
          placeholder='ابحث عن سورة باسمها أو رقمها...'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          dir="rtl"
        />
        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-2xl opacity-40">🔍</span>
      </div>

      {/* Results Grid */}
      {filteredSurahs.length === 0 ? (
        <Card className='p-12 text-center border-brand-gold/10 bg-black/20'>
          <p className='arabic-muted text-lg'>لم يتم العثور على سورة بهذا الاسم أو الرقم.</p>
        </Card>
      ) : (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {filteredSurahs.map((surah) => (
            <Link key={surah.number} href={`/quran/${surah.number}`}>
              <Card className="group relative h-full overflow-hidden border-brand-gold/10 bg-black/10 hover:border-brand-gold/50 hover:bg-brand-gold/5 transition-all cursor-pointer p-0">
                <div className="flex items-center p-5 gap-4">
                  {/* Number Ornament */}
                  <div className="relative flex-shrink-0 w-12 h-12 flex items-center justify-center">
                    <div className="absolute inset-0 border-2 border-brand-gold/20 rotate-45 rounded-lg group-hover:border-brand-gold/50 transition-colors" />
                    <span className="relative font-bold text-brand-gold text-lg">
                      {surah.number}
                    </span>
                  </div>

                  {/* Names */}
                  <div className="flex-1 text-right" dir="rtl">
                    <h3 className="text-2xl font-bold text-brand-gold group-hover:text-brand-goldSoft transition-colors">
                      {surah.name}
                    </h3>
                    <p className="text-xs text-brand-cream/40 font-medium tracking-wider uppercase">
                      {surah.englishName || `Surah ${surah.number}`}
                    </p>
                  </div>

                  {/* Info Badge */}
                  <div className="text-left flex flex-col items-end gap-1">
                    <Badge variant="outline" className="border-brand-gold/20 text-brand-gold/60 text-[10px] py-0">
                      {surah.numberOfAyahs} آيات
                    </Badge>
                    {surah.revelationType && (
                      <span className="text-[10px] text-brand-cream/30">
                        {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Decorative Line */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
