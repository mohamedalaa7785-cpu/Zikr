import Link from 'next/link';

export default async function HadithBookPage({ params }: { params: { book: string } }) {
  const { book } = params;
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 text-zikr-text">
      <h1 className="text-4xl font-bold text-zikr-gold">كتاب {book}</h1>
      <p className="mt-4 text-zikr-muted">Book-level placeholder route.</p>
      <Link href={`/hadith/${book}/1`}>Open sample hadith</Link>
    </main>
  );
}
