'use client';

import { useState, useTransition, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { searchSpiritualContent, type AISearchResult, type SpiritualResponse } from '@/app/spiritual-ai/actions';

const FEELING_SUGGESTIONS = [
  { label: '😔 حزين', value: 'أشعر بالحزن والضيق وأبحث عن السكينة' },
  { label: '😰 قلق', value: 'أشعر بالقلق والتوتر من المستقبل' },
  { label: '😨 خائف', value: 'أشعر بالخوف وأحتاج إلى الأمان' },
  { label: '🙌 شاكر', value: 'أشعر بالامتنان لله وأريد التعبير عن شكري' },
  { label: '💢 غاضب', value: 'أشعر بالغضب وأريد أن أهدأ' },
  { label: '👤 وحيد', value: 'أشعر بالوحدة وأحتاج إلى الأنس بذكر الله' },
];

function ResponseCard({ response }: { response: SpiritualResponse }) {
  const typeLabels: Record<string, string> = {
    quran: 'آية قرآنية',
    hadith: 'حديث نبوي',
    dhikr: 'ذِكر مأثور',
    advice: 'نصيحة إيمانية',
    poem: 'شعر زهد',
  };

  const typeColors: Record<string, string> = {
    quran: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    hadith: 'bg-brand-gold/10 text-brand-gold border-brand-gold/20',
    dhikr: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    advice: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    poem: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  };

  return (
    <Card className="group relative space-y-4 p-8 bg-black/30 border-brand-gold/10 hover:border-brand-gold/30 transition-all shadow-xl overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <Badge className={`${typeColors[response.type]} border px-3 py-1 rounded-full font-bold`}>
          {typeLabels[response.type]}
        </Badge>
        {response.source && (
          <span className="text-[10px] uppercase tracking-widest text-brand-cream/30 font-medium">{response.source}</span>
        )}
      </div>
      
      <p className="text-2xl leading-[1.8] font-arabic text-brand-cream text-center" dir="rtl">
        {response.content}
      </p>
      
      {response.reference && (
        <div className="pt-4 border-t border-brand-gold/5 text-center">
          <p className="text-sm text-brand-gold/60 font-medium italic">{response.reference}</p>
        </div>
      )}
      
      {/* Decorative Ornament */}
      <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-brand-gold/5 rounded-full blur-xl group-hover:bg-brand-gold/10 transition-all" />
    </Card>
  );
}

export function SpiritualSearch() {
  const [feeling, setFeeling] = useState('');
  const [result, setResult] = useState<AISearchResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSearch = (text?: string) => {
    const searchText = text || feeling;
    if (!searchText.trim()) return;
    
    startTransition(async () => {
      const searchResult = await searchSpiritualContent(searchText);
      setResult(searchResult);
      // Scroll to results after a short delay to allow rendering
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    });
  };

  return (
    <div className="space-y-12">
      {/* Search Form */}
      <Card className="p-8 md:p-12 space-y-8 bg-black/40 border-brand-gold/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        
        <div className="relative space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-brand-gold">بماذا تشعر الآن؟</h2>
            <p className="text-brand-cream/60">اكتب كلمات بسيطة تصف حالتك النفسية أو ما يشغل بالك</p>
          </div>
          
          <div className="relative">
            <textarea
              value={feeling}
              onChange={(e) => setFeeling(e.target.value)}
              placeholder="مثال: أشعر بضيق في صدري وأحتاج لآيات تطمئن قلبي..."
              className="w-full h-40 rounded-3xl border-2 border-brand-gold/10 bg-black/40 p-6 text-xl text-brand-cream placeholder:text-brand-cream/20 focus:border-brand-gold/40 focus:outline-none focus:ring-4 focus:ring-brand-gold/5 transition-all resize-none shadow-inner"
              dir="rtl"
            />
            <div className="absolute bottom-4 left-4 text-[10px] text-brand-cream/20 uppercase tracking-widest">
              الرفيق الروحاني الذكي
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            {FEELING_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion.label}
                onClick={() => {
                  setFeeling(suggestion.value);
                  handleSearch(suggestion.value);
                }}
                disabled={isPending}
                className="rounded-full border border-brand-gold/20 bg-brand-gold/5 px-5 py-2 text-sm text-brand-gold hover:bg-brand-gold hover:text-black transition-all disabled:opacity-50 font-bold"
              >
                {suggestion.label}
              </button>
            ))}
          </div>
          
          <Button 
            onClick={() => handleSearch()} 
            disabled={!feeling.trim() || isPending}
            className="w-full py-8 text-xl bg-brand-gold text-black hover:bg-brand-goldSoft rounded-2xl shadow-lg shadow-brand-gold/10"
          >
            {isPending ? (
              <span className="flex items-center gap-3">
                <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                جاري البحث في الوحيين...
              </span>
            ) : 'استشِر الرفيق الروحاني ✨'}
          </Button>
        </div>
      </Card>

      {/* Results Section */}
      <div ref={resultsRef} className="space-y-10">
        {result && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {result.error && (
              <Card className="p-6 border-red-500/20 bg-red-500/5 text-red-300 text-center">
                ⚠️ {result.error}
              </Card>
            )}
            
            {result.feeling && result.feeling !== 'عام' && (
              <div className="flex justify-center">
                <Badge variant="secondary" className="bg-brand-emeraldDeep/20 text-brand-emerald border-brand-emerald/20 px-6 py-2 rounded-full text-lg">
                  الحالة المكتشفة: {result.feeling}
                </Badge>
              </div>
            )}

            {/* AI Spiritual Advice */}
            {result.aiAdvice && (
              <Card className="p-10 border-brand-gold/20 bg-gradient-to-br from-brand-gold/10 to-black relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">💡</div>
                <div className="relative space-y-4">
                  <h3 className="text-2xl font-bold text-brand-gold flex items-center gap-3">
                    نصيحة الرفيق الروحاني
                  </h3>
                  <p className="text-xl leading-[1.8] text-brand-cream/90 text-right" dir="rtl">
                    {result.aiAdvice}
                  </p>
                </div>
              </Card>
            )}

            {/* Quran & Hadith Results */}
            {result.responses.filter((r: SpiritualResponse) => r.type === 'quran' || r.type === 'hadith').length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center gap-4 border-r-4 border-brand-gold pr-4">
                  <h3 className="text-2xl font-bold text-brand-gold">من مشكاة النبوة وأنوار التنزيل</h3>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  {result.responses
                    .filter((r: SpiritualResponse) => r.type === 'quran' || r.type === 'hadith')
                    .map((response: SpiritualResponse, index: number) => (
                      <ResponseCard key={index} response={response} />
                    ))}
                </div>
              </section>
            )}

            {/* Dhikr & Duas */}
            {result.responses.filter((r: SpiritualResponse) => r.type === 'dhikr').length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center gap-4 border-r-4 border-brand-emerald pr-4">
                  <h3 className="text-2xl font-bold text-brand-gold">أذكار وأدعية لسكينة القلب</h3>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {result.responses
                    .filter((r: SpiritualResponse) => r.type === 'dhikr')
                    .map((response: SpiritualResponse, index: number) => (
                      <Card key={index} className="p-6 bg-black/20 border-brand-gold/10 hover:border-brand-gold/30 transition-all text-center space-y-4">
                        <div className="text-brand-gold/20 text-4xl">📿</div>
                        <p className="text-xl font-arabic leading-relaxed text-brand-cream" dir="rtl">
                          {response.content}
                        </p>
                        {response.reference && (
                          <p className="text-xs text-brand-cream/30 italic">{response.reference}</p>
                        )}
                      </Card>
                    ))}
                </div>
              </section>
            )}
            
            <div className="text-center pt-8">
              <Button 
                variant="ghost" 
                onClick={() => {
                  setResult(null);
                  setFeeling('');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-brand-cream/40 hover:text-brand-gold"
              >
                بحث جديد 🔄
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
