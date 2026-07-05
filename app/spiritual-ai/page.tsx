'use client';

import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/ui/section-header';
import { useState, useTransition } from 'react';
import { searchSpiritualContent, type AISearchResult } from './actions';

const EXAMPLE_QUESTIONS = [
  'أشعر بالحزن والضيق هذه الأيام',
  'عندي قلق وتوتر من المستقبل',
  'الحمد لله أشعر بالسعادة والامتنان',
  'أحتاج للصبر على ابتلاء أصابني',
];

const TYPE_LABELS: Record<string, string> = {
  quran: 'من القرآن الكريم',
  hadith: 'حديث / آية',
  dhikr: 'ذكر',
  advice: 'نصيحة',
  poem: 'شعر',
};

export default function SpiritualAIPage() {
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState<AISearchResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleAsk = (value?: string) => {
    const text = (value ?? question).trim();
    if (!text) return;
    if (value) setQuestion(value);

    startTransition(async () => {
      const res = await searchSpiritualContent(text);
      setResult(res);
    });
  };

  const dhikrResponses = result?.responses.filter((r) => r.type === 'dhikr') ?? [];
  const mainResponses = result?.responses.filter((r) => r.type !== 'dhikr') ?? [];

  return (
    <Container className="py-12 space-y-10">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-brand-gold text-balance">المرشد الروحي الذكي</h1>
        <p className="max-w-2xl mx-auto text-lg leading-8 arabic-muted text-pretty">
          عبّر عمّا تشعر به، ودع المرشد يقترح لك آيات وأذكارًا ونصيحة روحانية من القرآن والسنة
        </p>
      </section>

      <Card className="p-8 space-y-6">
        <h2 className="text-2xl font-bold text-brand-gold">بماذا تشعر الآن؟</h2>

        <div className="space-y-3">
          <textarea
            placeholder="اكتب مشاعرك أو سؤالك الروحي هنا..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && !e.nativeEvent.isComposing) {
                e.preventDefault();
                handleAsk();
              }
            }}
            className="w-full h-28 p-4 bg-black/30 border border-brand-gold/30 rounded text-brand-cream focus:outline-none focus:border-brand-gold resize-none leading-relaxed"
            aria-label="اكتب مشاعرك أو سؤالك"
          />
          <Button onClick={() => handleAsk()} variant="primary" className="w-full" disabled={isPending}>
            {isPending ? 'جارٍ البحث...' : 'اطلب الإرشاد'}
          </Button>
        </div>

        {result?.error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded p-4">
            <p className="text-red-300">{result.error}</p>
          </div>
        )}

        {result && !result.error && (
          <div className="space-y-4">
            {result.aiAdvice && (
              <div className="bg-brand-gold/10 border border-brand-gold/30 rounded p-5 space-y-2">
                <p className="text-brand-gold font-semibold">نصيحة روحانية:</p>
                <p className="text-brand-cream leading-8">{result.aiAdvice}</p>
              </div>
            )}

            {mainResponses.map((r, i) => (
              <div key={i} className="bg-black/30 border border-brand-gold/20 rounded p-5 space-y-2">
                <p className="text-brand-gold/80 text-sm font-semibold">{TYPE_LABELS[r.type] ?? r.type}</p>
                <p className="text-brand-cream text-lg leading-9">{r.content}</p>
                {(r.source || r.reference) && (
                  <p className="text-brand-cream/50 text-sm">
                    {[r.source, r.reference].filter(Boolean).join(' — ')}
                  </p>
                )}
              </div>
            ))}

            {dhikrResponses.length > 0 && (
              <div className="bg-black/30 border border-brand-gold/20 rounded p-5 space-y-3">
                <p className="text-brand-gold/80 text-sm font-semibold">أذكار مقترحة</p>
                <div className="flex flex-wrap gap-2">
                  {dhikrResponses.map((r, i) => (
                    <span key={i} className="bg-brand-gold/10 text-brand-cream px-3 py-2 rounded text-sm">
                      {r.content}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      <section className="space-y-6">
        <SectionHeader title="جرّب هذه الأمثلة" />
        <div className="grid gap-4 md:grid-cols-2">
          {EXAMPLE_QUESTIONS.map((q, i) => (
            <Card
              key={i}
              className="p-4 cursor-pointer hover:border-brand-gold/50 transition-all"
              onClick={() => handleAsk(q)}
            >
              <p className="text-brand-cream hover:text-brand-gold transition-colors">{q}</p>
            </Card>
          ))}
        </div>
      </section>
    </Container>
  );
}
