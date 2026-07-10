'use client';

import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState, useTransition } from 'react';
import { searchSpiritualContent, type AISearchResult } from './actions';

const EXAMPLE_QUESTIONS = [
  'أشعر بالحزن والضيق هذه الأيام',
  'عندي قلق وتوتر من المستقبل',
  'أذنبت وأريد أن أتوب إلى الله',
  'عندي ضيق في الرزق وديون',
  'أحتاج للصبر على ابتلاء أصابني',
  'الحمد لله أشعر بالسعادة والامتنان',
];

const TYPE_LABELS: Record<string, string> = {
  quran: 'من القرآن الكريم',
  hadith: 'حديث / آية',
  dhikr: 'ذكر',
  advice: 'نصيحة',
  poem: 'شعر',
};

const FEELING_LABELS: Record<string, string> = {
  حزن: 'الحزن',
  قلق: 'القلق',
  فرح: 'الفرح',
  خوف: 'الخوف',
  غضب: 'الغضب',
  شكر: 'الشكر',
  صبر: 'الصبر',
  ذنب: 'التوبة',
  رزق: 'الرزق',
  زواج: 'الزواج',
  عام: 'عام',
};

type ChatEntry = {
  question: string;
  result: AISearchResult;
};

export default function SpiritualAIPage() {
  const [question, setQuestion] = useState('');
  const [history, setHistory] = useState<ChatEntry[]>([]);
  const [isPending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (history.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [history.length, isPending]);

  const handleAsk = (value?: string) => {
    const text = (value ?? question).trim();
    if (!text || isPending) return;
    setQuestion('');

    startTransition(async () => {
      const res = await searchSpiritualContent(text);
      setHistory((cur) => [...cur, { question: text, result: res }]);
    });
  };

  return (
    <Container className="py-12 space-y-10">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-brand-gold text-balance">الرفيق الروحاني</h1>
        <p className="max-w-2xl mx-auto text-lg leading-8 arabic-muted text-pretty">
          عبّر عمّا تشعر به، ودع الرفيق يواسيك ويقترح لك آيات وأذكارًا ونصيحة روحانية من القرآن والسنة
        </p>
      </section>

      {history.length === 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-brand-gold text-center">جرّب أن تقول...</h2>
          <div className="grid gap-3 md:grid-cols-2">
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
      )}

      {/* Conversation history */}
      {history.length > 0 && (
        <section className="space-y-8" aria-label="سجل المحادثة">
          {history.map((entry, hIdx) => {
            const dhikrResponses = entry.result.responses.filter((r) => r.type === 'dhikr');
            const mainResponses = entry.result.responses.filter((r) => r.type !== 'dhikr');
            return (
              <div key={hIdx} className="space-y-4">
                {/* User message */}
                <div className="flex justify-start">
                  <div className="bg-brand-gold/15 border border-brand-gold/30 rounded-2xl rounded-tr-sm px-5 py-3 max-w-[85%]">
                    <p className="text-brand-cream leading-7">{entry.question}</p>
                  </div>
                </div>

                {/* Companion response */}
                <div className="flex justify-end">
                  <div className="space-y-3 max-w-[92%] w-full">
                    {entry.result.error ? (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
                        <p className="text-red-300">{entry.result.error}</p>
                      </div>
                    ) : (
                      <>
                        {entry.result.feeling && entry.result.feeling !== 'عام' && (
                          <p className="text-xs text-brand-cream/40 text-left">
                            يبدو أنك تمر بحالة من {FEELING_LABELS[entry.result.feeling] ?? entry.result.feeling}
                          </p>
                        )}
                        {entry.result.aiAdvice && (
                          <div className="bg-brand-gold/10 border border-brand-gold/30 rounded-2xl rounded-tl-sm p-5 space-y-2">
                            <p className="text-brand-gold font-semibold text-sm">الرفيق الروحاني</p>
                            <p className="text-brand-cream leading-8 whitespace-pre-wrap">{entry.result.aiAdvice}</p>
                          </div>
                        )}
                        {mainResponses.map((r, i) => (
                          <div key={i} className="bg-black/30 border border-brand-gold/20 rounded-2xl p-5 space-y-2">
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
                          <div className="bg-black/30 border border-brand-gold/20 rounded-2xl p-5 space-y-3">
                            <p className="text-brand-gold/80 text-sm font-semibold">أذكار مقترحة لك</p>
                            <div className="flex flex-wrap gap-2">
                              {dhikrResponses.map((r, i) => (
                                <span key={i} className="bg-brand-gold/10 text-brand-cream px-3 py-2 rounded-lg text-sm">
                                  {r.content}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {isPending && (
            <div className="flex justify-end">
              <div className="bg-brand-gold/10 border border-brand-gold/30 rounded-2xl px-5 py-3">
                <p className="text-brand-cream/60 animate-pulse">الرفيق يفكر ويبحث لك...</p>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </section>
      )}

      {/* Input */}
      <Card className="p-6 space-y-3 sticky bottom-4 backdrop-blur">
        <textarea
          placeholder="اكتب مشاعرك أو ما يدور في قلبك هنا..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing && e.keyCode !== 229) {
              e.preventDefault();
              handleAsk();
            }
          }}
          className="w-full h-20 p-4 bg-black/30 border border-brand-gold/30 rounded-lg text-brand-cream focus:outline-none focus:border-brand-gold resize-none leading-relaxed"
          aria-label="اكتب مشاعرك أو سؤالك"
        />
        <div className="flex gap-2">
          <Button onClick={() => handleAsk()} variant="primary" className="flex-1" disabled={isPending || !question.trim()}>
            {isPending ? 'جارٍ البحث...' : 'أرسل للرفيق'}
          </Button>
          {history.length > 0 && (
            <Button variant="secondary" onClick={() => setHistory([])} disabled={isPending}>
              محادثة جديدة
            </Button>
          )}
        </div>
      </Card>
    </Container>
  );
}
