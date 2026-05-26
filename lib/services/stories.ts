export type StoryCategory = 'prophets' | 'sahaba' | 'documentaries' | 'history';

export interface Story {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: StoryCategory;
}

const STORIES: Story[] = [
  { id: '1', slug: 'story-of-musa', title: 'Story of Musa', summary: 'Patience and trust in Allah.', category: 'prophets' },
  { id: '2', slug: 'abu-bakr-siddiq', title: 'Abu Bakr As-Siddiq', summary: 'Companionship and sacrifice.', category: 'sahaba' },
  { id: '3', slug: 'andalus-documentary', title: 'Andalus Documentary', summary: 'Islamic civilization journey.', category: 'documentaries' },
];

export async function getStories(): Promise<Story[]> { return STORIES; }
export async function getStoryBySlug(slug: string): Promise<Story | null> { return STORIES.find((s) => s.slug === slug) ?? null; }
export async function getStoriesByCategory(category: StoryCategory): Promise<Story[]> { return STORIES.filter((s) => s.category === category); }

// Future roadmap:
// - Move stories to Supabase content tables.
// - Add bookmark/progress tracking per user.
