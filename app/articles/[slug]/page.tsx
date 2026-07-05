'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

interface Article {
  id: string;
  slug: string;
  title: string;
  content: string;
  summary?: string;
  author?: string;
  featured_image_url?: string;
  tags?: string[];
  views: number;
  created_at: string;
  published?: boolean;
}

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    if (!slug) return;

    const fetchArticle = async () => {
      setLoading(true);

      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .limit(1)
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          setArticle(null);
          return;
        }

        setArticle(data);

        // Increment views
        const newViews = (data.views ?? 0) + 1;

        await supabase
          .from('articles')
          .update({ views: newViews })
          .eq('id', data.id);

        setArticle({
          ...data,
          views: newViews,
        });
      } catch (error) {
        console.error('Error fetching article:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug, supabase]);

  if (loading) {
    return (
      <Container className="py-12">
        <p className="text-center text-brand-cream/70">
          جاري التحميل...
        </p>
      </Container>
    );
  }

  if (!article) {
    return (
      <Container className="py-12">
        <p className="text-center text-brand-cream/70">
          لم يتم العثور على المقالة
        </p>
      </Container>
    );
  }

  return (
    <Container className="py-12 space-y-8 max-w-3xl">
      {article.featured_image_url && (
        <div className="w-full h-96 rounded-lg overflow-hidden">
          <img
            src={article.featured_image_url}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-brand-gold">
          {article.title}
        </h1>

        {article.summary && (
          <p className="text-brand-cream/70 text-lg">
            {article.summary}
          </p>
        )}

        <div className="flex justify-center gap-6 text-sm text-brand-cream/60">
          {article.author && (
            <span>الكاتب: {article.author}</span>
          )}

          <span>👁 {article.views}</span>

          <span>
            {new Date(article.created_at).toLocaleDateString('ar-SA')}
          </span>
        </div>
      </div>

      <Card className="p-8 space-y-6 bg-black/30 border-brand-gold/30">
        <div
          className="prose prose-invert max-w-none text-brand-cream leading-relaxed whitespace-pre-wrap"
          dangerouslySetInnerHTML={{
            __html: article.content.replace(/\n/g, '<br/>'),
          }}
        />
      </Card>

      {article.tags && article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-brand-gold/20 text-brand-gold rounded-full text-sm"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </Container>
  );
    }
