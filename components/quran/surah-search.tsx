'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

interface Surah {
  number: number;
  name: string;
  numberOfAyahs: number;
}

export function SurahSearch({ initialSurahs }: { initialSurahs: Surah[] }) {
  const [query, setQuery] = useState('');

  const filteredSurahs = initialSurahs.filter(
    (s) => s.name.includes(query) || String(s.number) === query
  );

  return (
    <div className='space-y-4'>
      <input
        className='w-full rounded-lg bg-black/20 p-3 outline-none focus:ring-2 focus:ring-brand-gold'
        placeholder='ابحث عن سورة بالاسم أو الرقم...'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {filteredSurahs.length === 0 ? (
        <Card className='p-4 arabic-muted'>لم يتم العثور على نتائج للبحث.</Card>
      ) : (
        <div className='grid gap-3'>
          {filteredSurahs.map((surah) => (
            <Card key={surah.number} className="hover:bg-black/5 transition-colors">
              <Link href={`/quran/${surah.number}`} className='flex justify-between p-4'>
                <div className="flex items-center gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gold/10 text-xs font-bold text-brand-gold">
                    {surah.number}
                  </span>
                  <span className="font-bold">{surah.name}</span>
                </div>
                <span className='arabic-muted text-sm'>{surah.numberOfAyahs} آيات</span>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
