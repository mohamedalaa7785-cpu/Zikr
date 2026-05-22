import { useEffect, useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BookOpen, Search } from "lucide-react";
import { useLocation } from "wouter";
import { useBehaviorTracker } from "@/hooks/useBehaviorTracker";
import { seoBaseUrl, usePageSEO } from "@/lib/seoHead";

const categoryOptions = ["all", "dark", "romantic", "psychological"] as const;

export default function Episodes() {
  useBehaviorTracker("/episodes");
  const [language, setLanguage] = useState<"en" | "ar">("en");
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<(typeof categoryOptions)[number]>("all");
  const [, navigate] = useLocation();

  usePageSEO({
    title: "Episodes | ZIKR | ذِكرٌ",
    description: "Explore long-form historical episodes with source-aware analysis, categorized for deep reading.",
    path: "/episodes",
    language,
    keywords: ["history episodes", "long form history", "historical analysis", "podcast archive"],
    schema: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "ZIKR | ذِكرٌ Episodes",
      url: `${seoBaseUrl}/episodes`,
      inLanguage: language === "en" ? "en-US" : "ar-EG",
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${seoBaseUrl}/` },
          { "@type": "ListItem", position: 2, name: "Episodes", item: `${seoBaseUrl}/episodes` },
        ],
      },
    },
  });

  const { data: episodes, isLoading } = trpc.episodes.list.useQuery();

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("language") : null;
    if (stored === "en" || stored === "ar") setLanguage(stored);
  }, []);

  const filteredEpisodes = useMemo(() => {
    return (
      episodes?.filter((ep: any) => {
        const searchLower = searchTerm.toLowerCase();
        const title = language === "en" ? ep.titleEn : ep.titleAr;
        const description = language === "en" ? ep.descriptionEn : ep.descriptionAr;
        const categoryMatch = category === "all" || (ep.category || "").toLowerCase() === category;
        return categoryMatch && (title?.toLowerCase().includes(searchLower) || description?.toLowerCase().includes(searchLower));
      }) ?? []
    );
  }, [episodes, searchTerm, language, category]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <nav className="sticky top-0 z-50 border-b border-amber-900/30 bg-black/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <button onClick={() => navigate("/")} className="text-2xl font-bold text-amber-600">ZIKR | ذِكرٌ</button>
          <button onClick={() => setLanguage(language === "en" ? "ar" : "en")} className="rounded-full bg-amber-600 px-3 py-1 font-semibold text-black">{language === "en" ? "العربية" : "English"}</button>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-4 pb-8 pt-12">
        <div className="mb-4 flex items-center gap-3"><BookOpen className="text-amber-600" size={32} /><h1 className="text-4xl font-bold text-amber-400">Episodes Archive</h1></div>
        <p className="max-w-4xl text-gray-300">
          Every episode is written as an editorial essay with historical context, institutional analysis, and practical relevance.
          Use filters to browse by theme and read full narratives.
        </p>
      </section>

      <section className="mx-auto max-w-7xl space-y-3 px-4 pb-8">
        <div className="relative"><Search className="absolute left-3 top-3 text-gray-400" size={20} /><Input placeholder="Search episodes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border-amber-900/30 bg-slate-800 pl-10 text-white" /></div>
        <div className="flex flex-wrap gap-2">
          {categoryOptions.map((option) => (
            <Button key={option} variant={category === option ? "default" : "outline"} onClick={() => setCategory(option)}>{option}</Button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16">
        {isLoading ? <div className="text-gray-400">Loading episodes...</div> : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEpisodes.map((episode: any) => (
              <Card key={episode.slug} className="border-amber-900/30 bg-slate-800 transition hover:border-amber-600/50">
                <CardHeader>
                  <CardTitle className="line-clamp-2 text-amber-400">{language === "en" ? episode.titleEn : episode.titleAr}</CardTitle>
                  <CardDescription className="text-gray-400">{episode.category || "historical"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 line-clamp-3 text-gray-300">{language === "en" ? episode.descriptionEn : episode.descriptionAr}</p>
                  <Button onClick={() => navigate(`/episodes/${episode.slug}`)} className="w-full bg-amber-600 font-bold text-black hover:bg-amber-700">Read Episode</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
