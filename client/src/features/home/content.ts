import { BookOpen, Brain, Clock3, Headphones, Radio, Search, Sparkles, Users } from 'lucide-react';
import type { PreviewCard } from '@/types/home';

export const topNavItems = ['Quran', 'Hadith', 'Stories', 'AI', 'Community'];

export const heroPillars = [
  { label: 'Prayer countdown placeholder', icon: Clock3 },
  { label: 'Search placeholder UI', icon: Search },
  { label: 'Audio controls placeholder', icon: Headphones },
  { label: 'Islamic radio preview', icon: Radio },
];

export const previewCards: PreviewCard[] = [
  { title: 'Quran Preview', description: 'Prepared cards for recitation, tafsir, bookmarks, and listening states.', icon: BookOpen },
  { title: 'Stories Preview', description: 'Narrative-first section structure for prophetic stories and reflections.', icon: Sparkles },
  { title: 'AI Assistant Preview', description: 'Composable UI shell for spiritual Q&A and mindful prompts.', icon: Brain },
  { title: 'Scholars Preview', description: 'Curated scholars discovery shell with future filters and profiles.', icon: Users },
  { title: 'Floating Dhikr UI', description: 'Reusable floating overlay structure for future remembrance sessions.', icon: Sparkles },
  { title: 'Dynamic Themes', description: 'Theme hooks for cinematic ambiance and accessibility-aware contrast.', icon: Clock3 },
];
