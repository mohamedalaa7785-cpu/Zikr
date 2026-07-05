'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

type QuizQuestion = {
  text: string;
  options: string[];
  correctAnswer: number;
};

type QuizData = {
  questions: QuizQuestion[];
};

interface KidsContent {
  id: string;
  title_ar: string;
  title_en: string;
  content_ar?: string;
  content_en?: string;
  type: string;
  age_group: string;
  featured_image_url?: string;
  video_url?: string;
  quiz_data?: unknown;
}

const typeLabels: Record<string, string> = {
  story: 'قصة',
  prayer: 'دعاء',
  wudu: 'الوضوء',
  quiz: 'اختبار',
  game: 'لعبة',
  video: 'فيديو',
};

function isQuizQuestion(value: unknown): value is QuizQuestion {
  if (!value || typeof value !== 'object') return false;
  const q = value as Partial<QuizQuestion>;
  return (
    typeof q.text === 'string' &&
    Array.isArray(q.options) &&
    q.options.every((o) => typeof o === 'string') &&
    typeof q.correctAnswer === 'number'
  );
}

function getQuizQuestions(quizData: unknown): QuizQuestion[] {
  if (!quizData || typeof quizData !== 'object') return [];
  const d = quizData as Partial<QuizData>;
  if (!Array.isArray(d.questions)) return [];
  return d.questions.filter(isQuizQuestion);
}

export default function KidsDetailPage() {
  const params = useParams();
  const rawSlug = params.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;
  const [content, setContent] = useState<KidsContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const quizQuestions = useMemo(() => getQuizQuestions(content?.quiz_data), [content?.quiz_data]);

  useEffect(() => {
    const fetchContent = async () => {
      if (!slug) { setLoading(false); return; }
      try {
        setLoading(true);
        setContent(null);
        setQuizAnswers({});
        setQuizSubmitted(false);
        const { data } = await supabase
          .from('kids_content')
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .limit(1)
          .single();
        setContent(data ?? null);
      } catch {
        setContent(null);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [slug, supabase]);

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    if (!quizSubmitted) {
      setQuizAnswers((cur) => ({ ...cur, [questionIndex]: answerIndex }));
    }
  };

  const calculateQuizScore = () => {
    if (quizQuestions.length === 0) return 0;
    const correct = quizQuestions.filter((q, i) => quizAnswers[i] === q.correctAnswer).length;
    return Math.round((correct / quizQuestions.length) * 100);
  };

  if (loading) {
    return <Container className="py-12"><p className="text-center text-brand-cream/70">جاري التحميل...</p></Container>;
  }
  if (!content) {
    return <Container className="py-12"><p className="text-center text-brand-cream/70">لم يتم العثور على المحتوى</p></Container>;
  }

  return (
    <Container className="py-12 space-y-8 max-w-3xl">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-brand-gold">{content.title_ar}</h1>
        <div className="flex justify-center gap-3">
          <span className="px-3 py-1 bg-brand-gold/20 text-brand-gold rounded-full">
            {typeLabels[content.type] ?? 'محتوى'}
          </span>
        </div>
      </div>

      {content.featured_image_url && (
        <div className="w-full h-96 rounded-lg overflow-hidden">
          <img src={content.featured_image_url} alt={content.title_ar} className="w-full h-full object-cover" />
        </div>
      )}

      {content.type === 'video' && content.video_url && (
        <div className="w-full aspect-video rounded-lg overflow-hidden">
          <iframe width="100%" height="100%" src={content.video_url} title={content.title_ar}
            frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        </div>
      )}

      {content.content_ar && (
        <Card className="p-8 bg-black/30 border-brand-gold/30">
          <p dir="rtl" className="whitespace-pre-wrap text-lg text-brand-cream leading-relaxed">
            {content.content_ar}
          </p>
        </Card>
      )}

      {content.type === 'quiz' && (
        <Card className="p-8 space-y-6 bg-black/30 border-brand-gold/30">
          <h2 className="text-2xl font-bold text-brand-gold text-center">اختبر معلوماتك</h2>
          {quizQuestions.length === 0 ? (
            <p className="text-center text-brand-cream/60">لا توجد أسئلة صالحة لهذا الاختبار حاليًا.</p>
          ) : (
            <>
              <div className="space-y-6">
                {quizQuestions.map((question, qIdx) => (
                  <div key={qIdx} className="space-y-3 p-4 border border-brand-gold/20 rounded-lg">
                    <p className="font-bold text-brand-gold text-lg">{qIdx + 1}. {question.text}</p>
                    <div className="space-y-2">
                      {question.options.map((option, oIdx) => (
                        <button
                          key={oIdx}
                          onClick={() => handleQuizAnswer(qIdx, oIdx)}
                          disabled={quizSubmitted}
                          className={`w-full p-3 text-right rounded-lg border transition-colors ${
                            quizSubmitted && oIdx === question.correctAnswer
                              ? 'bg-green-500/30 border-green-500'
                              : quizSubmitted && quizAnswers[qIdx] === oIdx
                              ? 'bg-red-500/30 border-red-500'
                              : quizAnswers[qIdx] === oIdx
                              ? 'bg-brand-gold/30 border-brand-gold'
                              : 'bg-black/30 border-brand-gold/20 hover:border-brand-gold/50'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {!quizSubmitted ? (
                <Button onClick={() => setQuizSubmitted(true)} className="w-full" variant="primary">
                  تقديم الإجابات
                </Button>
              ) : (
                <div className="text-center space-y-3 p-4 bg-brand-gold/10 rounded-lg">
                  <p className="text-2xl font-bold text-brand-gold">النتيجة: {calculateQuizScore()}%</p>
                  <Button onClick={() => { setQuizAnswers({}); setQuizSubmitted(false); }} variant="outline">
                    إعادة المحاولة
                  </Button>
                </div>
              )}
            </>
          )}
        </Card>
      )}

      <Card className="p-6 text-center space-y-3 bg-brand-gold/10">
        <h3 className="text-xl font-bold text-brand-gold">تعلم بسهولة</h3>
        <p className="text-brand-cream/90">
          هذا المحتوى مصمم خصيصاً لمساعدتك على تعلم أساسيات الإسلام بطريقة ممتعة وسهلة
        </p>
      </Card>
    </Container>
  );
}
