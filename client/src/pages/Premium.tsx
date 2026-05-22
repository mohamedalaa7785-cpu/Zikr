import { usePageSEO, seoBaseUrl } from "@/lib/seoHead";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PremiumPage() {
  const [, navigate] = useLocation();
  usePageSEO({
    title: "Premium Reports | ZIKR | ذِكرٌ",
    description: "Purchase premium PDF reports, strategic historical briefs, and deep-dive dossiers from ZIKR | ذِكرٌ.",
    path: "/premium",
    schema: {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "ZIKR | ذِكرٌ Premium Reports",
      provider: { "@type": "Organization", name: "ZIKR | ذِكرٌ" },
      areaServed: "Global",
      url: `${seoBaseUrl}/premium`,
    },
  });

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-5xl space-y-6">
        <h1 className="text-4xl font-bold text-amber-300">Premium Reports</h1>
        <p className="text-slate-300">
          Downloadable research briefs for readers who need concise, source-aware strategic analysis.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { title: "Empire Playbook", price: "$29", text: "A PDF dossier on how states build narrative legitimacy." },
            { title: "Trade & Power", price: "$24", text: "Historical shipping corridors and modern leverage points." },
            { title: "Institutional Collapse", price: "$34", text: "Warning signs before administrative breakdown." },
          ].map((p) => (
            <Card key={p.title} className="border-amber-900/40 bg-slate-900/70">
              <CardHeader><CardTitle className="text-amber-300">{p.title}</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <p className="text-slate-300">{p.text}</p>
                <p className="font-semibold text-white">{p.price}</p>
                <Button onClick={() => navigate('/pricing')} className="w-full bg-amber-600 text-black hover:bg-amber-700">Choose Plan</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
