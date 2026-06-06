'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

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
  quiz_data?: any;
}

const typeLabels: Record<string, string> = {
  story: '📖 قصة',
  prayer: '🤲 دعاء',
  wudu: '💧 الوضوء',
  quiz: '❓ اختبار',
  game: '🎮 لعبة',
  video: '🎬 فيديو',
};

export default function KidsDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [content, setContent] = useState<KidsContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const data = await supabase.request<KidsContent[]>(
          `/rest/v1/kids_content?select=*&slug=eq.${slug}&published=eq.true&limit=1`
        );

        if (data && data.length > 0) {
          setContent(data[0]);
        }
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchContent();
    }
  }, [slug]);

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    if (!quizSubmitted) {
      setQuizAnswers({
        ...quizAnswers,
        [questionIndex]: answerIndex,
      });
    }
  };

  const calculateQuizScore = () => {
    if (!content?.quiz_data?.questions) return 0;
    let correct = 0;
    content.quiz_data.questions.forEach((q: any, idx: number) => {
      if (quizAnswers[idx] === q.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / content.quiz_data.questions.length) * 100);
  };

  if (loading) {
    return (
      <Container className="py-12">
        <p className="text-center text-brand-cream/70">جاري التحميل...</p>
      </Container>
    );
  }

  if (!content) {
    return (
      <Container className="py-12">
        <p className="text-center text-brand-cream/70">لم يتم العثور على المحتوى</p>
      </Container>
    );
  }

  return (
    <Container className="py-12 space-y-8 max-w-3xl">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-brand-gold">{content.title_ar}</h1>
        <div className="flex justify-center gap-3">
          <span className="px-3 py-1 bg-brand-gold/20 text-brand-gold rounded-full">
            {typeLabels[content.type]}
          </span>
        </div>
      </div>

      {content.featured_image_url && (
        <div className="w-full h-96 rounded-lg overflow-hidden">
          <img
            src={content.featured_image_url}
            alt={content.title_ar}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Video Content */}
      {content.type === 'video' && content.video_url && (
        <div className="w-full aspect-video rounded-lg overflow-hidden">
          <iframe
            width="100%"
            height="100%"
            src={content.video_url}
            title={content.title_ar}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {/* Text Content */}
      {content.content_ar && (
        <Card className="p-8 space-y-6 bg-black/30 border-brand-gold/30">
          <div className="prose prose-invert max-w-none text-brand-cream leading-relaxed text-lg">
            <p dir="rtl" className="whitespace-pre-wrap">
              {content.content_ar}
            </p>
          </div>
        </Card>
      )}

      {/* Quiz Content */}
      {content.type === 'quiz' && content.quiz_data?.questions && (
        <Card className="p-8 space-y-6 bg-black/30 border-brand-gold/30">
          <h2 className="text-2xl font-bold text-brand-gold text-center">اختبر معلوماتك</h2>
          
          <div className="space-y-6">
            {content.quiz_data.questions.map((question: any, qIdx: number) => (
              <div key={qIdx} className="space-y-3 p-4 border border-brand-gold/20 rounded-lg">
                <p className="font-bold text-brand-gold text-lg">{qIdx + 1}. {question.text}</p>
                <div className="space-y-2">
                  {question.options.map((option: string, oIdx: number) => (
                    <button
                      key={oIdx}
                      onClick={() => handleQuizAnswer(qIdx, oIdx)}
                      disabled={quizSubmitted}
                      className={`w-full p-3 text-right rounded-lg transition-colors ${
                        quizAnswers[qIdx] === oIdx
                          ? 'bg-brand-gold/30 border-brand-gold'
                          : 'bg-black/30 border-brand-gold/20 hover:border-brand-gold/50'
                      } border ${
                        quizSubmitted && oIdx === question.correctAnswer
                          ? 'bg-green-500/30 border-green-500'
                          : quizSubmitted && quizAnswers[qIdx] === oIdx && oIdx !== question.correctAnswer
                          ? 'bg-red-500/30 border-red-500'
                          : ''
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
            <Button
              onClick={() => setQuizSubmitted(true)}
              className="w-full"
              variant="primary"
            >
              تقديم الإجابات
            </Button>
          ) : (
            <div className="text-center space-y-3 p-4 bg-brand-gold/10 rounded-lg">
              <p className="text-2xl font-bold text-brand-gold">
                النتيجة: {calculateQuizScore()}%
              </p>
              <Button
                onClick={() => {
                  setQuizAnswers({});
                  setQuizSubmitted(false);
                }}
                variant="outline"
              >
                إعادة المحاولة
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Educational Message */}
      <Card className="p-6 text-center space-y-3 bg-brand-gold/10">
        <h3 className="text-xl font-bold text-brand-gold">✨ تعلم بسهولة</h3>
        <p className="text-brand-cream/90">
          هذا المحتوى مصمم خصيصاً لمساعدتك على تعلم أساسيات الإسلام بطريقة ممتعة وسهلة
        </p>
      </Card>
    </Container>
  );
}
