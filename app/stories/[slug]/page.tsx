import { getStoryBySlug } from '@/lib/services/stories';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

interface StoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);

  if (!story) {
    notFound();
  }

  // In a real scenario, the YouTube ID would come from the story object or metadata
  // For now, we use a placeholder if not present
  const youtubeId = (story as any).youtubeId || 'dQw4w9WgXcQ'; 

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Link href="/stories">
        <Button variant="ghost" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Stories
        </Button>
      </Link>

      <div className="flex flex-col gap-8">
        <div className="space-y-4">
          <Badge>{story.category}</Badge>
          <h1 className="text-4xl font-bold">{story.title}</h1>
          <p className="text-xl text-muted-foreground">{story.summary}</p>
        </div>

        <div className="aspect-video w-full overflow-hidden rounded-xl bg-muted shadow-lg">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title={story.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          ></iframe>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          {/* This would be the story content if available in the DB */}
          <p>
            This story provides deep insights into the life and teachings of Islamic history. 
            Watch the video above for a comprehensive documentary on this subject.
          </p>
        </div>
      </div>
    </div>
  );
}
