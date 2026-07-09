import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SectionHeader } from '@/components/ui/section-header';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'قصص الأنبياء والرسل',
  description: 'تعرف على قصص الأنبياء والرسل عليهم السلام وحياتهم الكريمة من منصة ذِكر.',
};

export const revalidate = 3600;

interface Prophet {
  id: string;
  name_ar: string;
  name_en: string | null;
  slug: string;
  bio_ar: string | null;
  quran_mentions?: number | null;
  era?: string | null;
}

const staticProphets: Prophet[] = [
  { id: '1', name_ar: 'آدم عليه السلام', name_en: 'Adam', slug: 'adam', bio_ar: 'أبو البشر وأول الأنبياء، خلقه الله بيده ونفخ فيه الروح وعلّمه الأسماء كلها.', quran_mentions: 25, era: null },
  { id: '2', name_ar: 'نوح عليه السلام', name_en: 'Noah', slug: 'nuh', bio_ar: 'نبي الله ورسوله الذي دعا قومه ألف سنة إلا خمسين عاماً، وبنى السفينة بأمر الله لإنجاء المؤمنين.', quran_mentions: 43, era: null },
  { id: '3', name_ar: 'إبراهيم عليه السلام', name_en: 'Ibrahim', slug: 'ibrahim', bio_ar: 'خليل الله ومحطّم الأصنام، بنى الكعبة المشرفة مع ابنه إسماعيل، وهو أبو الأنبياء.', quran_mentions: 69, era: null },
  { id: '4', name_ar: 'إسماعيل عليه السلام', name_en: 'Ismail', slug: 'ismail', bio_ar: 'ابن إبراهيم عليه السلام ومن بنى معه الكعبة المشرفة، صاحب قصة الفداء العظيم.', quran_mentions: 12, era: null },
  { id: '5', name_ar: 'إسحاق عليه السلام', name_en: 'Isaac', slug: 'ishaq', bio_ar: 'ابن إبراهيم من زوجته سارة، بشّر به الملائكة إبراهيم، وهو جد أنبياء بني إسرائيل.', quran_mentions: 17, era: null },
  { id: '6', name_ar: 'يوسف عليه السلام', name_en: 'Joseph', slug: 'yusuf', bio_ar: 'نبي الله الذي كانت قصته أحسن القصص كما وصفها القرآن. صبر على إخوته وعزيمة مصر والسجن.', quran_mentions: 27, era: null },
  { id: '7', name_ar: 'موسى عليه السلام', name_en: 'Moses', slug: 'musa', bio_ar: 'أكثر الأنبياء ذكراً في القرآن الكريم، كلّمه الله تكليماً، أنقذ بني إسرائيل من فرعون وفرق البحر.', quran_mentions: 136, era: null },
  { id: '8', name_ar: 'هارون عليه السلام', name_en: 'Aaron', slug: 'harun', bio_ar: 'أخو موسى عليه السلام ووزيره، أرسلهما الله معاً إلى فرعون.', quran_mentions: 20, era: null },
  { id: '9', name_ar: 'داود عليه السلام', name_en: 'David', slug: 'dawud', bio_ar: 'نبي وملك آتاه الله الزبور، أوتي صوتاً جميلاً تسبح معه الجبال والطير.', quran_mentions: 16, era: null },
  { id: '10', name_ar: 'سليمان عليه السلام', name_en: 'Solomon', slug: 'sulayman', bio_ar: 'ابن داود عليه السلام، آتاه الله ملكاً لم يؤت أحداً من بعده، وسخّر له الريح والجن والطير.', quran_mentions: 17, era: null },
  { id: '11', name_ar: 'عيسى عليه السلام', name_en: 'Jesus', slug: 'isa', bio_ar: 'روح الله وكلمته، وُلد من غير أب، وأيّده الله بالمعجزات. رفعه الله إليه وسينزل آخر الزمان.', quran_mentions: 25, era: null },
  { id: '12', name_ar: 'محمد صلى الله عليه وسلم', name_en: 'Muhammad', slug: 'muhammad', bio_ar: 'خاتم الأنبياء والمرسلين، أفضل خلق الله، بعثه الله رحمة للعالمين بالإسلام خاتم الأديان.', quran_mentions: 4, era: null },
  { id: '13', name_ar: 'يونس عليه السلام', name_en: 'Jonah', slug: 'yunus', bio_ar: 'صاحب الحوت، ابتلع الحوت وبقي في بطنه ثم نجاه الله بدعائه في الظلمات الثلاث.', quran_mentions: 4, era: null },
  { id: '14', name_ar: 'أيوب عليه السلام', name_en: 'Job', slug: 'ayyub', bio_ar: 'ضرب القرآن به المثل في الصبر على البلاء، ابتُلي بالمرض الشديد فصبر حتى فرّج الله عنه.', quran_mentions: 4, era: null },
  { id: '15', name_ar: 'إدريس عليه السلام', name_en: 'Enoch', slug: 'idris', bio_ar: 'أول من كتب بالقلم، رفعه الله مكاناً علياً.', quran_mentions: 2, era: null },
];

export default async function ProphetsPage() {
  let prophets: Prophet[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('prophets')
      .select('id, name_ar, name_en, slug, bio_ar, quran_mentions, era')
      .eq('published', true)
      .order('order_num', { ascending: true });
    prophets = data ?? [];
  } catch {
    // Fall through to static content
  }

  const showStatic = prophets.length === 0;
  const displayProphets = showStatic ? staticProphets : prophets;

  return (
    <Container className="py-12 space-y-12">
      {/* Hero */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-brand-gold text-balance">قصص الأنبياء والرسل</h1>
        <p className="max-w-3xl mx-auto text-lg leading-8 arabic-muted text-pretty">
          تعرف على قصص الأنبياء والرسل عليهم السلام — أصحاب الرسالات الإلهية الذين أنار الله بهم الدنيا
        </p>
      </section>

      <section className="space-y-6">
        <SectionHeader
          title="الأنبياء والرسل عليهم السلام"
          subtitle={`${displayProphets.length} نبياً ورسولاً`}
        />

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {displayProphets.map((prophet) => (
            <Link
              key={prophet.id}
              href={showStatic ? '/prophets' : `/prophets/${prophet.slug}`}
            >
              <Card className="h-full flex flex-col hover:border-brand-gold/50 transition-all cursor-pointer hover:shadow-lg hover:shadow-brand-gold/5">
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-14 h-14 shrink-0 rounded-full bg-gradient-to-br from-sky-900/60 to-brand-emeraldDeep flex items-center justify-center border border-brand-gold/20">
                    <span className="text-brand-gold font-bold text-base font-arabic">
                      {prophet.name_ar.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-brand-gold leading-snug">{prophet.name_ar}</h2>
                    {prophet.name_en && (
                      <p className="text-xs text-brand-cream/40" dir="ltr">{prophet.name_en}</p>
                    )}
                    {prophet.quran_mentions != null && prophet.quran_mentions > 0 && (
                      <Badge variant="outline" className="mt-1 text-[10px]">
                        ذُكر {prophet.quran_mentions} مرة
                      </Badge>
                    )}
                  </div>
                </div>
                {prophet.bio_ar && (
                  <p className="text-sm leading-relaxed arabic-muted line-clamp-3 flex-1">
                    {prophet.bio_ar}
                  </p>
                )}
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Quran verse */}
      <section>
        <Card className="p-8 text-center space-y-4 bg-brand-gold/5 border-brand-gold/20">
          <p className="text-2xl font-arabic leading-loose text-brand-cream" dir="rtl">
            &quot;تِلْكَ الرُّسُلُ فَضَّلْنَا بَعْضَهُمْ عَلَىٰ بَعْضٍ&quot;
          </p>
          <p className="text-brand-gold/70 text-sm">سورة البقرة - الآية 253</p>
        </Card>
      </section>
    </Container>
  );
}
