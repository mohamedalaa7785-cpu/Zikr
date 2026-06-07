import { getStoryBySlug } from "@/lib/services/stories";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface StoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);

  if (!story) {
    notFound();
  }

  const youtubeId =
    typeof story.metadata?.youtubeId === "string"
      ? story.metadata.youtubeId
      : null;

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Button href="/stories" variant="ghost" className="mb-6">
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Stories
      </Button>

      <div className="flex flex-col gap-8">
        <div className="space-y-4">
          <Badge>{story.category}</Badge>
          <h1 className="text-4xl font-bold">{story.title}</h1>
          <p className="text-xl text-muted-foreground">{story.summary}</p>
        </div>

        {youtubeId && (
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
        )}

        <div className="prose prose-lg dark:prose-invert max-w-none whitespace-pre-wrap">
          {story.content}
        </div>
      </div>
    </div>
  );
}
