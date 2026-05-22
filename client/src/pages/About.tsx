
import { useLocation } from "wouter";
import { usePageSEO } from "@/lib/seoHead";
import { BookOpenText, Landmark, Telescope, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Episodes", path: "/episodes" },
  { label: "Videos", path: "/videos" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
  { label: "Privacy", path: "/privacy" },
  { label: "Terms", path: "/terms" },
  { label: "Disclaimer", path: "/disclaimer" },
];

export default function About() {
  const [, navigate] = useLocation();

  usePageSEO({ title: "About ZIKR | ذِكرٌ | Mission and Method", description: "ZIKR | ذِكرٌ about page.", path: "/about" });


  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <nav className="sticky top-0 z-50 border-b border-amber-900/30 bg-black/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
          <button onClick={() => navigate("/")} className="text-2xl font-bold text-amber-500">
            ZIKR | ذِكرٌ
          </button>
          <div className="flex flex-wrap gap-2 text-sm">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className="rounded-md px-2 py-1 text-slate-200 transition hover:bg-amber-500/10 hover:text-amber-300"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl space-y-10 px-4 py-12 md:py-16">
        <header className="space-y-5">
          <h1 className="text-4xl font-bold text-amber-300 md:text-5xl">About ZIKR | ذِكرٌ</h1>
          <p className="text-lg leading-relaxed text-slate-300">
            ZIKR | ذِكرٌ is an independent editorial history project. We investigate the less visible systems
            behind major events—bureaucracies, religious institutions, military logistics, trade law, and media
            narratives—so readers can understand how power actually moved through time.
          </p>
          <p className="text-lg leading-relaxed text-slate-300">
            Our work sits at the intersection of historical research and public storytelling: we aim to be accurate
            enough for serious readers while remaining clear and engaging for non-specialists.
          </p>
        </header>

        <section className="grid gap-5 md:grid-cols-2">
          <Card className="border-amber-900/40 bg-slate-900/70">
            <CardHeader>
              <Landmark className="mb-2 h-6 w-6 text-amber-400" />
              <CardTitle className="text-amber-300">Our editorial mission</CardTitle>
            </CardHeader>
            <CardContent className="leading-relaxed text-slate-300">
              We focus on historical analysis that explains causation, not just chronology. Instead of asking only
              "what happened," we ask who benefited, who paid the cost, what institutions made decisions possible,
              and how later generations reframed the story.
            </CardContent>
          </Card>

          <Card className="border-amber-900/40 bg-slate-900/70">
            <CardHeader>
              <BookOpenText className="mb-2 h-6 w-6 text-amber-400" />
              <CardTitle className="text-amber-300">Research approach</CardTitle>
            </CardHeader>
            <CardContent className="leading-relaxed text-slate-300">
              We build episodes from primary-source references where possible and compare competing scholarly views
              when interpretation is disputed. This gives readers a map of the debate rather than a single,
              oversimplified conclusion.
            </CardContent>
          </Card>

          <Card className="border-amber-900/40 bg-slate-900/70">
            <CardHeader>
              <Telescope className="mb-2 h-6 w-6 text-amber-400" />
              <CardTitle className="text-amber-300">What makes us different</CardTitle>
            </CardHeader>
            <CardContent className="leading-relaxed text-slate-300">
              We do not publish high-volume generic summaries. ZIKR | ذِكرٌ is built as a curated archive with
              themed series, long-form context, and strong internal linking so each piece helps readers understand
              the next one in greater depth.
            </CardContent>
          </Card>

          <Card className="border-amber-900/40 bg-slate-900/70">
            <CardHeader>
              <Users className="mb-2 h-6 w-6 text-amber-400" />
              <CardTitle className="text-amber-300">Who this is for</CardTitle>
            </CardHeader>
            <CardContent className="leading-relaxed text-slate-300">
              Our audience includes students, researchers, podcast listeners, and curious general readers who want
              historical content that is thoughtful, evidence-aware, and written with a clear editorial voice.
            </CardContent>
          </Card>
        </section>

        <section className="rounded-xl border border-amber-900/30 bg-slate-900/50 p-6 text-center md:p-8">
          <h2 className="text-2xl font-bold text-white md:text-3xl">Explore the archive</h2>
          <p className="mx-auto mt-3 max-w-3xl text-slate-300">
            Start with featured episodes, continue through companion videos, and reach out if you want to suggest a
            topic for a future investigation.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Button onClick={() => navigate("/episodes")} className="bg-amber-600 font-bold text-black hover:bg-amber-700">
              Browse Episodes
            </Button>
            <Button onClick={() => navigate("/contact")} variant="outline" className="border-amber-700 text-amber-300 hover:bg-amber-800/10">
              Contact the Editorial Team
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
