import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Play } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { usePageSEO, seoBaseUrl } from "@/lib/seoHead";

type Language = "en" | "ar";

const translations = {
  en: {
    title: "Video Essays",
    subtitle: "Watch long-form historical explainers and source-driven documentary narratives.",
    latest: "Latest videos",
    channel: "Visit YouTube Channel",
    noVideos: "No public videos are available yet. Explore episodes while we prepare the next release.",
    episodes: "Explore Episodes",
  },
  ar: {
    title: "مقالات فيديو",
    subtitle: "شاهد تحليلات تاريخية طويلة وسردًا وثائقيًا قائمًا على المصادر.",
    latest: "أحدث الفيديوهات",
    channel: "زيارة قناة يوتيوب",
    noVideos: "لا توجد فيديوهات منشورة حاليًا. يمكنك استكشاف الحلقات حتى الإصدار القادم.",
    episodes: "استكشف الحلقات",
  },
};

export default function Videos() {
  const [language, setLanguage] = useState<Language>("en");
  const [, navigate] = useLocation();
  const { data = [], isLoading } = trpc.youtube.getVideos.useQuery({ maxResults: 9 });
  const t = translations[language];

  usePageSEO({
    title: "Videos | ZIKR | ذِكرٌ",
    description: "Documentary-style historical video essays from ZIKR | ذِكرٌ.",
    path: "/videos",
    keywords: ["history videos", "documentary essays", "historical analysis"],
    language,
    schema: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "ZIKR | ذِكرٌ Video Essays",
      url: `${seoBaseUrl}/videos`,
      inLanguage: language === "en" ? "en-US" : "ar-EG",
    },
  });

  const videos = useMemo(
    () => data.filter((v) => v.id && v.id !== "dQw4w9WgXcQ" && v.id !== "jNQXAC9IVRw"),
    [data],
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <Play className="text-amber-500" />
              <h1 className="text-3xl font-bold text-amber-300 md:text-4xl">{t.title}</h1>
            </div>
            <p className="text-slate-300">{t.subtitle}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setLanguage(language === "en" ? "ar" : "en")} className="border-amber-700 text-amber-300">
              {language === "en" ? "العربية" : "English"}
            </Button>
            <Button onClick={() => navigate("/episodes")} className="bg-amber-600 text-black hover:bg-amber-700">{t.episodes}</Button>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-amber-300">{t.latest}</h2>
          <a href="https://www.youtube.com/@hiddennarrativesbymuhammed" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-amber-400 hover:text-amber-300">
            {t.channel} ↗
          </a>
        </div>

        {isLoading ? (
          <p className="text-slate-300">Loading videos...</p>
        ) : videos.length === 0 ? (
          <Card className="border-amber-900/30 bg-slate-900/70"><CardContent className="pt-6 text-slate-300">{t.noVideos}</CardContent></Card>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <Card key={video.id} className="overflow-hidden border-amber-900/30 bg-slate-900/70">
                <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    className="absolute left-0 top-0 h-full w-full"
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-2 text-amber-300">{video.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 text-sm text-slate-300">{video.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
