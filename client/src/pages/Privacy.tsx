
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

export default function Privacy() {
  const [, navigate] = useLocation();

  usePageSEO({ title: "Privacy Policy | ZIKR | ذِكرٌ", description: "ZIKR | ذِكرٌ privacy page.", path: "/privacy" });


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
          <h1 className="text-4xl font-bold text-amber-300 md:text-5xl">Privacy Policy</h1>
          <p className="mt-2 text-slate-400">Last updated: April 18, 2026</p>
          <p className="mt-4 text-lg leading-relaxed text-slate-300">
            This policy explains what personal data ZIKR | ذِكرٌ collects, why we collect it, and how we
            handle it. We collect only the information needed to publish content, run subscriptions, and respond
            to readers. We do not sell personal data.
          </p>
        </header>

        <Card className="border-amber-900/40 bg-slate-900/70"><CardHeader><CardTitle className="text-amber-300">Data we collect</CardTitle></CardHeader><CardContent className="space-y-3 leading-relaxed text-slate-300"><p>When you contact us or subscribe, we may collect your name, email address, and message content. We also collect limited technical data such as device type, browser, anonymized traffic metrics, and referral pages to understand site performance.</p><p>We do not intentionally collect sensitive personal data. Please avoid sending sensitive details in contact messages.</p></CardContent></Card>

        <Card className="border-amber-900/40 bg-slate-900/70"><CardHeader><CardTitle className="text-amber-300">How we use data</CardTitle></CardHeader><CardContent className="space-y-3 leading-relaxed text-slate-300"><p>We use reader data to deliver newsletter updates, respond to inquiries, moderate abuse, and improve content quality. Analytics are used to identify what topics readers find useful and where navigation needs improvement.</p><p>We process data on a legitimate-interest basis for operating and securing the site, and on consent when you opt in to newsletter communication.</p></CardContent></Card>

        <Card className="border-amber-900/40 bg-slate-900/70"><CardHeader><CardTitle className="text-amber-300">Cookies and tracking</CardTitle></CardHeader><CardContent className="space-y-3 leading-relaxed text-slate-300"><p>ZIKR | ذِكرٌ may use cookies or similar technologies for session continuity, basic preferences, and site analytics. You can manage cookies through browser settings. Disabling some cookies may affect feature availability.</p></CardContent></Card>

        <Card className="border-amber-900/40 bg-slate-900/70"><CardHeader><CardTitle className="text-amber-300">Retention and security</CardTitle></CardHeader><CardContent className="space-y-3 leading-relaxed text-slate-300"><p>We retain personal data only as long as needed for editorial operations, legal obligations, and security. We use reasonable administrative and technical safeguards, but no internet system is 100% secure.</p></CardContent></Card>

        <Card className="border-amber-900/40 bg-slate-900/70"><CardHeader><CardTitle className="text-amber-300">Your rights and contact</CardTitle></CardHeader><CardContent className="space-y-3 leading-relaxed text-slate-300"><p>You may request access, correction, or deletion of personal data associated with your direct communication with us. For privacy requests, contact <a href="mailto:contact@zikr-platform.com" className="underline hover:text-amber-300">contact@zikr-platform.com</a>.</p><p>We may update this policy as operations or legal requirements evolve. Material updates will be reflected by revising the date at the top of this page.</p></CardContent></Card>
      </main>
    </div>
  );
}
