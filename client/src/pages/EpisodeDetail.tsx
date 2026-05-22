import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Bookmark, Share2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Breadcrumb from "@/components/Breadcrumb";
import { useBehaviorTracker } from "@/hooks/useBehaviorTracker";
import { seoBaseUrl, usePageSEO } from "@/lib/seoHead";
import { AdSlot } from "@/components/AdSlot";

const Streamdown = lazy(async () => {
  const mod = await import("streamdown");
  return { default: mod.Streamdown };
});

export default function EpisodeDetail() {
  const [language, setLanguage] = useState<"en" | "ar">("en");
  const [readProgress, setReadProgress] = useState(0);
  const [match, params] = useRoute("/episodes/:slug");
  const [, navigate] = useLocation();
  useBehaviorTracker(`/episodes/${params?.slug ?? ""}`);

  const { data: episode, isLoading } = trpc.episodes.bySlug.useQuery(params?.slug || "", { enabled: Boolean(params?.slug) });
  const { data: allEpisodes } = trpc.episodes.list.useQuery();

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("language") : null;
    if (stored === "en" || stored === "ar") setLanguage(stored);
  }, []);

  const related = useMemo(() => {
    if (!episode || !allEpisodes) return [];
    return allEpisodes
      .filter((ep: any) => ep.slug !== episode.slug)
      .sort((a: any, b: any) => {
        const aScore = Number(a.category === episode.category) + Number((a.keywordsEn || "").includes(episode.keywordsEn || ""));
        const bScore = Number(b.category === episode.category) + Number((b.keywordsEn || "").includes(episode.keywordsEn || ""));
        return bScore - aScore;
      })
      .slice(0, 3);
  }, [episode, allEpisodes]);

  if (!match) return null;
  const content = language === "en" ? episode?.contentEn : episode?.contentAr;
  const title = language === "en" ? episode?.titleEn : episode?.titleAr;
  const description = language === "en" ? episode?.descriptionEn : episode?.descriptionAr;

  usePageSEO({
    title: title ? `${title} | ZIKR | ذِكرٌ` : "Episode | ZIKR | ذِكرٌ",
    description: description || "Long-form historical analysis from ZIKR | ذِكرٌ.",
    path: `/episodes/${params?.slug ?? ""}`,
    language,
    image: `${seoBaseUrl}/api/og/episode/${params?.slug ?? ""}`,
    schema: {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: title,
      description,
      mainEntityOfPage: `${seoBaseUrl}/episodes/${params?.slug}`,
      inLanguage: language === "en" ? "en-US" : "ar-EG",
      author: { "@type": "Organization", name: "ZIKR | ذِكرٌ" },
      publisher: { "@type": "Organization", name: "ZIKR | ذِكرٌ" },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${seoBaseUrl}/` },
          { "@type": "ListItem", position: 2, name: "Episodes", item: `${seoBaseUrl}/episodes` },
          { "@type": "ListItem", position: 3, name: title || "Episode", item: `${seoBaseUrl}/episodes/${params?.slug}` },
        ],
      },
    },
  });

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const percent = Math.min(100, Math.round((h.scrollTop / (h.scrollHeight - h.clientHeight || 1)) * 100));
      setReadProgress(percent);
      if (episode?.slug) {
        localStorage.setItem(`read-progress:${episode.slug}`, String(percent));
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [episode?.slug]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <nav className="fixed top-0 z-50 w-full border-b border-amber-900/30 bg-black/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <button onClick={() => navigate("/")} className="text-2xl font-bold text-amber-600">ZIKR | ذِكرٌ</button>
          <button onClick={() => setLanguage(language === "en" ? "ar" : "en")} className="rounded-full bg-amber-600 px-3 py-1 font-semibold text-black">{language === "en" ? "العربية" : "English"}</button>
        </div>
      </nav>

      <section className="px-4 pb-16 pt-32">
        <div className="mx-auto max-w-4xl">
          <Breadcrumb items={[{ label: "Episodes", href: "/episodes" }, { label: title || "Episode", href: `/episodes/${params?.slug}` }]} language={language} />
          <div className="mb-4 mt-4 h-2 w-full rounded bg-slate-800"><div className="h-2 rounded bg-amber-500" style={{ width: `${readProgress}%` }} /></div>
          <Button onClick={() => navigate("/episodes")} variant="ghost" className="mb-8 text-amber-600 hover:text-amber-400"><ArrowLeft className="mr-2" size={20} />Back to Episodes</Button>

          {isLoading ? <div className="text-center text-gray-400">Loading episode...</div> : !episode ? <div className="text-center text-gray-400">Episode not found.</div> : (
            <>
              <div className="mb-8">
                <AdSlot position="top" />
                <h1 className="mb-4 text-4xl font-bold text-amber-400 md:text-5xl">{title}</h1>
                <p className="mb-6 text-xl text-gray-400">{description}</p>
                <div className="flex gap-4">
                  <Button onClick={() => navigator.clipboard.writeText(window.location.href)} className="bg-amber-600 font-bold text-black hover:bg-amber-700"><Share2 className="mr-2" size={20} />Share</Button>
                  <Button variant="outline" onClick={() => localStorage.setItem(`saved-story:${episode.slug}`, "1")}><Bookmark className="mr-2" size={18} />Save</Button>
                </div>
              </div>

              <Card className="mb-8 border-amber-900/30 bg-slate-800"><CardContent className="pt-6"><article className="prose prose-invert max-w-none leading-relaxed"><Suspense fallback={<Skeleton className="h-52 w-full" />}><Streamdown>{content}</Streamdown></Suspense></article></CardContent></Card>

              <AdSlot position="inline" />

              {related.length > 0 && (
                <div>
                  <h2 className="mb-6 text-2xl font-bold text-amber-400">Related Episodes</h2>
                  <div className="grid gap-6 md:grid-cols-3">
                    {related.map((ep: any) => (
                      <Card key={ep.slug} className="cursor-pointer border-amber-900/30 bg-slate-800 transition hover:border-amber-600/50" onClick={() => navigate(`/episodes/${ep.slug}`)}>
                        <CardHeader><CardTitle className="line-clamp-2 text-amber-400">{language === "en" ? ep.titleEn : ep.titleAr}</CardTitle></CardHeader>
                        <CardContent><p className="line-clamp-2 text-gray-300">{language === "en" ? ep.descriptionEn : ep.descriptionAr}</p></CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              <AdSlot position="sidebar" />
            </>
          )}
        </div>
      </section>
    </div>
  );
}
