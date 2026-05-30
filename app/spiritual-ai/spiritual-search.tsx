'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { searchSpiritualContent, type AISearchResult, type SpiritualResponse } from './actions';

const FEELING_SUGGESTIONS = [
  { label: 'حزين', value: 'أشعر بالحزن والضيق' },
  { label: 'قلق', value: 'أشعر بالقلق والتوتر' },
  { label: 'خائف', value: 'أشعر بالخوف من المستقبل' },
  { label: 'شاكر', value: 'أشعر بالامتنان والشكر' },
  { label: 'غاضب', value: 'أشعر بالغضب' },
  { label: 'وحيد', value: 'أشعر بالوحدة' },
];

function ResponseCard({ response }: { response: SpiritualResponse }) {
  const typeLabels: Record<string, string> = {
    quran: 'قرآن كريم',
    hadith: 'حديث / آية',
    dhikr: 'ذِكر',
    advice: 'نصيحة',
    poem: 'شعر',
  };

  const typeColors: Record<string, string> = {
    quran: 'bg-emerald-500/20 text-emerald-300',
    hadith: 'bg-amber-500/20 text-amber-300',
    dhikr: 'bg-blue-500/20 text-blue-300',
    advice: 'bg-purple-500/20 text-purple-300',
    poem: 'bg-pink-500/20 text-pink-300',
  };

  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between">
        <Badge className={typeColors[response.type]}>
          {typeLabels[response.type]}
        </Badge>
        {response.source && (
          <span className="text-xs arabic-muted">{response.source}</span>
        )}
      </div>
      <p className="text-lg leading-loose font-arabic">{response.content}</p>
      {response.reference && (
        <p className="text-sm arabic-muted">{response.reference}</p>
      )}
    </Card>
  );
}

export function SpiritualSearch() {
  const [feeling, setFeeling] = useState('');
  const [result, setResult] = useState<AISearchResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSearch = () => {
    if (!feeling.trim()) return;
    
    startTransition(async () => {
      const searchResult = await searchSpiritualContent(feeling);
      setResult(searchResult);
    });
  };

  const handleSuggestionClick = (value: string) => {
    setFeeling(value);
    startTransition(async () => {
      const searchResult = await searchSpiritualContent(value);
      setResult(searchResult);
    });
  };

  return (
    <div className="space-y-8">
      {/* Search Form */}
      <Card className="space-y-4">
        <h2 className="text-xl text-brand-gold">اكتب ما تشعر به</h2>
        <p className="text-sm arabic-muted leading-6">
          عبّر عن مشاعرك أو حالتك النفسية، وسنجد لك آيات قرآنية وأحاديث وأذكار تناسب حالتك.
        </p>
        
        <textarea
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          placeholder="مثال: أشعر بالقلق من المستقبل..."
          className="w-full h-32 rounded-lg border border-brand-gold/20 bg-black/20 p-4 text-brand-cream placeholder:text-brand-cream/40 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold resize-none"
          dir="rtl"
        />
        
        <div className="flex flex-wrap gap-2">
          {FEELING_SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion.label}
              onClick={() => handleSuggestionClick(suggestion.value)}
              disabled={isPending}
              className="rounded-full border border-brand-gold/30 px-3 py-1 text-sm hover:bg-brand-gold/10 transition-colors disabled:opacity-50"
            >
              {suggestion.label}
            </button>
          ))}
        </div>
        
        <Button 
          onClick={handleSearch} 
          disabled={!feeling.trim() || isPending}
          className="w-full"
        >
          {isPending ? 'جاري البحث...' : 'ابحث عن الراحة'}
        </Button>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {result.error && (
            <Card className="border-red-500/40 text-red-300">
              {result.error}
            </Card>
          )}
          
          {result.feeling && result.feeling !== 'عام' && (
            <div className="text-center">
              <Badge variant="outline" className="text-lg px-4 py-2">
                تم تحديد شعورك: {result.feeling}
              </Badge>
            </div>
          )}

          {/* AI Advice */}
          {result.aiAdvice && (
            <Card className="border-brand-gold/40 bg-brand-gold/5">
              <h3 className="text-lg text-brand-gold mb-3">نصيحة روحانية</h3>
              <p className="leading-8 text-brand-cream">{result.aiAdvice}</p>
            </Card>
          )}

          {/* Quran & Hadith */}
          {result.responses.filter(r => r.type === 'quran' || r.type === 'hadith').length > 0 && (
            <section className="space-y-4">
              <h3 className="text-xl text-brand-gold">من القرآن والسنة</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {result.responses
                  .filter(r => r.type === 'quran' || r.type === 'hadith')
                  .map((response, index) => (
                    <ResponseCard key={index} response={response} />
                  ))}
              </div>
            </section>
          )}

          {/* Dhikr */}
          {result.responses.filter(r => r.type === 'dhikr').length > 0 && (
            <section className="space-y-4">
              <h3 className="text-xl text-brand-gold">أذكار مقترحة</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {result.responses
                  .filter(r => r.type === 'dhikr')
                  .map((response, index) => (
                    <Card key={index} className="text-center py-4">
                      <p className="text-lg font-arabic leading-loose">{response.content}</p>
                    </Card>
                  ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
