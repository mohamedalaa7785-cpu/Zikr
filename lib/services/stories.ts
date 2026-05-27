import { supabaseServerAnonRequest } from '@/lib/supabase/server';
import { ServiceError } from '@/lib/types/common';

export type StoryCategory = 'prophets' | 'sahaba' | 'documentaries' | 'history';

export interface Story {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: StoryCategory;
  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const FALLBACK_STORIES: Story[] = [
  { id: '1', slug: 'story-of-musa', title: 'Story of Musa', summary: 'Patience and trust in Allah.', category: 'prophets', published: true },
  { id: '2', slug: 'abu-bakr-siddiq', title: 'Abu Bakr As-Siddiq', summary: 'Companionship and sacrifice.', category: 'sahaba', published: true },
  { id: '3', slug: 'andalus-documentary', title: 'Andalus Documentary', summary: 'Islamic civilization journey.', category: 'documentaries', published: true },
];

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
let cachedStories: { data: Story[]; timestamp: number } | null = null;

export async function getStories(): Promise<Story[]> {
  try {
    // Use cache if fresh
    if (cachedStories && Date.now() - cachedStories.timestamp < CACHE_TTL) {
      return cachedStories.data;
    }

    const response = await supabaseServerAnonRequest<Story[]>(
      '/rest/v1/stories?select=id,slug,title,summary,category,published,created_at,updated_at&published=eq.true&limit=100&order=created_at.desc',
      { cache: 'force-cache', next: { revalidate: 1800 } },
    );

    // Type validation
    if (!Array.isArray(response)) {
      console.warn('[stories] Invalid response type from Supabase, got:', typeof response);
      cachedStories = { data: FALLBACK_STORIES, timestamp: Date.now() };
      return FALLBACK_STORIES;
    }

    if (response.length === 0) {
      console.warn('[stories] Supabase returned empty array, using fallback');
      cachedStories = { data: FALLBACK_STORIES, timestamp: Date.now() };
      return FALLBACK_STORIES;
    }

    // Validate response shape
    const validated = response.every(
      (item: any) => item.id && item.slug && item.title && item.summary && item.category,
    );

    if (!validated) {
      console.warn('[stories] Response validation failed, using fallback');
      cachedStories = { data: FALLBACK_STORIES, timestamp: Date.now() };
      return FALLBACK_STORIES;
    }

    cachedStories = { data: response, timestamp: Date.now() };
    return response;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('[stories] Failed to fetch from Supabase:', errorMsg);

    if (error instanceof ServiceError) {
      console.error('[stories] Service error code:', error.code, 'Status:', error.statusCode);
    }

    return FALLBACK_STORIES;
  }
}

export async function getStoryBySlug(slug: string): Promise<Story | null> {
  const stories = await getStories();
  const story = stories.find((s) => s.slug === slug);
  return story || null;
}

export async function getStoriesByCategory(category: StoryCategory): Promise<Story[]> {
  const stories = await getStories();
  return stories.filter((s) => s.category === category);
}

export async function getStoriesByIds(ids: string[]): Promise<Story[]> {
  if (!ids || ids.length === 0) return [];
  const stories = await getStories();
  return stories.filter((s) => ids.includes(s.id));
}
