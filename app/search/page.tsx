'use client';

import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    
    if (!query.trim()) {
      setResults([]);
      return;
    }

    // Mock search results - in production this would call API
    setResults([
      { type: 'Quran', title: 'آية تحتوي على: ' + query, content: 'القرآن الكريم' },
      { type: 'Hadith', title: 'حديث يتعلق بـ ' + query, content: 'الأحاديث الشريفة' },
      { type: 'Dua', title: 'دعاء متعلق بـ ' + query, content: 'الأدعية' },
    ]);
  };

  return (
    <Container className="py-12 space-y-10">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-brand-gold">بحث شامل</h1>
        <p className="max-w-2xl mx-auto text-lg leading-8 arabic-muted">
          ابحث عن أي محتوى في الموقع من آيات قرآنية وأحاديث وأدعية
        </p>
      </section>

      <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl mx-auto">
        <Input
          type="text"
          placeholder="اكتب ما تبحث عنه..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 text-lg"
        />
        <Button type="submit" variant="primary" className="px-8">
          بحث
        </Button>
      </form>

      {searched && results.length === 0 && query && (
        <Card className="text-center p-8 text-brand-cream/60">
          لا توجد نتائج لـ "{query}". جرب كلمات أخرى.
        </Card>
      )}

      {results.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-gold">النتائج ({results.length})</h2>
          <div className="grid gap-4">
            {results.map((result, idx) => (
              <Card key={idx} className="p-6 space-y-3 hover:border-brand-gold/50 cursor-pointer">
                <div className="flex items-start gap-4">
                  <span className="px-3 py-1 bg-brand-gold/10 text-brand-gold text-xs font-semibold rounded">
                    {result.type}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-brand-cream">{result.title}</h3>
                    <p className="text-sm text-brand-cream/60 mt-1">{result.content}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {!searched && (
        <section className="text-center p-8 bg-brand-gold/5 rounded">
          <p className="text-brand-cream/60">ابدأ البحث عن أي موضوع يهمك</p>
        </section>
      )}
    </Container>
  );
}
