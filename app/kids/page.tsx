export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/server';

interface KidsContent {
  id: string;
  title_ar: string;
  slug: string;
  type: 'story' | 'prayer' | 'wudu' | 'quiz' | 'game' | 'video';
  age_group: '3-5' | '6-8' | '9-12' | '13-15';
  featured_image_url?: string;
}

const typeLabels: Record<string, string> = {
  story: 'قصة',
  prayer: 'دعاء',
  wudu: 'الوضوء',
  quiz: 'اختبار',
  game: 'لعبة',
  video: 'فيديو',
};

const ageGroupLabels: Record<string, string> = {
  '3-5': '3-5 سنوات',
  '6-8': '6-8 سنوات',
  '9-12': '9-12 سنة',
  '13-15': '13-15 سنة',
};

// Static fallback content shown when DB is empty
const STATIC_CONTENT: KidsContent[] = [
  {
    id: 'story-ibrahim',
    title_ar: 'قصة سيدنا إبراهيم عليه السلام',
    slug: 'story-ibrahim',
    type: 'story',
    age_group: '6-8',
  },
  {
    id: 'story-yunus',
    title_ar: 'قصة سيدنا يونس عليه السلام',
    slug: 'story-yunus',
    type: 'story',
    age_group: '6-8',
  },
  {
    id: 'prayer-before-sleep',
    title_ar: 'دعاء النوم للأطفال',
    slug: 'prayer-before-sleep',
    type: 'prayer',
    age_group: '3-5',
  },
  {
    id: 'wudu-steps',
    title_ar: 'خطوات الوضوء',
    slug: 'wudu-steps',
    type: 'wudu',
    age_group: '6-8',
  },
  {
    id: 'quiz-pillars',
    title_ar: 'اختبار أركان الإسلام',
    slug: 'quiz-pillars',
    type: 'quiz',
    age_group: '9-12',
  },
  {
    id: 'story-musa',
    title_ar: 'قصة سيدنا موسى عليه السلام',
    slug: 'story-musa',
    type: 'story',
    age_group: '9-12',
  },
];

export const metadata = {
  title: 'قسم الأطفال | ذكر',
  description: 'محتوى إسلامي تعليمي وترفيهي آمن ومناسب للأطفال',
};

export default async function KidsPage() {
  let content: KidsContent[] = STATIC_CONTENT;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('kids_content')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });
    if (data && data.length > 0) content = data;
  } catch {
    // fall through to static content
  }

  const byAgeGroup = (age: string) => content.filter((c) => c.age_group === age);

  return (
    <Container className="py-12 space-y-12">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-brand-gold">قسم الأطفال</h1>
        <p className="text-brand-cream/70 max-w-2xl mx-auto text-lg leading-relaxed">
          محتوى تعليمي وترفيهي آمن ومناسب للأطفال المسلمين
        </p>
      </section>

      {Object.entries(ageGroupLabels).map(([age, label]) => {
        const items = byAgeGroup(age);
        if (items.length === 0) return null;
        return (
          <section key={age} className="space-y-6">
            <h2 className="text-2xl font-bold text-brand-gold border-b border-brand-gold/20 pb-3">
              {label}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <Link key={item.id} href={`/kids/${item.slug}`}>
                  <Card className="h-full overflow-hidden hover:border-brand-gold/50 transition-colors cursor-pointer flex flex-col">
                    {item.featured_image_url && (
                      <div className="w-full h-40 bg-brand-gold/10 overflow-hidden">
                        <img
                          src={item.featured_image_url}
                          alt={item.title_ar}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                    )}
                    <div className="p-4 space-y-3 flex-1 flex flex-col">
                      <h3 className="text-lg font-bold text-brand-gold leading-relaxed">
                        {item.title_ar}
                      </h3>
                      <div className="flex gap-2 flex-wrap mt-auto">
                        <span className="px-2 py-1 bg-brand-gold/20 text-brand-gold rounded text-xs font-medium">
                          {typeLabels[item.type] ?? item.type}
                        </span>
                        <span className="px-2 py-1 bg-brand-emerald/20 text-brand-emerald rounded text-xs font-medium">
                          {label}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      <Card className="p-6 text-center space-y-3 bg-brand-gold/10 border-brand-gold/30">
        <h3 className="text-xl font-bold text-brand-gold">محتوى آمن ومعتمد</h3>
        <p className="text-brand-cream/80 leading-relaxed">
          جميع محتويات قسم الأطفال تم اختيارها بعناية لتكون آمنة ومفيدة ومناسبة لكل مرحلة عمرية
        </p>
      </Card>
    </Container>
  );
}
