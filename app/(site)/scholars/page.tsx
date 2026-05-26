import Link from 'next/link';

const scholars = ['imam-nawawi', 'ibn-kathir'];

export default function ScholarsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 text-zikr-text">
      <h1 className="text-4xl font-bold text-zikr-gold">العلماء</h1>
      <ul className="mt-4 grid gap-4 md:grid-cols-2">
        {scholars.map((slug) => (
          <li key={slug} className="rounded-2xl border border-zikr-gold/15 bg-zikr-glass p-4"><Link href={`/scholars/${slug}`}>{slug}</Link></li>
        ))}
      </ul>
    </main>
  );
}
