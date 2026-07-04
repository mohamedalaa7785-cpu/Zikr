'use client';

import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/ui/section-header';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function SpiritualAIPage() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState<string | null>(null);

  const handleAsk = async () => {
    if (!question.trim()) return;
    
    // Mock response - in production this would call an AI API
    setResponse('الحمد لله على جميع أحوالك. نصيحتي لك هي: ');
  };

  return (
    <Container className="py-12 space-y-10">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-brand-gold">الذكاء الاصطناعي الإسلامي</h1>
        <p className="max-w-2xl mx-auto text-lg leading-8 arabic-muted">
          اسأل أسئلتك الدينية والروحية والحصول على إجابات من القرآن والسنة
        </p>
      </section>

      <Card className="p-8 space-y-6">
        <h2 className="text-2xl font-bold text-brand-gold">استشر الذكاء الإسلامي</h2>
        
        <div className="space-y-3">
          <textarea
            placeholder="اسأل سؤالك الديني أو الروحي..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full h-24 p-4 bg-black/30 border border-brand-gold/30 rounded text-brand-cream focus:outline-none focus:border-brand-gold resize-none"
          />
          <Button onClick={handleAsk} variant="primary" className="w-full">
            اسأل
          </Button>
        </div>

        {response && (
          <div className="bg-brand-gold/10 border border-brand-gold/30 rounded p-4 space-y-2">
            <p className="text-brand-gold font-semibold">الإجابة:</p>
            <p className="text-brand-cream leading-8">{response}</p>
          </div>
        )}
      </Card>

      <section className="space-y-6">
        <SectionHeader title="أمثلة أسئلة" />
        <div className="grid gap-4 md:grid-cols-2">
          {[
            'كيف أتقرب إلى الله أكثر؟',
            'ما حكم الزكاة والصدقة؟',
            'كيف أحافظ على صلاتي؟',
            'ما أفضل الأذكار اليومية؟',
          ].map((q, i) => (
            <Card 
              key={i}
              className="p-4 cursor-pointer hover:border-brand-gold/50 transition-all"
              onClick={() => {
                setQuestion(q);
                setResponse(null);
              }}
            >
              <p className="text-brand-cream hover:text-brand-gold transition-colors">{q}</p>
            </Card>
          ))}
        </div>
      </section>
    </Container>
  );
}
