import Link from 'next/link';

const surahs = [
  { id: 1, name: 'الفاتحة' },
  { id: 2, name: 'البقرة' },
  { id: 3, name: 'آل عمران' },
];

export default function QuranPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 text-zikr-text">
      <h1 className="text-4xl font-bold text-zikr-gold">القرآن الكريم</h1>
      <p className="mt-4 text-zikr-muted">Foundation for search, audio, tafsir, and bookmarks.</p>
      <ul className="mt-4 grid gap-4 md:grid-cols-2">
        {surahs.map((surah) => (
          <li key={surah.id} className="rounded-2xl border border-zikr-gold/15 bg-zikr-glass p-4">
            <Link href={`/quran/${surah.id}`}>{surah.id}. {surah.name}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
