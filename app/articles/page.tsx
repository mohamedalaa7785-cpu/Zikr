'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

interface ArticleCategory {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  icon?: string;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  author?: string;
  featured_image_url?: string;
  views: number;
  created_at: string;
}

export default function ArticlesPage() {
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  // Default to 'all' so articles load even when no categories are configured.
  const [selectedCategory, setSelectedCategory] = useState<string | null>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories
        const categoriesData = await supabase.request<ArticleCategory[]>(
          '/rest/v1/article_categories?select=*&published=eq.true'
        );

        if (categoriesData) {
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      if (!selectedCategory) return;

      try {
        let query = '/rest/v1/articles?select=*&published=eq.true&order=created_at.desc';

        if (selectedCategory !== 'all') {
          query += `&category_id=eq.${selectedCategory}`;
        }

        if (searchQuery) {
          query += `&title=ilike.%${searchQuery}%`;
        }

        const data = await supabase.request<Article[]>(query);
        setArticles(data || []);
      } catch (error) {
        console.error('Error fetching articles:', error);
        setArticles([]);
      }
    };

    fetchArticles();
  }, [selectedCategory, searchQuery]);

  return (
    <Container className="py-12 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-brand-gold">المقالات الإسلامية</h1>
        <p className="text-brand-cream/70 max-w-2xl mx-auto">
          مقالات قيمة عن الإسلام والعقيدة والتطبيق العملي
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex justify-center">
        <Input
          type="text"
          placeholder="ابحث عن مقالة..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Categories */}
      {!loading && categories.length > 0 && (
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            variant={selectedCategory === 'all' ? 'primary' : 'outline'}
            onClick={() => setSelectedCategory('all')}
          >
            الكل
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? 'primary' : 'outline'}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.icon && <span className="mr-2">{cat.icon}</span>}
              {cat.name_ar}
            </Button>
          ))}
        </div>
      )}

      {/* Articles Grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-brand-cream/70">جاري التحميل...</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-brand-cream/70">لا توجد مقالات في هذه الفئة</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link key={article.id} href={`/articles/${article.slug}`}>
              <Card className="h-full p-6 space-y-4 hover:border-brand-gold/50 transition-colors cursor-pointer flex flex-col">
                {article.featured_image_url && (
                  <div className="w-full h-40 bg-brand-gold/10 rounded-lg overflow-hidden">
                    <img
                      src={article.featured_image_url}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <h3 className="text-xl font-bold text-brand-gold">{article.title}</h3>
                {article.summary && (
                  <p className="text-brand-cream/80 line-clamp-2 flex-1">
                    {article.summary}
                  </p>
                )}
                <div className="flex justify-between items-center text-xs text-brand-cream/60 pt-4 border-t border-brand-gold/20">
                  {article.author && <span>{article.author}</span>}
                  <span>👁 {article.views}</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </Container>
  );
}
