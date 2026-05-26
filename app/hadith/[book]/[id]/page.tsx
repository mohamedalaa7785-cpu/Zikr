export default async function HadithDetailPage({ params }: { params: { book: string; id: string } }) {
  const { book, id } = params;
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 text-zikr-text">
      <h1 className="text-4xl font-bold text-zikr-gold">حديث {id} من {book}</h1>
      <p className="mt-4 text-zikr-muted">Placeholder for text, sanad, explanations, and related narrations.</p>
    </main>
  );
}
