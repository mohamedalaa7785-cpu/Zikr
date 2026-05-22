import { usePageSEO, seoBaseUrl } from "@/lib/seoHead";

export default function SupportPage() {
  usePageSEO({
    title: "Support ZIKR | ذِكرٌ",
    description: "Support ZIKR | ذِكرٌ through donations and sponsorship to fund independent historical research.",
    path: "/support",
    schema: {
      "@context": "https://schema.org",
      "@type": "DonateAction",
      recipient: { "@type": "Organization", name: "ZIKR | ذِكرٌ" },
      url: `${seoBaseUrl}/support`,
    },
  });

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl space-y-4">
        <h1 className="text-4xl font-bold text-amber-300">Support ZIKR | ذِكرٌ</h1>
        <p className="text-slate-300">
          Help us fund independent editorial research, archival access, and documentary production.
        </p>
        <div className="rounded-xl border border-amber-900/40 bg-slate-900/70 p-6">
          <h2 className="text-xl font-semibold text-amber-300">Ways to support</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
            <li>One-time contribution through direct transfer inquiries via email.</li>
            <li>Sponsorship inquiries for thematic series.</li>
            <li>Institutional collaboration for premium research commissions.</li>
          </ul>
          <p className="mt-3 text-sm text-slate-400">Contact: contact@zikr-platform.com</p>
        </div>
      </div>
    </main>
  );
}
