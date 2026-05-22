
import { useLocation } from "wouter";
import { usePageSEO } from "@/lib/seoHead";
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

export default function Disclaimer() {
  const [, navigate] = useLocation();

  usePageSEO({ title: "Disclaimer | ZIKR | ذِكرٌ", description: "ZIKR | ذِكرٌ disclaimer page.", path: "/disclaimer" });


  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <nav className="sticky top-0 z-50 border-b border-amber-900/30 bg-black/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
          <button onClick={() => navigate("/")} className="text-2xl font-bold text-amber-500">ZIKR | ذِكرٌ</button>
          <div className="flex flex-wrap gap-2 text-sm">
            {navLinks.map((link) => (
              <button key={link.path} onClick={() => navigate(link.path)} className="rounded-md px-2 py-1 text-slate-200 transition hover:bg-amber-500/10 hover:text-amber-300">
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-12 md:py-16">
        <header>
          <h1 className="text-4xl font-bold text-amber-300 md:text-5xl">Disclaimer</h1>
          <p className="mt-2 text-slate-400">Last updated: April 18, 2026</p>
          <p className="mt-4 text-lg leading-relaxed text-slate-300">
            ZIKR | ذِكرٌ publishes historical commentary and educational analysis. This material is intended to
            inform public understanding, not to replace professional legal, financial, medical, or academic advice.
          </p>
        </header>

        <Card className="border-amber-900/40 bg-slate-900/70"><CardHeader><CardTitle className="text-amber-300">Editorial interpretation</CardTitle></CardHeader><CardContent className="space-y-3 leading-relaxed text-slate-300"><p>Historical evidence is often incomplete and interpretation can differ between scholars. Our episodes and essays reflect editorial judgment based on available sources at publication time.</p><p>Reasonable disagreement is expected in historical research. Readers are encouraged to consult multiple perspectives and primary materials where possible.</p></CardContent></Card>

        <Card className="border-amber-900/40 bg-slate-900/70"><CardHeader><CardTitle className="text-amber-300">Accuracy and updates</CardTitle></CardHeader><CardContent className="space-y-3 leading-relaxed text-slate-300"><p>We work to maintain high factual standards, but we cannot guarantee that all material is complete or free from error. If credible corrections are submitted, we review and update content when warranted.</p></CardContent></Card>

        <Card className="border-amber-900/40 bg-slate-900/70"><CardHeader><CardTitle className="text-amber-300">External links and platforms</CardTitle></CardHeader><CardContent className="space-y-3 leading-relaxed text-slate-300"><p>Some pages link to third-party websites, archives, video hosts, or social platforms. ZIKR | ذِكرٌ does not control external content and is not responsible for third-party policies, reliability, or availability.</p></CardContent></Card>

        <Card className="border-amber-900/40 bg-slate-900/70"><CardHeader><CardTitle className="text-amber-300">Liability limitation</CardTitle></CardHeader><CardContent className="space-y-3 leading-relaxed text-slate-300"><p>Use of this website is at your own discretion. To the fullest extent permitted by law, ZIKR | ذِكرٌ and its contributors are not liable for losses arising from reliance on site content or from inability to access the service.</p><p>For questions about this disclaimer, contact <a href="mailto:contact@zikr-platform.com" className="underline hover:text-amber-300">contact@zikr-platform.com</a>.</p></CardContent></Card>
      </main>
    </div>
  );
}
