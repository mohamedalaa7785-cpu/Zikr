import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SectionHeader } from '@/components/ui/section-header';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'الصحابة رضي الله عنهم',
  description: 'سير أصحاب النبي محمد ﷺ الذين حملوا الإسلام ونشروه في الآفاق.',
};

export const revalidate = 3600;

type Companion = {
  id: string;
  name_ar: string;
  name_en: string | null;
  title_ar: string | null;
  bio_ar: string | null;
  slug: string;
  category?: string | null;
};

const staticCompanions: Companion[] = [
  { id: '1', name_ar: 'أبو بكر الصديق', name_en: 'Abu Bakr As-Siddiq', title_ar: 'خليفة رسول الله', bio_ar: 'أول الخلفاء الراشدين وأقرب الصحابة إلى النبي ﷺ، وأول من أسلم من الرجال الأحرار. لقّبه النبي بالصديق لتصديقه إياه في حادثة الإسراء والمعراج.', slug: 'abu-bakr', category: 'الخلفاء الراشدون' },
  { id: '2', name_ar: 'عمر بن الخطاب', name_en: 'Umar ibn Al-Khattab', title_ar: 'الفاروق', bio_ar: 'ثاني الخلفاء الراشدين، لُقّب بالفاروق لأن إسلامه فرّق بين الحق والباطل. كان مشهوراً بعدله وقوته في الحق.', slug: 'umar-ibn-al-khattab', category: 'الخلفاء الراشدون' },
  { id: '3', name_ar: 'عثمان بن عفان', name_en: 'Uthman ibn Affan', title_ar: 'ذو النورين', bio_ar: 'ثالث الخلفاء الراشدين، تزوج من ابنتَي النبي ﷺ فلقّب بذي النورين. جمع القرآن الكريم في عهده.', slug: 'uthman-ibn-affan', category: 'الخلفاء الراشدون' },
  { id: '4', name_ar: 'علي بن أبي طالب', name_en: 'Ali ibn Abi Talib', title_ar: 'كرّم الله وجهه', bio_ar: 'رابع الخلفاء الراشدين وابن عم النبي ﷺ وصهره. أسلم صغيراً وكان من أشجع الصحابة وأعلمهم.', slug: 'ali-ibn-abi-talib', category: 'الخلفاء الراشدون' },
  { id: '5', name_ar: 'عبد الرحمن بن عوف', name_en: 'Abd al-Rahman ibn Awf', title_ar: 'من المبشرين بالجنة', bio_ar: 'من العشرة المبشرين بالجنة، وكان من أثرياء الصحابة وأكرمهم، أنفق ماله في سبيل الله.', slug: 'abd-al-rahman-ibn-awf', category: 'العشرة المبشرون' },
  { id: '6', name_ar: 'أبو هريرة', name_en: 'Abu Hurayrah', title_ar: 'حافظ السنة النبوية', bio_ar: 'أكثر الصحابة رواية للحديث النبوي، أسلم عام خيبر وملازم النبي ﷺ في السنوات الأخيرة.', slug: 'abu-hurayrah', category: 'الصحابة الكرام' },
  { id: '7', name_ar: 'خديجة بنت خويلد', name_en: 'Khadijah bint Khuwaylid', title_ar: 'أم المؤمنين', bio_ar: 'أول زوجات النبي ﷺ وأول من أسلم على الإطلاق. ساندت النبي في أصعب الأوقات وأنفقت مالها في سبيل الدعوة.', slug: 'khadijah', category: 'أمهات المؤمنين' },
  { id: '8', name_ar: 'عائشة بنت أبي بكر', name_en: 'Aisha bint Abi Bakr', title_ar: 'أم المؤمنين', bio_ar: 'زوجة النبي ﷺ وأعلم نساء المسلمين، روت كثيراً من الأحاديث النبوية وكانت مرجعاً للصحابة في الفقه.', slug: 'aisha', category: 'أمهات المؤمنين' },
  { id: '9', name_ar: 'بلال بن رباح', name_en: 'Bilal ibn Rabah', title_ar: 'مؤذن الإسلام', bio_ar: 'أول مؤذن في الإسلام، عبد حبشي أسلم مبكراً وتحمّل العذاب ثابتاً على إيمانه، حتى اشتراه أبو بكر وأعتقه.', slug: 'bilal-ibn-rabah', category: 'الصحابة الكرام' },
  { id: '10', name_ar: 'أنس بن مالك', name_en: 'Anas ibn Malik', title_ar: 'خادم رسول الله', bio_ar: 'خدم النبي ﷺ عشر سنوات، روى كثيراً من الأحاديث النبوية، ودعا له النبي بالبركة في المال والولد.', slug: 'anas-ibn-malik', category: 'الصحابة الكرام' },
  { id: '11', name_ar: 'سلمان الفارسي', name_en: 'Salman Al-Farisi', title_ar: 'سلمان منا أهل البيت', bio_ar: 'كان من أهل فارس ورحل في طلب الحق حتى أدرك النبي ﷺ. صاحب فكرة الخندق في غزوة الأحزاب.', slug: 'salman-al-farisi', category: 'الصحابة الكرام' },
  { id: '12', name_ar: 'معاذ بن جبل', name_en: "Mu'adh ibn Jabal", title_ar: 'أعلم الأمة بالحلال والحرام', bio_ar: 'من أعلم الصحابة بالفقه والحلال والحرام، أرسله النبي ﷺ إلى اليمن معلماً وقاضياً.', slug: 'muadh-ibn-jabal', category: 'الصحابة الكرام' },
];

export default async function CompanionsPage() {
  let companions: Companion[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('companions')
      .select('id, name_ar, name_en, title_ar, bio_ar, slug, category')
      .eq('published', true)
      .order('name_ar', { ascending: true });
    companions = data ?? [];
  } catch {
    // Fall through to static content
  }

  const showStatic = companions.length === 0;
  const displayCompanions = showStatic ? staticCompanions : companions;

  // Group by category
  const grouped = displayCompanions.reduce<Record<string, Companion[]>>((acc, c) => {
    const cat = c.category ?? 'الصحابة الكرام';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(c);
    return acc;
  }, {});

  return (
    <Container className="py-12 space-y-12">
      {/* Hero */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-brand-gold text-balance">الصحابة رضي الله عنهم</h1>
        <p className="max-w-3xl mx-auto text-lg leading-8 arabic-muted text-pretty">
          سير أصحاب النبي محمد ﷺ الذين حملوا الإسلام ونشروه في الآفاق بتضحياتهم وإيمانهم
        </p>
      </section>

      {/* Grouped sections */}
      {Object.entries(grouped).map(([category, items]) => (
        <section key={category} className="space-y-6">
          <SectionHeader title={category} subtitle={`${items.length} صحابي`} />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {items.map((c) => (
              <Link key={c.id} href={showStatic ? '/companions' : `/companions/${c.slug}`}>
                <Card className="h-full flex flex-col hover:border-brand-gold/50 transition-colors cursor-pointer">
                  <div className="flex items-start gap-4 mb-3">
                    <div className="w-12 h-12 shrink-0 rounded-full bg-gradient-to-br from-brand-gold/20 to-brand-emerald/20 flex items-center justify-center">
                      <span className="text-brand-gold font-bold text-sm font-arabic">
                        {c.name_ar.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-bold text-brand-gold leading-snug">{c.name_ar}</h2>
                      {c.title_ar && (
                        <p className="text-xs text-brand-gold/60 mt-0.5">{c.title_ar}</p>
                      )}
                      {c.name_en && (
                        <p className="text-xs text-brand-cream/40 mt-0.5" dir="ltr">{c.name_en}</p>
                      )}
                    </div>
                  </div>
                  {c.bio_ar && (
                    <p className="text-sm leading-relaxed arabic-muted line-clamp-3 flex-1">{c.bio_ar}</p>
                  )}
                  {c.category && (
                    <Badge variant="outline" className="mt-3 self-start text-xs">{c.category}</Badge>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {/* Quran verse */}
      <section>
        <Card className="p-8 text-center space-y-4 bg-brand-gold/5 border-brand-gold/20">
          <p className="text-2xl font-arabic leading-loose text-brand-cream" dir="rtl">
            &quot;وَالسَّابِقُونَ الْأَوَّلُونَ مِنَ الْمُهَاجِرِينَ وَالْأَنصَارِ وَالَّذِينَ اتَّبَعُوهُم بِإِحْسَانٍ رَّضِيَ اللَّهُ عَنْهُمْ وَرَضُوا عَنْهُ&quot;
          </p>
          <p className="text-brand-gold/70 text-sm">سورة التوبة - الآية 100</p>
        </Card>
      </section>
    </Container>
  );
}
