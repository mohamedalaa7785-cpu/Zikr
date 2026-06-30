'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

interface VideoCategory {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  icon?: string;
}

interface Video {
  id: string;
  title: string;
  slug: string;
  description?: string;
  youtube_id?: string;
  thumbnail_url?: string;
  duration?: number;
  views: number;
}

export default function VideosPage() {
  const [categories, setCategories] = useState<VideoCategory[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  // Default to 'all' so videos load even when no categories are configured.
  const [selectedCategory, setSelectedCategory] = useState<string | null>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories
        const categoriesData = await supabase.request<VideoCategory[]>(
          '/rest/v1/video_categories?select=*&published=eq.true'
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
    const fetchVideos = async () => {
      if (!selectedCategory) return;

      try {
        let query = '/rest/v1/videos?select=*&published=eq.true&order=created_at.desc';

        if (selectedCategory !== 'all') {
          query += `&category_id=eq.${selectedCategory}`;
        }

        if (searchQuery) {
          query += `&title=ilike.%${searchQuery}%`;
        }

        const data = await supabase.request<Video[]>(query);
        setVideos(data || []);
      } catch (error) {
        console.error('Error fetching videos:', error);
        setVideos([]);
      }
    };

    fetchVideos();
  }, [selectedCategory, searchQuery]);

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Container className="py-12 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-brand-gold">مكتبة الفيديوهات</h1>
        <p className="text-brand-cream/70 max-w-2xl mx-auto">
          مجموعة متنوعة من الفيديوهات الإسلامية والدروس والمحاضرات
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex justify-center">
        <Input
          type="text"
          placeholder="ابحث عن فيديو..."
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

      {/* Videos Grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-brand-cream/70">جاري التحميل...</p>
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-brand-cream/70">لا توجد فيديوهات في هذه الفئة</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <Link key={video.id} href={`/videos/${video.slug}`}>
              <Card className="h-full overflow-hidden hover:border-brand-gold/50 transition-colors cursor-pointer flex flex-col">
                <div className="relative w-full aspect-video bg-black/50 overflow-hidden group">
                  {video.thumbnail_url ? (
                    <img
                      src={video.thumbnail_url}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : video.youtube_id ? (
                    <img
                      src={`https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-brand-gold/20 to-brand-gold/5 flex items-center justify-center">
                      <span className="text-4xl">🎬</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-4xl">▶</span>
                  </div>
                  {video.duration && (
                    <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white">
                      {formatDuration(video.duration)}
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-2 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-brand-gold line-clamp-2">{video.title}</h3>
                  {video.description && (
                    <p className="text-sm text-brand-cream/70 line-clamp-2 flex-1">
                      {video.description}
                    </p>
                  )}
                  <div className="text-xs text-brand-cream/60 pt-2 border-t border-brand-gold/20">
                    👁 {video.views} مشاهدة
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </Container>
  );
}
