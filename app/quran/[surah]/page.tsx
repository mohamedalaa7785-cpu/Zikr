export default async function SurahPage({ params }: { params: Promise<{ surah: string }> }) {
  const { surah } = await params;
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 text-zikr-text">
      <h1 className="text-4xl font-bold text-zikr-gold">سورة رقم {surah}</h1>
      <p className="mt-4 text-zikr-muted">Placeholder for ayat, recitation sources, tafsir tabs, and bookmarking.</p>
    </main>
  );
}
