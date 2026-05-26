import Link from 'next/link';
import { homepageSections } from '../lib/content';

export default function Page() {
  return (
      <main className="mx-auto max-w-6xl px-4 py-16">
        <section className="rounded-3xl border border-zikr-gold/20 bg-zikr-glass p-8">
          <p className="text-zikr-green">Spiritual Experience Platform</p>
          <h1 className="mt-3 text-4xl font-bold text-zikr-gold">ZIKR | ذِكرٌ</h1>
          <p className="mt-4 max-w-3xl text-zikr-muted">Arabic-first, App Router-first foundation for Quran, Hadith, Stories, AI, Scholars, and community systems with PWA readiness.</p>
          <div className="mt-4 flex gap-4">
            <Link href="/quran">Quran</Link>
            <Link href="/hadith">Hadith</Link>
            <Link href="/scholars">Scholars</Link>
          </div>
        </section>

        <section className="mx-auto grid gap-4 py-16 md:grid-cols-2 lg:grid-cols-4">
          {homepageSections.map((item) => (
            <article key={item.title} className="rounded-2xl border border-zikr-gold/15 bg-zikr-glass p-4">
              <h2 className="text-zikr-gold">{item.title}</h2>
              <p className="mt-3 text-zikr-muted">{item.description}</p>
            </article>
          ))}
        </section>
      </main>
  );
}
