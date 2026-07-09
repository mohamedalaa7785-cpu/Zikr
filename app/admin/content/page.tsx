export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SectionHeader } from '@/components/ui/section-header';
import { requireAdmin } from '@/lib/services/admin';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'إدارة المحتوى | الأدمن',
};

interface ContentItem {
  id: string;
  title: string;
  published: boolean;
  views: number;
  created_at: string;
  type: string;
}

async function getRecentContent(): Promise<ContentItem[]> {
  try {
    const supabase = await createClient();

    const [storiesRes, articlesRes] = await Promise.all([
      supabase
        .from('stories')
        .select('id, title, published, created_at')
        .order('created_at', { ascending: false })
        .limit(10),
      supabase
        .from('articles')
        .select('id, title, published, views, created_at')
        .order('created_at', { ascending: false })
        .limit(10),
    ]);

    const stories: ContentItem[] = (storiesRes.data ?? []).map((s) => ({
      id: s.id,
      title: s.title,
      published: s.published ?? false,
      views: 0,
      created_at: s.created_at,
      type: 'قصة',
    }));

    const articles: ContentItem[] = (articlesRes.data ?? []).map((a) => ({
      id: a.id,
      title: a.title,
      published: a.published ?? false,
      views: a.views ?? 0,
      created_at: a.created_at,
      type: 'مقالة',
    }));

    return [...articles, ...stories].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  } catch {
    return [];
  }
}

export default async function ContentPage() {
  await requireAdmin();
  const content = await getRecentContent();

  return (
    <Container className="py-10 space-y-10 text-right">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold text-brand-gold">إدارة المحتوى</h1>
        <p className="arabic-muted leading-7">عرض وإدارة جميع محتويات المنصة</p>
      </section>

      <div className="flex gap-3">
        <a
          href="/admin"
          className="rounded-lg border border-brand-gold/30 px-4 py-2 text-sm text-brand-cream/70 hover:border-brand-gold hover:text-brand-gold transition-colors"
        >
          إضافة قصة
        </a>
        <a
          href="/admin"
          className="rounded-lg border border-brand-gold/30 px-4 py-2 text-sm text-brand-cream/70 hover:border-brand-gold hover:text-brand-gold transition-colors"
        >
          إضافة إعدادات
        </a>
      </div>

      <section className="space-y-4">
        <SectionHeader
          title="أحدث المحتوى"
          subtitle={`${content.length} عنصر`}
        />

        {content.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="arabic-muted">لا يوجد محتوى بعد. ابدأ بإضافة قصص أو مقالات من لوحة التحكم الرئيسية.</p>
          </Card>
        ) : (
          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead>
                  <tr className="border-b border-brand-gold/15 bg-black/20">
                    <th className="px-5 py-3 text-brand-gold/70 font-semibold">العنوان</th>
                    <th className="px-5 py-3 text-brand-gold/70 font-semibold w-24">النوع</th>
                    <th className="px-5 py-3 text-brand-gold/70 font-semibold w-24">الحالة</th>
                    <th className="px-5 py-3 text-brand-gold/70 font-semibold w-28">المشاهدات</th>
                    <th className="px-5 py-3 text-brand-gold/70 font-semibold w-36">التاريخ</th>
                  </tr>
                </thead>
                <tbody>
                  {content.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-brand-gold/8 hover:bg-brand-gold/5 transition-colors"
                    >
                      <td className="px-5 py-3 text-brand-cream/80 font-medium">{item.title}</td>
                      <td className="px-5 py-3">
                        <Badge variant="outline" className="text-xs">{item.type}</Badge>
                      </td>
                      <td className="px-5 py-3">
                        <Badge
                          variant={item.published ? 'secondary' : 'outline'}
                          className={item.published ? 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10' : 'text-amber-300 border-amber-500/30 bg-amber-500/10'}
                        >
                          {item.published ? 'منشور' : 'مسودة'}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 text-brand-cream/50 tabular-nums">
                        {item.views > 0 ? item.views.toLocaleString('ar-EG') : '—'}
                      </td>
                      <td className="px-5 py-3 text-brand-cream/50 text-xs">
                        {new Date(item.created_at).toLocaleDateString('ar-SA')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </section>
    </Container>
  );
}
