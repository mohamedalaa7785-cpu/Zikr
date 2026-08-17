'use client';
export const dynamic = 'force-dynamic';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { getStaticArticleBySlug } from '@/lib/data/articles';

interface Article {
  id: string;
  slug: string;
  title: string;
  content: string;
  summary?: string;
  author?: string;
  featured_image_url?: string | null;
  tags?: string[];
  views: number;
  created_at: string;
  published?: boolean;
  metadata?: {
    references?: Array<{
      url?: string;
      title_ar?: string;
      source_type?: string;
    }>;
  };
}

type ArticleReference = {
  url: string;
  title: string;
  sourceType?: string;
};

function getArticleReferences(metadata: Article['metadata']): ArticleReference[] {
  if (!Array.isArray(metadata?.references)) return [];

  return metadata.references.flatMap((reference) => {
    if (typeof reference?.url !== 'string') return [];
    try {
      const parsed = new URL(reference.url);
      if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return [];
      return [{
        url: parsed.toString(),
        title: typeof reference.title_ar === 'string' && reference.title_ar.trim()
          ? reference.title_ar
          : 'فتح المصدر للتحقق',
        sourceType: typeof reference.source_type === 'string' ? reference.source_type : undefined,
      }];
    } catch {
      return [];
    }
  });
}

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!slug) return;

    const fetchArticle = async () => {
      setLoading(true);

      try {
        const supabase = createBrowserSupabaseClient();
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .limit(1)
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          setArticle(getStaticArticleBySlug(slug));
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
        setArticle(getStaticArticleBySlug(slug));
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

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

  const references = getArticleReferences(article.metadata);

  return (
    <Container className="py-12 space-y-8 max-w-3xl">
      {article.featured_image_url && (
        <div className="w-full h-96 rounded-lg overflow-hidden">
          <Image
            src={article.featured_image_url}
            width={800}
            height={384}
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
        <div className="prose prose-invert max-w-none text-brand-cream leading-relaxed whitespace-pre-wrap">
          {article.content}
        </div>
      </Card>

      {references.length > 0 && (
        <section
          aria-labelledby="article-references"
          className="rounded-3xl border border-brand-gold/20 bg-black/20 p-6"
        >
          <h2 id="article-references" className="text-xl font-bold text-brand-gold">
            المراجع ومصادر التحقق
          </h2>
          <ol className="mt-4 space-y-3 text-sm leading-7 text-brand-cream/80">
            {references.map((reference, index) => (
              <li key={`${reference.url}-${index}`}>
                <a
                  href={reference.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-gold underline decoration-brand-gold/50 underline-offset-4 hover:text-brand-cream"
                >
                  {reference.title}
                </a>
                {reference.sourceType && (
                  <span className="ms-2 text-brand-cream/50">({reference.sourceType})</span>
                )}
              </li>
            ))}
          </ol>
        </section>
      )}

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
