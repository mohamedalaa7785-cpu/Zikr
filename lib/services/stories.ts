import type { ServiceResult } from "@/lib/types/common";

export type StoryCategory = "prophets" | "sahaba" | "documentaries" | "history";

export interface Story {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: StoryCategory;
}

const STORIES: Story[] = [
  { id: "1", slug: "yusuf", title: "Story of Prophet Yusuf", summary: "Patience and trust in Allah.", category: "prophets" },
  { id: "2", slug: "umar", title: "Omar ibn Al-Khattab", summary: "Justice and leadership.", category: "sahaba" },
  { id: "3", slug: "andalus", title: "History of Al-Andalus", summary: "Civilizational rise and legacy.", category: "history" },
  { id: "4", slug: "jerusalem-doc", title: "Jerusalem Documentary", summary: "Timeline of Al-Quds.", category: "documentaries" },
];

export async function getStories(): Promise<ServiceResult<Story[]>> {
  return { data: STORIES, error: null, fetchedAt: new Date().toISOString(), fromCache: true };
}

export async function getStoryBySlug(slug: string): Promise<ServiceResult<Story>> {
  return { data: STORIES.find((s) => s.slug === slug) ?? null, error: null, fetchedAt: new Date().toISOString(), fromCache: true };
}

export async function getStoriesByCategory(category: StoryCategory): Promise<ServiceResult<Story[]>> {
  return { data: STORIES.filter((s) => s.category === category), error: null, fetchedAt: new Date().toISOString(), fromCache: true };
}
