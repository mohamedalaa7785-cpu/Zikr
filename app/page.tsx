import { SiteShell } from './components/site-shell';

const sections = [
  'Prayer countdown placeholder',
  'Quran preview section',
  'Stories preview section',
  'AI assistant preview',
  'Islamic radio preview',
  'Scholars preview',
  'Search placeholder',
  'Audio controls placeholder',
];

export default function Page() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-3xl border border-zikr-gold/20 bg-zikr-glass p-8">
          <p className="text-zikr-green">Foundation Phase</p>
          <h1 className="mt-3 text-4xl font-bold text-zikr-gold">Cinematic Islamic platform foundation</h1>
          <p className="mt-4 max-w-3xl text-zikr-muted">Next.js App Router baseline prepared for future Quran, Hadith, AI, Stories, Community, PWA and mobile app phases.</p>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-16 md:grid-cols-2 lg:grid-cols-4">
        {sections.map((s) => <article key={s} className="rounded-2xl border border-zikr-gold/15 bg-zikr-glass p-4">{s}</article>)}
      </section>
    </SiteShell>
  );
}
