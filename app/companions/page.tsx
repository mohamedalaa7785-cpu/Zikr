export const dynamic = 'force-dynamic';

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
  // ─── الخلفاء الراشدون ───────────────────────────────────────────────────
  { id: '1',  name_ar: 'أبو بكر الصديق رضي الله عنه',    name_en: 'Abu Bakr As-Siddiq',      title_ar: 'خليفة رسول الله — الصديق',             bio_ar: 'أول الخلفاء الراشدين وأقرب الصحابة للنبي ﷺ. أول من أسلم من الرجال الأحرار. رافق النبي في هجرته. حارب المرتدين ووحّد الجزيرة العربية. لُقِّب بالصديق لتصديقه حادثة الإسراء.',            slug: 'abu-bakr',         category: 'الخلفاء الراشدون' },
  { id: '2',  name_ar: 'عمر بن الخطاب رضي الله عنه',     name_en: 'Umar ibn Al-Khattab',     title_ar: 'الفاروق — ثاني الخلفاء',              bio_ar: 'ثاني الخلفاء الراشدين. لُقِّب بالفاروق لأن إسلامه فرّق بين الحق والباطل. فتح بيت المقدس والشام والعراق وفارس. اشتُهر بعدله الشديد حتى مع نفسه.',                                     slug: 'umar-ibn-al-khattab', category: 'الخلفاء الراشدون' },
  { id: '3',  name_ar: 'عثمان بن عفان رضي الله عنه',     name_en: 'Uthman ibn Affan',        title_ar: 'ذو النورين — ثالث الخلفاء',           bio_ar: 'ثالث الخلفاء الراشدين. تزوج ابنتَي النبي ﷺ فلُقِّب بذي النورين. جمع القرآن الكريم في مصحف واحد ووزّعه على الأمصار. اشتُهر بحيائه وكرمه.',                                           slug: 'uthman-ibn-affan',  category: 'الخلفاء الراشدون' },
  { id: '4',  name_ar: 'علي بن أبي طالب رضي الله عنه',   name_en: 'Ali ibn Abi Talib',       title_ar: 'أمير المؤمنين — رابع الخلفاء',        bio_ar: 'رابع الخلفاء الراشدين وابن عم النبي ﷺ وصهره وزوج فاطمة الزهراء. أسلم صغيراً. من أشجع الصحابة وأعلمهم. اشتُهر بحكمته وفصاحته.',                                                    slug: 'ali-ibn-abi-talib', category: 'الخلفاء الراشدون' },

  // ─── العشرة المبشرون بالجنة ─────────────────────────────────────────────
  { id: '5',  name_ar: 'طلحة بن عبيد الله رضي الله عنه', name_en: 'Talha ibn Ubaydullah',    title_ar: 'من العشرة المبشرين بالجنة',           bio_ar: 'من المبشرين بالجنة، اشتُهر بكرمه الشديد حتى لقّبه النبي ﷺ بـ"طلحة الفياض". وقى النبي بجسده يوم أُحد فجُرح جراحاً بالغة.',                                                      slug: 'talha',             category: 'العشرة المبشرون' },
  { id: '6',  name_ar: 'الزبير بن العوام رضي الله عنه',  name_en: 'Zubayr ibn al-Awwam',     title_ar: 'حواري رسول الله',                     bio_ar: 'من العشرة المبشرين بالجنة وحواري رسول الله. أول من سلّ سيفه في سبيل الله. ابن صفية عمة النبي ﷺ.',                                                                                 slug: 'zubayr',            category: 'العشرة المبشرون' },
  { id: '7',  name_ar: 'عبد الرحمن بن عوف رضي الله عنه',name_en: 'Abd al-Rahman ibn Awf',   title_ar: 'من العشرة المبشرين بالجنة',           bio_ar: 'من المبشرين بالجنة. أحد أثرياء الصحابة الذين أنفقوا أموالهم في سبيل الله. هاجر إلى المدينة ولم يحمل شيئاً فأصبح من أغنى الناس ببركة الله.',                               slug: 'abd-al-rahman-ibn-awf', category: 'العشرة المبشرون' },
  { id: '8',  name_ar: 'سعد بن أبي وقاص رضي الله عنه',  name_en: "Sa'd ibn Abi Waqqas",     title_ar: 'فاتح فارس — من العشرة المبشرين',     bio_ar: 'من المبشرين بالجنة. أول من رمى بسهم في سبيل الله. قائد معركة القادسية التي فتحت فارس للإسلام. قال له النبي: "ارمِ فداك أبي وأمي".',                                            slug: 'sad-ibn-abi-waqqas', category: 'العشرة المبشرون' },
  { id: '9',  name_ar: 'سعيد بن زيد رضي الله عنه',      name_en: 'Said ibn Zayd',           title_ar: 'من العشرة المبشرين بالجنة',           bio_ar: 'من العشرة المبشرين بالجنة. أسلم قبل دخول النبي ﷺ دار الأرقم. شارك في أغلب الغزوات. زوجه أخت عمر بن الخطاب.',                                                                    slug: 'said-ibn-zayd',    category: 'العشرة المبشرون' },
  { id: '10', name_ar: 'أبو عبيدة بن الجراح رضي الله عنه',name_en: 'Abu Ubayda ibn al-Jarrah',title_ar: 'أمين هذه الأمة',                    bio_ar: 'لقّبه النبي ﷺ بـ"أمين هذه الأمة". من المبشرين بالجنة. قائد فتوحات الشام. عُرض عليه منصب الخلافة فرفض لأن أبا بكر أولى.',                                                         slug: 'abu-ubayda',       category: 'العشرة المبشرون' },

  // ─── أمهات المؤمنين ──────────────────────────────────────────────────────
  { id: '11', name_ar: 'خديجة بنت خويلد رضي الله عنها',  name_en: 'Khadijah bint Khuwaylid', title_ar: 'أم المؤمنين — أول زوجات النبي',       bio_ar: 'أول من أسلم من البشر. زوجة النبي ﷺ الأولى التي ساندته في أصعب لحظات الدعوة. قالت له: "والله لا يُخزيك الله أبدًا". أنفقت ثروتها كلها في سبيل الله.',                        slug: 'khadijah',          category: 'أمهات المؤمنين' },
  { id: '12', name_ar: 'عائشة بنت أبي بكر رضي الله عنها',name_en: 'Aisha bint Abi Bakr',    title_ar: 'أم المؤمنين — العالمة الفقيهة',       bio_ar: 'أعلم نساء المسلمين وأكثر الصحابيات رواية للحديث. كانت مرجعاً للصحابة في الفقه والتفسير. قال عنها النبي ﷺ: "خذوا شطر دينكم عن هذه الحميراء".',                             slug: 'aisha',             category: 'أمهات المؤمنين' },
  { id: '13', name_ar: 'حفصة بنت عمر رضي الله عنها',    name_en: 'Hafsa bint Umar',         title_ar: 'أم المؤمنين — حافظة القرآن',          bio_ar: 'بنت عمر بن الخطاب وزوجة النبي ﷺ. أُودع عندها المصحف الأصلي الذي جمعه أبو بكر حتى أرسله عثمان لنسخه. كانت صائمة قوّامة.',                                                       slug: 'hafsa',             category: 'أمهات المؤمنين' },
  { id: '14', name_ar: 'أم سلمة رضي الله عنها',         name_en: 'Umm Salamah',             title_ar: 'أم المؤمنين — العاقلة الحكيمة',       bio_ar: 'زوجة النبي ﷺ المعروفة بحكمتها ورأيها السديد. في صلح الحديبية أشارت على النبي ﷺ بأن يحلق ويتحلل فيتبعه الصحابة، ففعل.',                                                  slug: 'umm-salamah',       category: 'أمهات المؤمنين' },

  // ─── الصحابة الكرام ──────────────────────────────────────────────────────
  { id: '15', name_ar: 'أبو هريرة رضي الله عنه',        name_en: 'Abu Hurayrah',            title_ar: 'حافظ السنة النبوية',                   bio_ar: 'أكثر الصحابة رواية للحديث النبوي بأكثر من 5374 حديثاً. أسلم عام خيبر وملازم النبي ﷺ. دعا له النبي بالحفظ فأصبح لا ينسى ما يسمعه.',                                           slug: 'abu-hurayrah',      category: 'الصحابة الكرام' },
  { id: '16', name_ar: 'بلال بن رباح رضي الله عنه',     name_en: 'Bilal ibn Rabah',         title_ar: 'أول مؤذن في الإسلام',                 bio_ar: 'عبد حبشي أسلم مبكراً وتحمّل تعذيب سيده أمية بن خلف ثابتاً على "أحد أحد". اشتراه أبو بكر وأعتقه. صعد الكعبة يوم الفتح وأذّن.',                                              slug: 'bilal-ibn-rabah',   category: 'الصحابة الكرام' },
  { id: '17', name_ar: 'أنس بن مالك رضي الله عنه',      name_en: 'Anas ibn Malik',          title_ar: 'خادم رسول الله — عشر سنوات',          bio_ar: 'خدم النبي ﷺ عشر سنوات. دعا له النبي بالبركة في المال والولد فعاش أكثر من مئة عام وله أولاد كثيرون. روى آلاف الأحاديث.',                                                      slug: 'anas-ibn-malik',    category: 'الصحابة الكرام' },
  { id: '18', name_ar: 'عبد الله بن مسعود رضي الله عنه',name_en: 'Abdullah ibn Masud',      title_ar: 'أعلم الناس بكتاب الله',               bio_ar: 'أول من جهر بتلاوة القرآن في مكة. قال له النبي: "اقرأ عليّ" فقرأ عليه سورة النساء. كان مرجعاً في قراءة القرآن وتفسيره.',                                                       slug: 'ibn-masud',         category: 'الصحابة الكرام' },
  { id: '19', name_ar: 'سلمان الفارسي رضي الله عنه',    name_en: 'Salman Al-Farisi',        title_ar: 'سلمان منا أهل البيت',                 bio_ar: 'رحل من فارس بحثاً عن الحق حتى وصل للنبي ﷺ. صاحب فكرة حفر الخندق في غزوة الأحزاب. قال عنه النبي: "سلمان منا آل البيت".',                                                     slug: 'salman-al-farisi',  category: 'الصحابة الكرام' },
  { id: '20', name_ar: 'معاذ بن جبل رضي الله عنه',     name_en: "Mu'adh ibn Jabal",        title_ar: 'أعلم الأمة بالحلال والحرام',          bio_ar: 'من أعلم الصحابة بالفقه والحلال والحرام. أرسله النبي ﷺ إلى اليمن معلماً وقاضياً. قال النبي: "أعلم أمتي بالحلال والحرام معاذ".',                                              slug: 'muadh-ibn-jabal',   category: 'الصحابة الكرام' },
  { id: '21', name_ar: 'خالد بن الوليد رضي الله عنه',   name_en: 'Khalid ibn al-Walid',     title_ar: 'سيف الله المسلول',                    bio_ar: 'لُقِّب بسيف الله المسلول. لم يُهزم في معركة قط. أسلم بعد صلح الحديبية وشارك في فتوحات الشام والعراق. قاد معركة اليرموك العظيمة.',                                            slug: 'khalid-ibn-al-walid',category: 'الصحابة الكرام' },
  { id: '22', name_ar: 'عمرو بن العاص رضي الله عنه',    name_en: "Amr ibn al-'As",          title_ar: 'فاتح مصر',                            bio_ar: 'فاتح مصر للإسلام. كان ذكياً ودبلوماسياً بارعاً. أسلم مع خالد بن الوليد وضرار بن الأزور في رحلة واحدة. قائد موهوب.',                                                         slug: 'amr-ibn-al-as',     category: 'الصحابة الكرام' },
  { id: '23', name_ar: 'عبد الله بن عباس رضي الله عنهما',name_en: 'Abdullah ibn Abbas',     title_ar: 'حبر الأمة وترجمان القرآن',            bio_ar: 'دعا له النبي ﷺ: "اللهم فقّهه في الدين وعلّمه التأويل". أعلم الصحابة بتفسير القرآن الكريم. ابن عم النبي ﷺ.',                                                                slug: 'ibn-abbas',          category: 'الصحابة الكرام' },
  { id: '24', name_ar: 'عبد الله بن عمر رضي الله عنهما', name_en: 'Abdullah ibn Umar',      title_ar: 'من كبار الفقهاء والمحدّثين',          bio_ar: 'ابن عمر بن الخطاب. من أكثر الصحابة ورعاً وتمسكاً بالسنة. روى أكثر من 2600 حديث. كان يتبع آثار النبي ﷺ في كل شيء.',                                                        slug: 'ibn-umar',          category: 'الصحابة الكرام' },
  { id: '25', name_ar: 'فاطمة الزهراء رضي الله عنها',   name_en: 'Fatimah az-Zahra',        title_ar: 'سيدة نساء أهل الجنة',                bio_ar: 'ابنة النبي ﷺ وزوجة علي بن أبي طالب وأم الحسن والحسين. قال عنها النبي: "فاطمة سيدة نساء أهل الجنة". عُرفت بتقواها وزهدها.',                                                slug: 'fatimah',            category: 'الصحابة الكرام' },
  { id: '26', name_ar: 'حمزة بن عبد المطلب رضي الله عنه',name_en: 'Hamza ibn Abd al-Muttalib',title_ar: 'سيد الشهداء — أسد الله',            bio_ar: 'عم النبي ﷺ وأخوه من الرضاعة. لُقِّب بـ"أسد الله وأسد رسوله". استُشهد في غزوة أُحد. قال عنه النبي: "سيد الشهداء".',                                                          slug: 'hamza',             category: 'الصحابة الكرام' },
  { id: '27', name_ar: 'أبو ذر الغفاري رضي الله عنه',   name_en: 'Abu Dharr al-Ghifari',    title_ar: 'صادق الأمة',                          bio_ar: 'أسلم مبكراً جداً. عُرف بصدقه وزهده الشديد. قال عنه النبي: "ما أقلّت الغبراء ولا أظلّت الخضراء من رجل أصدق لهجة من أبي ذر".',                                              slug: 'abu-dharr',         category: 'الصحابة الكرام' },
  { id: '28', name_ar: 'عبد الله بن الزبير رضي الله عنه',name_en: 'Abdullah ibn al-Zubayr', title_ar: 'أمير المؤمنين — أول مولود بعد الهجرة', bio_ar: 'أول مولود في الإسلام بعد الهجرة. ابن الزبير بن العوام. حكم الحجاز سنوات. كان من أشجع الناس وأشدهم عبادة.',                                                              slug: 'ibn-al-zubayr',     category: 'الصحابة الكرام' },
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
