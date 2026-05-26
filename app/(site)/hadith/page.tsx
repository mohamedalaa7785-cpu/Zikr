import Link from 'next/link';

const books = ['bukhari', 'muslim', 'tirmidhi'];

export default function HadithPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 text-zikr-text">
      <h1 className="text-4xl font-bold text-zikr-gold">الحديث الشريف</h1>
      <p className="mt-4 text-zikr-muted">Collections architecture with narrators, explanations, and searchable chains.</p>
      <ul className="mt-4 grid gap-4 md:grid-cols-2">
        {books.map((book) => (
          <li key={book} className="rounded-2xl border border-zikr-gold/15 bg-zikr-glass p-4">
            <Link href={`/hadith/${book}/1`}>{book}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
