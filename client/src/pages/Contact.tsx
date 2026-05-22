
import { useLocation } from "wouter";
import { usePageSEO } from "@/lib/seoHead";
import { Mail, MessageSquare, Phone } from "lucide-react";
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

export default function ContactPage() {
  const [, navigate] = useLocation();

  usePageSEO({ title: "Contact ZIKR | ذِكرٌ", description: "ZIKR | ذِكرٌ contact page.", path: "/contact" });


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

      <main className="mx-auto max-w-4xl space-y-8 px-4 py-12 md:py-16">
        <header>
          <h1 className="text-4xl font-bold text-amber-300 md:text-5xl">Contact</h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-300">
            We welcome thoughtful feedback, corrections, archival suggestions, and collaboration requests. If you
            are contacting us about a historical claim, include the episode title and any sources you want us to
            review so our editorial process can respond precisely.
          </p>
        </header>

        <section className="grid gap-5 md:grid-cols-2">
          <Card className="border-amber-900/40 bg-slate-900/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-300">
                <Mail className="h-5 w-5" /> Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <a href="mailto:contact@zikr-platform.com" className="text-slate-200 underline-offset-4 hover:text-amber-300 hover:underline">
                contact@zikr-platform.com
              </a>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Best for editorial notes, source discussions, publishing inquiries, and long-form messages.
              </p>
            </CardContent>
          </Card>

          <Card className="border-amber-900/40 bg-slate-900/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-300">
                <Phone className="h-5 w-5" /> Phone / WhatsApp
              </CardTitle>
            </CardHeader>
            <CardContent>
              <a href="tel:+201210708572" className="text-slate-200 underline-offset-4 hover:text-amber-300 hover:underline">
                +20 121 070 8572
              </a>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Best for short coordination messages, interview scheduling, and production logistics.
              </p>
            </CardContent>
          </Card>
        </section>

        <Card className="border-amber-900/40 bg-slate-900/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-300">
              <MessageSquare className="h-5 w-5" /> Editorial response standards
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 leading-relaxed text-slate-300">
            <p>
              We review historical correction requests in good faith and prioritize claims that include citations.
              If a factual error is confirmed, we update the affected content and note the revision date.
            </p>
            <p>
              For legal and policy matters, include your full name, country, and the exact URL involved so we can
              route your request to the right channel quickly.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
