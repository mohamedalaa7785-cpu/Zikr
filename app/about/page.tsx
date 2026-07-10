import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { pageMetadata, siteConfig } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'عن منصة ذِكرٌ',
  description: 'تعرّف على رسالة منصة ذِكرٌ ورؤيتها وفريقها في تقديم أفضل تجربة روحانية رقمية إسلامية.',
  path: '/about',
});

const features = [
  { icon: '📖', title: 'القرآن الكريم', desc: 'تصفّح القرآن بخطوط عربية جميلة مع التفسير والتلاوة من أشهر القراء.' },
  { icon: '📿', title: 'الأذكار والأدعية', desc: 'أذكار الصباح والمساء وأدعية المناسبات منظّمة بشكل سهل.' },
  { icon: '🕌', title: 'مواقيت الصلاة', desc: 'توقيت دقيق لكل صلاة بناء على موقعك الجغرافي.' },
  { icon: '📚', title: 'قصص الأنبياء', desc: '25 نبياً مع قصصهم الكاملة التفصيلية والدروس المستفادة.' },
  { icon: '⚔️', title: 'الغزوات الإسلامية', desc: 'غزوات النبي ﷺ مكتوبة بتفصيل مع الأحداث والعبر.' },
  { icon: '🎥', title: 'فيديوهات تعليمية', desc: 'مقاطع يوتيوب مرتبطة بكل قصة ونبي لمزيد من الفهم.' },
  { icon: '📰', title: 'المقالات', desc: 'مقالات دينية وإسلامية متجددة يومياً من علماء موثوقين.' },
  { icon: '👶', title: 'قسم الأطفال', desc: 'قصص وألعاب ومحتوى تعليمي مخصص لأبنائنا الصغار.' },
];

const stats = [
  { num: '25+', label: 'نبي مع قصته الكاملة' },
  { num: '30+', label: 'غزوة وفتح إسلامي' },
  { num: '6236', label: 'آية قرآنية' },
  { num: '100+', label: 'دعاء مأثور' },
];

const team = [
  { name: 'فريق المحتوى', role: 'متخصصون في الشريعة الإسلامية والسيرة النبوية', icon: '📝' },
  { name: 'فريق التقنية', role: 'مطورو تطبيقات ويب بتقنيات حديثة', icon: '💻' },
  { name: 'فريق التصميم', role: 'مصممو تجربة المستخدم العربي', icon: '🎨' },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen" dir="rtl">
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-b from-[#071A13] via-[#0A2A1E] to-transparent overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none" aria-hidden>
          <div className="absolute top-8 right-16 text-6xl text-brand-gold/30 font-arabic">ذِكرٌ</div>
          <div className="absolute bottom-8 left-16 text-4xl text-brand-gold/20 font-arabic">﴿وَذَكِّرْ﴾</div>
        </div>
        <Container className="max-w-4xl text-center space-y-6 relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-brand-gold leading-tight">
            عن منصة <span className="font-arabic">ذِكرٌ</span>
          </h1>
          <p className="text-xl leading-9 text-brand-cream/80 max-w-2xl mx-auto">
            منصة روحانية رقمية عربية تجمع القرآن والحديث والقصص والعلم في تجربة حديثة
            وسهلة الوصول — للفرد والأسرة والناشئة.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link href="/quran" className="rounded-full border border-brand-gold/40 bg-brand-gold/10 px-6 py-2.5 text-brand-gold hover:bg-brand-gold/20 transition-colors text-sm font-semibold">
              تصفّح القرآن
            </Link>
            <Link href="/prophets" className="rounded-full border border-brand-gold/20 px-6 py-2.5 text-brand-cream/70 hover:text-brand-gold hover:border-brand-gold/40 transition-colors text-sm">
              قصص الأنبياء
            </Link>
          </div>
        </Container>
      </section>

      <Container className="max-w-5xl space-y-16 py-16">
        {/* Stats */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-brand-gold/15 bg-black/20 p-6 text-center space-y-2 hover:border-brand-gold/30 transition-colors">
                <p className="text-4xl font-bold text-brand-gold">{s.num}</p>
                <p className="text-sm text-brand-cream/55">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Mission */}
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-5">
            <h2 className="text-3xl font-bold text-brand-gold">رسالتنا</h2>
            <p className="leading-9 text-brand-cream/75">
              نؤمن بأن الوصول إلى المعرفة الإسلامية الموثوقة حق لكل مسلم في كل مكان.
              نبني منصة تجمع أفضل ما أُنتج من محتوى إسلامي وتقدّمه بتجربة رقمية
              عصرية تناسب المسلم المعاصر في زمن الشاشات والإنترنت.
            </p>
            <p className="leading-9 text-brand-cream/75">
              هدفنا ليس فقط توفير المعلومة، بل بناء رفيق روحاني يومي يساعدك
              على التذكر والتدبر والنمو في إيمانك.
            </p>
          </div>
          <div className="rounded-2xl border border-brand-gold/20 bg-brand-gold/5 p-8 text-center space-y-4">
            <p className="text-2xl font-arabic leading-loose text-brand-cream" dir="rtl">
              ﴿ وَذَكِّرْ فَإِنَّ الذِّكْرَىٰ تَنفَعُ الْمُؤْمِنِينَ ﴾
            </p>
            <p className="text-sm text-brand-gold/60">سورة الذاريات — الآية 55</p>
          </div>
        </section>

        {/* Features */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold text-brand-gold text-center">ما الذي تقدّمه المنصة؟</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f) => (
              <Card key={f.title} className="p-6 space-y-3 hover:border-brand-gold/30 transition-colors group">
                <div className="text-3xl" aria-hidden>{f.icon}</div>
                <h3 className="font-bold text-brand-gold group-hover:text-brand-goldSoft transition-colors">{f.title}</h3>
                <p className="text-sm leading-7 text-brand-cream/55">{f.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold text-brand-gold text-center">من نحن</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {team.map((t) => (
              <Card key={t.name} className="p-6 text-center space-y-3">
                <div className="text-4xl mx-auto" aria-hidden>{t.icon}</div>
                <h3 className="font-bold text-brand-gold">{t.name}</h3>
                <p className="text-sm leading-7 text-brand-cream/55">{t.role}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Vision */}
        <section className="rounded-2xl border border-brand-gold/20 bg-gradient-to-br from-black/30 to-brand-emerald/10 p-10 space-y-6">
          <h2 className="text-3xl font-bold text-brand-gold">رؤيتنا المستقبلية</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-brand-cream">قريباً</h3>
              <ul className="space-y-2 text-sm text-brand-cream/60 list-inside">
                <li className="flex items-start gap-2"><span className="text-brand-gold mt-0.5">◆</span> تطبيق جوال iOS وAndroid</li>
                <li className="flex items-start gap-2"><span className="text-brand-gold mt-0.5">◆</span> مزامنة التقدم بين الأجهزة</li>
                <li className="flex items-start gap-2"><span className="text-brand-gold mt-0.5">◆</span> خطط حفظ مخصصة بالذكاء الاصطناعي</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-brand-cream">هدفنا البعيد</h3>
              <ul className="space-y-2 text-sm text-brand-cream/60 list-inside">
                <li className="flex items-start gap-2"><span className="text-brand-gold mt-0.5">◆</span> 10 ملايين مستخدم يستفيدون يومياً</li>
                <li className="flex items-start gap-2"><span className="text-brand-gold mt-0.5">◆</span> دعم 30 لغة حول العالم</li>
                <li className="flex items-start gap-2"><span className="text-brand-gold mt-0.5">◆</span> أكاديمية إسلامية إلكترونية متكاملة</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-brand-gold">انضم إلى مجتمع ذِكرٌ</h2>
          <p className="text-brand-cream/60">شارك المنصة مع أهلك وأصدقائك لتعمّ الفائدة</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="rounded-full bg-brand-gold text-black px-8 py-3 font-bold hover:bg-brand-gold/90 transition-colors">
              تواصل معنا
            </Link>
            <Link href="/platform" className="rounded-full border border-brand-gold/30 px-8 py-3 text-brand-gold hover:bg-brand-gold/10 transition-colors">
              كيف تستخدم المنصة
            </Link>
          </div>
        </section>
      </Container>
    </main>
  );
}
