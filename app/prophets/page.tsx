export const dynamic = 'force-dynamic';

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
  quran_mentions?: number | null; // local static data only — not in DB schema
}

const staticProphets: Prophet[] = [
  { id: '1',  name_ar: 'آدم عليه السلام',           name_en: 'Adam',      slug: 'adam',     bio_ar: 'أبو البشر وأول الأنبياء، خلقه الله بيده ونفخ فيه الروح وعلّمه الأسماء كلها. أُهبط إلى الأرض بعد أن أكل من الشجرة ثم تاب الله عليه.',                quran_mentions: 25 },
  { id: '2',  name_ar: 'إدريس عليه السلام',         name_en: 'Enoch',     slug: 'idris',    bio_ar: 'أول من كتب بالقلم وخاط الثياب. قال الله عنه: "وَرَفَعْنَاهُ مَكَانًا عَلِيًّا". كان صابراً صادقاً.',                                                   quran_mentions: 2  },
  { id: '3',  name_ar: 'نوح عليه السلام',           name_en: 'Noah',      slug: 'nuh',      bio_ar: 'دعا قومه 950 سنة إلا خمسين عاماً، وبنى السفينة بأمر الله لإنجاء المؤمنين من الطوفان. ويُلقَّب بـ"شيخ الأنبياء".',                                      quran_mentions: 43 },
  { id: '4',  name_ar: 'هود عليه السلام',           name_en: 'Hud',       slug: 'hud',      bio_ar: 'أُرسل إلى قوم عاد أصحاب الأعمدة، فكذّبوه فأهلكهم الله بريح صرصر عاتية. قال لهم: "أَتَبْنُونَ بِكُلِّ رِيعٍ آيَةً تَعْبَثُونَ".',                   quran_mentions: 7  },
  { id: '5',  name_ar: 'صالح عليه السلام',          name_en: 'Salih',     slug: 'salih',    bio_ar: 'أُرسل إلى قوم ثمود أصحاب الحِجر. أخرج الله له ناقة من الصخرة معجزة، فعقرها قومه فأخذتهم الصيحة.',                                                     quran_mentions: 9  },
  { id: '6',  name_ar: 'إبراهيم عليه السلام',       name_en: 'Ibrahim',   slug: 'ibrahim',  bio_ar: 'خليل الله ومحطّم الأصنام، بنى الكعبة مع ابنه إسماعيل وسمّي أبا الأنبياء. ألقاه قومه في النار فجعلها الله برداً وسلاماً.',                             quran_mentions: 69 },
  { id: '7',  name_ar: 'لوط عليه السلام',           name_en: 'Lot',       slug: 'lut',      bio_ar: 'ابن أخي إبراهيم عليه السلام، أُرسل إلى قوم سدوم. كذّبوه وارتكبوا الفاحشة فأهلكهم الله وأنجى لوطاً ومن آمن معه.',                                     quran_mentions: 27 },
  { id: '8',  name_ar: 'إسماعيل عليه السلام',       name_en: 'Ismail',    slug: 'ismail',   bio_ar: 'ابن إبراهيم من هاجر، بنى معه الكعبة المشرفة. صاحب قصة الفداء العظيم حين أراد إبراهيم ذبحه ففداه الله بكبش.',                                          quran_mentions: 12 },
  { id: '9',  name_ar: 'إسحاق عليه السلام',         name_en: 'Isaac',     slug: 'ishaq',    bio_ar: 'ابن إبراهيم من سارة، بشّرته الملائكة. وُلد بعد أن كبر والداه. جد أنبياء بني إسرائيل.',                                                                 quran_mentions: 17 },
  { id: '10', name_ar: 'يعقوب عليه السلام',         name_en: 'Jacob',     slug: 'yaqub',    bio_ar: 'ابن إسحاق، لُقِّب بـ"إسرائيل". أبو الأسباط الاثني عشر. حزن على ابنه يوسف حتى ابيضّت عيناه من الحزن.',                                                  quran_mentions: 16 },
  { id: '11', name_ar: 'يوسف عليه السلام',          name_en: 'Joseph',    slug: 'yusuf',    bio_ar: 'نبي الله الذي كانت قصته أحسن القصص. صبر على كيد إخوته وعزيز مصر والسجن حتى مكّنه الله في الأرض وجعله على خزائنها.',                                    quran_mentions: 27 },
  { id: '12', name_ar: 'شعيب عليه السلام',          name_en: 'Shu\'ayb',  slug: 'shuayb',   bio_ar: 'أُرسل إلى أهل مدين وأصحاب الأيكة الذين كانوا يطففون الكيل والميزان. لُقِّب بـ"خطيب الأنبياء" لفصاحته.',                                                quran_mentions: 11 },
  { id: '13', name_ar: 'أيوب عليه السلام',          name_en: 'Job',       slug: 'ayyub',    bio_ar: 'ضرب القرآن به المثل في الصبر على البلاء. ابتُلي بالمرض الشديد سنوات طويلة فصبر حتى دعا ربه فشفاه الله وردّ إليه أهله وأعطاه مثلهم.',                 quran_mentions: 4  },
  { id: '14', name_ar: 'ذو الكفل عليه السلام',      name_en: "Dhul-Kifl", slug: 'dhul-kifl',bio_ar: 'نبي صبور تكفّل بقضاء الناس وأمورهم في سبيل الله. ذُكر في القرآن مع إسماعيل وإدريس من الصابرين.',                                                       quran_mentions: 2  },
  { id: '15', name_ar: 'موسى عليه السلام',          name_en: 'Moses',     slug: 'musa',     bio_ar: 'أكثر الأنبياء ذكراً في القرآن. كلّمه الله تكليماً مباشراً من وراء حجاب. أنقذ بني إسرائيل من فرعون وفلق البحر بعصاه بإذن الله.',                      quran_mentions: 136 },
  { id: '16', name_ar: 'هارون عليه السلام',         name_en: 'Aaron',     slug: 'harun',    bio_ar: 'أخو موسى ووزيره، أرسلهما الله معاً إلى فرعون. كان فصيح اللسان ومعين لموسى في تبليغ رسالته.',                                                            quran_mentions: 20 },
  { id: '17', name_ar: 'يونس عليه السلام',          name_en: 'Jonah',     slug: 'yunus',    bio_ar: 'صاحب الحوت وذو النون. خرج من قومه مغاضباً فابتلعه الحوت، فدعا في الظلمات: "لَا إِلَهَ إِلَّا أَنتَ سُبْحَانَكَ" فأنجاه الله.',                       quran_mentions: 4  },
  { id: '18', name_ar: 'إلياس عليه السلام',         name_en: 'Elias',     slug: 'ilyas',    bio_ar: 'أُرسل إلى قوم في بعلبك كانوا يعبدون صنماً يُسمّى "بعل". نهاهم عن عبادة الأصنام وأمرهم بعبادة الله وحده.',                                              quran_mentions: 2  },
  { id: '19', name_ar: 'اليسع عليه السلام',         name_en: 'Elisha',    slug: 'alyasa',   bio_ar: 'خليفة إلياس على بني إسرائيل. مدحه الله في القرآن في سورتي الأنعام وص. كان من الصابرين.',                                                                quran_mentions: 2  },
  { id: '20', name_ar: 'داود عليه السلام',          name_en: 'David',     slug: 'dawud',    bio_ar: 'نبي وملك آتاه الله الزبور وصوتاً جميلاً تسبح معه الجبال والطير. قتل جالوت وحكم بني إسرائيل بالعدل.',                                                   quran_mentions: 16 },
  { id: '21', name_ar: 'سليمان عليه السلام',        name_en: 'Solomon',   slug: 'sulayman', bio_ar: 'ابن داود، آتاه الله ملكاً عظيماً وسخّر له الريح والجن والطير. فهم لغة الحيوانات وبنى بيت المقدس. قال: "رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ".',  quran_mentions: 17 },
  { id: '22', name_ar: 'زكريا عليه السلام',         name_en: 'Zechariah', slug: 'zakariyya',bio_ar: 'دعا ربه في المحراب وهو شيخ كبير وزوجته عاقر أن يهبه ولداً يرثه، فاستجاب الله له ورُزق بيحيى.',                                                        quran_mentions: 7  },
  { id: '23', name_ar: 'يحيى عليه السلام',          name_en: 'John',      slug: 'yahya',    bio_ar: 'ابن زكريا، سمّاه الله اسماً لم يُسمَّ به أحد من قبل. كان تقياً براً بوالديه، بشّر بالنبي عيسى عليه السلام.',                                           quran_mentions: 5  },
  { id: '24', name_ar: 'عيسى عليه السلام',          name_en: 'Jesus',     slug: 'isa',      bio_ar: 'روح الله وكلمته، وُلد من غير أب من السيدة مريم. أحيا الموتى وأبرأ الأكمه والأبرص بإذن الله. رفعه الله إليه وسينزل آخر الزمان.',                       quran_mentions: 25 },
  { id: '25', name_ar: 'محمد صلى الله عليه وسلم',  name_en: 'Muhammad',  slug: 'muhammad', bio_ar: 'خاتم الأنبياء والمرسلين وأفضل خلق الله. بعثه الله رحمة للعالمين بالإسلام خاتم الأديان. أُسري به إلى السماوات السبع وكُلِّف بالصلوات الخمس.',          quran_mentions: 4  },
];

export default async function ProphetsPage() {
  let prophets: Prophet[] = [];

  try {
    const supabase = await createClient();
    // quran_mentions and era are not in the DB schema — select only real columns
    const { data } = await supabase
      .from('prophets')
      .select('id, name_ar, name_en, slug, bio_ar, order_num')
      .eq('published', true)
      .order('order_num', { ascending: true });
    prophets = (data ?? []).map((r) => ({ ...r, quran_mentions: null }));
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
          subtitle={`${displayProphets.length} نبياً ورسولاً من آدم إلى محمد ﷺ`}
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
