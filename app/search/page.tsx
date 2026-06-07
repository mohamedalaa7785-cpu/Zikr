import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { ayahs, hadiths, surahs } from '@/lib/data/content';

function highlight(text: string, q: string): string {
  if (!q) return text;
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text.replace(new RegExp(escaped, 'gi'), (m) => `【${m}】`);
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }): Promise<Metadata> {
  const sp = await searchParams;
  const q = (sp.q || '').trim();
  return {
    title: q ? `نتائج البحث: ${q}` : 'البحث',
    description: 'البحث في القرآن والحديث',
    alternates: { canonical: q ? `/search?q=${encodeURIComponent(q)}` : '/search' },
  };
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; type?: string }> }) {
  const sp = await searchParams;
  const q = (sp.q || '').trim();
  const type = sp.type || 'all';
  const quran = q ? ayahs.filter((a) => a.textSimple.includes(q) || surahs.find((s) => s.id === a.surahId)?.nameAr.includes(q)) : [];
  const hadith = q ? hadiths.filter((h) => h.textAr.includes(q)) : [];

  return (
    <Container className="py-12 space-y-6">
      <h1 className="text-3xl text-brand-gold">البحث</h1>

      <form className="flex gap-2">
        <input
          name="q"
          defaultValue={q}
          className="flex-1 rounded-lg bg-black/20 p-3"
          placeholder="ابحث في القرآن والحديث"
        />
        <select name="type" defaultValue={type} className="rounded-lg bg-black/20 p-3">
          <option value="all">الكل</option>
          <option value="quran">القرآن</option>
          <option value="hadith">الحديث</option>
        </select>
        <button className="rounded-lg bg-brand-gold px-4 text-brand-emeraldDeep">بحث</button>
      </form>

      {q && (
        <p className="text-sm arabic-muted">
          {quran.length + hadith.length} نتيجة لـ &quot;{q}&quot;
        </p>
      )}

      {(type === 'all' || type === 'quran') && (
        <Card className="space-y-3">
          <h2 className="text-brand-gold">نتائج القرآن ({quran.length})</h2>
          {quran.length === 0 ? (
            <p className="arabic-muted">لا نتائج.</p>
          ) : (
            quran.map((r) => (
              <p key={`${r.surahId}:${r.ayahNumber}`} className="text-brand-cream/90 leading-relaxed">
                [{r.surahId}:{r.ayahNumber}] {highlight(r.textSimple, q)}
              </p>
            ))
          )}
        </Card>
      )}

      {(type === 'all' || type === 'hadith') && (
        <Card className="space-y-3">
          <h2 className="text-brand-gold">نتائج الحديث ({hadith.length})</h2>
          {hadith.length === 0 ? (
            <p className="arabic-muted">لا نتائج.</p>
          ) : (
            hadith.map((h) => (
              <p key={h.id} className="text-brand-cream/90 leading-relaxed">
                {highlight(h.textAr, q)}
              </p>
            ))
          )}
        </Card>
      )}
    </Container>
  );
}
