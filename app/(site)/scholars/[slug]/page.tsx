export default async function ScholarPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 text-zikr-text">
      <h1 className="text-4xl font-bold text-zikr-gold">{slug}</h1>
      <p className="mt-4 text-zikr-muted">Scholar biography and linked Quran/Hadith content placeholder.</p>
    </main>
  );
}
