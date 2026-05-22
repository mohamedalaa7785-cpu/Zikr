
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

export default function Terms() {
  const [, navigate] = useLocation();

  usePageSEO({ title: "Terms of Service | ZIKR | ذِكرٌ", description: "ZIKR | ذِكرٌ terms page.", path: "/terms" });


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
          <h1 className="text-4xl font-bold text-amber-300 md:text-5xl">Terms of Service</h1>
          <p className="mt-2 text-slate-400">Last updated: April 18, 2026</p>
          <p className="mt-4 text-lg leading-relaxed text-slate-300">
            These Terms govern access to and use of ZIKR | ذِكرٌ. By using this website, you agree to these
            Terms and to applicable laws in your jurisdiction.
          </p>
        </header>

        <Card className="border-amber-900/40 bg-slate-900/70"><CardHeader><CardTitle className="text-amber-300">Use of content</CardTitle></CardHeader><CardContent className="space-y-3 leading-relaxed text-slate-300"><p>All editorial content, branding, and design on this site are protected by copyright and related rights unless otherwise stated. You may quote short passages with clear attribution and a link back to the original URL.</p><p>You may not republish full articles, episode transcripts, or video scripts without written permission.</p></CardContent></Card>

        <Card className="border-amber-900/40 bg-slate-900/70"><CardHeader><CardTitle className="text-amber-300">Acceptable behavior</CardTitle></CardHeader><CardContent className="space-y-3 leading-relaxed text-slate-300"><p>You agree not to misuse forms, attempt unauthorized access, disrupt service availability, or post malicious content. Automated scraping that imposes unreasonable load is prohibited without prior consent.</p></CardContent></Card>

        <Card className="border-amber-900/40 bg-slate-900/70"><CardHeader><CardTitle className="text-amber-300">Third-party services</CardTitle></CardHeader><CardContent className="space-y-3 leading-relaxed text-slate-300"><p>ZIKR | ذِكرٌ may link to external websites or embedded platforms. We are not responsible for third-party availability, terms, or privacy practices. Use of third-party services is at your own risk.</p></CardContent></Card>

        <Card className="border-amber-900/40 bg-slate-900/70"><CardHeader><CardTitle className="text-amber-300">No warranty and limitation of liability</CardTitle></CardHeader><CardContent className="space-y-3 leading-relaxed text-slate-300"><p>Content is provided for informational and educational use on an "as is" basis. We do not guarantee uninterrupted access or error-free operation. To the fullest extent permitted by law, ZIKR | ذِكرٌ is not liable for indirect or consequential damages arising from site use.</p></CardContent></Card>

        <Card className="border-amber-900/40 bg-slate-900/70"><CardHeader><CardTitle className="text-amber-300">Changes to these terms</CardTitle></CardHeader><CardContent className="space-y-3 leading-relaxed text-slate-300"><p>We may revise these Terms as the project evolves. Continued use after an update means you accept the revised terms. Significant updates will be reflected by changing the date at the top of this page.</p><p>Questions: <a href="mailto:contact@zikr-platform.com" className="underline hover:text-amber-300">contact@zikr-platform.com</a>.</p></CardContent></Card>
      </main>
    </div>
  );
}
