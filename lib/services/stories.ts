import { supabaseServerAnonRequest } from '@/lib/supabase/server';

export type StoryCategory = 'prophets' | 'sahaba' | 'documentaries' | 'history';

export interface Story {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: StoryCategory;
}

const FALLBACK_STORIES: Story[] = [
  { id: '1', slug: 'story-of-musa', title: 'Story of Musa', summary: 'Patience and trust in Allah.', category: 'prophets' },
  { id: '2', slug: 'abu-bakr-siddiq', title: 'Abu Bakr As-Siddiq', summary: 'Companionship and sacrifice.', category: 'sahaba' },
  { id: '3', slug: 'andalus-documentary', title: 'Andalus Documentary', summary: 'Islamic civilization journey.', category: 'documentaries' },
];

export async function getStories(): Promise<Story[]> {
  try {
    const data = await supabaseServerAnonRequest<Story[]>('/rest/v1/stories?select=id,slug,title,summary,category&published=eq.true');
    return data?.length ? data : FALLBACK_STORIES;
  } catch {
    return FALLBACK_STORIES;
  }
}

export async function getStoryBySlug(slug: string): Promise<Story | null> {
  const stories = await getStories();
  return stories.find((s) => s.slug === slug) ?? null;
}

export async function getStoriesByCategory(category: StoryCategory): Promise<Story[]> {
  const stories = await getStories();
  return stories.filter((s) => s.category === category);
}
