import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SectionHeader } from '@/components/ui/section-header';

export const metadata: Metadata = {
  title: 'السيرة النبوية | ذِكر',
  description: 'رحلة في سيرة النبي محمد ﷺ من المولد إلى الوفاة — أبرز المحطات والأحداث مرتبة زمنياً.',
};

type Era = {
  period: string;
  badge: string;
  events: { year: string; title: string; text: string }[];
};

const seerah: Era[] = [
  {
    period: 'النشأة والمولد',
    badge: 'قبل البعثة',
    events: [
      {
        year: 'عام الفيل ٥٧١م',
        title: 'المولد الشريف',
        text: 'وُلد النبي محمد ﷺ في مكة في عام الفيل، من بني هاشم من قريش. تُوفي أبوه عبد الله قبل مولده، فكفله جده عبد المطلب ثم عمه أبو طالب.',
      },
      {
        year: 'الطفولة',
        title: 'الرضاعة والكفالة',
        text: 'أرضعته حليمة السعدية في بادية بني سعد. تُوفيت أمه آمنة وهو ابن ست سنين، فنشأ يتيماً في رعاية جده ثم عمه.',
      },
      {
        year: 'الشباب',
        title: 'الأمين الصادق',
        text: 'عُرف بين قومه بالصدق والأمانة حتى لُقّب بـ«الصادق الأمين». عمل بالرعي ثم التجارة، وشهد حلف الفضول لنصرة المظلوم.',
      },
      {
        year: '٢٥ سنة',
        title: 'الزواج من خديجة',
        text: 'تزوج السيدة خديجة بنت خويلد رضي الله عنها، فكانت نعم الزوجة والسند، وأول من آمن به.',
      },
    ],
  },
  {
    period: 'البعثة والدعوة في مكة',
    badge: 'البعثة',
    events: [
      {
        year: '٤٠ سنة',
        title: 'بدء الوحي',
        text: 'نزل عليه الوحي في غار حراء بقوله تعالى: «اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ»، فكانت بداية الرسالة الخاتمة.',
      },
      {
        year: 'الدعوة السرية',
        title: 'السابقون الأولون',
        text: 'دعا سراً ثلاث سنين، فآمن خديجة وأبو بكر وعلي وزيد بن حارثة وآخرون من السابقين إلى الإسلام.',
      },
      {
        year: 'الجهر بالدعوة',
        title: 'الصبر على الأذى',
        text: 'أمره الله بالجهر «فَاصْدَعْ بِمَا تُؤْمَرُ»، فلقي هو وأصحابه أذى قريش وصبروا، وهاجر بعضهم إلى الحبشة.',
      },
      {
        year: 'عام الحزن',
        title: 'وفاة خديجة وأبي طالب',
        text: 'تُوفيت خديجة وأبو طالب في عام واحد سُمّي عام الحزن، واشتد أذى قريش، فخرج إلى الطائف يلتمس النصرة.',
      },
      {
        year: 'الإسراء والمعراج',
        title: 'فرض الصلاة',
        text: 'أُسري به ﷺ من المسجد الحرام إلى المسجد الأقصى ثم عُرج به إلى السماوات، وفُرضت الصلوات الخمس.',
      },
    ],
  },
  {
    period: 'الهجرة وبناء الدولة',
    badge: 'المدينة',
    events: [
      {
        year: '١ هـ ٦٢٢م',
        title: 'الهجرة إلى المدينة',
        text: 'هاجر ﷺ مع أبي بكر إلى المدينة بعد بيعتي العقبة، فكانت الهجرة بداية التقويم الإسلامي وتأسيس الدولة.',
      },
      {
        year: 'بناء المجتمع',
        title: 'المسجد والمؤاخاة',
        text: 'بنى المسجد النبوي، وآخى بين المهاجرين والأنصار، وكتب الصحيفة (دستور المدينة) لتنظيم العلاقات.',
      },
      {
        year: '٢ هـ',
        title: 'غزوة بدر الكبرى',
        text: 'أول معركة فاصلة، نصر الله فيها المسلمين على عددهم القليل، وكانت يوم الفرقان.',
      },
      {
        year: '٣-٥ هـ',
        title: 'أُحد والخندق',
        text: 'في أُحد ابتُلي المسلمون بمخالفة الرماة، وفي الخندق حاصرت الأحزاب المدينة فردهم الله بريح وجنود.',
      },
      {
        year: '٦ هـ',
        title: 'صلح الحديبية',
        text: 'صلح مع قريش كان فتحاً مبيناً، انتشر بعده الإسلام وأرسل النبي ﷺ الرسائل إلى الملوك يدعوهم للإسلام.',
      },
    ],
  },
  {
    period: 'الفتح والتمكين',
    badge: 'التمكين',
    events: [
      {
        year: '٨ هـ',
        title: 'فتح مكة',
        text: 'دخل ﷺ مكة فاتحاً متواضعاً، وعفا عن أهلها قائلاً: «اذهبوا فأنتم الطلقاء»، وطهّر الكعبة من الأصنام.',
      },
      {
        year: '٩ هـ',
        title: 'عام الوفود',
        text: 'توافدت القبائل من كل الجزيرة معلنة إسلامها، ودخل الناس في دين الله أفواجاً.',
      },
      {
        year: '١٠ هـ',
        title: 'حجة الوداع',
        text: 'حج النبي ﷺ حجته الوحيدة وخطب خطبة الوداع التي أرسى فيها قواعد الحقوق والمساواة، ونزل «الْيَوْمَ أَكْمَلْتُ لَكُمْ دِينَكُمْ».',
      },
      {
        year: '١١ هـ ٦٣٢م',
        title: 'الوفاة',
        text: 'انتقل ﷺ إلى الرفيق الأعلى في المدينة بعد أن بلّغ الرسالة وأدى الأمانة، ودُفن في حجرة عائشة رضي الله عنها.',
      },
    ],
  },
];

export default function SeerahPage() {
  return (
    <Container className="space-y-12 py-10 text-right">
      <section className="space-y-4 text-center">
        <h1 className="text-4xl font-bold text-brand-gold">السيرة النبوية</h1>
        <p className="max-w-3xl mx-auto text-lg leading-8 text-brand-cream/70">
          رحلة في حياة خير البشر محمد ﷺ، من المولد إلى الوفاة، عبر أبرز المحطات والأحداث مرتبة زمنياً
          لتكون سراجاً منيراً نقتدي به في حياتنا.
        </p>
      </section>

      {seerah.map((era, eraIdx) => (
        <section key={era.period} className="space-y-6">
          <SectionHeader title={era.period} subtitle={`المرحلة ${eraIdx + 1} من رحلة السيرة`} />

          <div className="relative space-y-6 before:absolute before:right-4 before:top-2 before:bottom-2 before:w-px before:bg-brand-gold/20">
            {era.events.map((event, idx) => (
              <div key={idx} className="relative pr-12">
                <span className="absolute right-2 top-2 h-4 w-4 rounded-full border-2 border-brand-gold bg-black" />
                <Card className="space-y-2 hover:border-brand-gold/40 transition-colors">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <h3 className="text-xl font-semibold text-brand-cream">{event.title}</h3>
                    <Badge variant="secondary">{event.year}</Badge>
                  </div>
                  <p className="leading-8 text-brand-cream/75">{event.text}</p>
                </Card>
              </div>
            ))}
          </div>
        </section>
      ))}

      <Card className="py-8 text-center space-y-3 bg-brand-gold/10">
        <h2 className="text-2xl text-brand-gold">﴿لَّقَدْ كَانَ لَكُمْ فِي رَسُولِ اللَّهِ أُسْوَةٌ حَسَنَةٌ﴾</h2>
        <p className="text-brand-cream/80 max-w-xl mx-auto leading-8">
          سيرته ﷺ منهاج حياة. تأمل محطاتها، واقتدِ بأخلاقه وصبره ورحمته في كل تفاصيل يومك.
        </p>
      </Card>
    </Container>
  );
}
