import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { HeroBanner } from '@/components/ui/HeroBanner';
import { SectionHeader } from '@/components/ui/section-header';
import { getPinnedMessages, getSiteSetting } from '@/lib/services/site-content';

const sections = [
  {
    title: 'القرآن الكريم',
    body: 'تصفح السور بسرعة مع تجربة قراءة واضحة واستماع للتلاوات بأصوات أشهر القراء.',
    href: '/quran',
    icon: '📖',
  },
  {
    title: 'الأحاديث النبوية',
    body: 'استكشاف منظم للأحاديث الشريفة من صحيح البخاري ومسلم وغيرها.',
    href: '/hadith',
    icon: '📜',
  },
  {
    title: 'القصص والمحتوى المرئي',
    body: 'قصص ملهمة من التاريخ الإسلامي ومحتوى مرئي من يوتيوب يغذي الروح والعقل.',
    href: '/stories',
    icon: '🎬',
  },
  {
    title: 'الأذكار والأدعية',
    body: 'أذكار الصباح والمساء وأدعية متنوعة مع عداد تفاعلي للتسبيح.',
    href: '/adhkar',
    icon: '🤲',
  },
  {
    title: 'الرفيق الروحاني',
    body: 'اكتب ما تشعر به واحصل على آيات وأحاديث وأذكار تناسب حالتك بالذكاء الاصطناعي.',
    href: '/spiritual-ai',
    icon: '💚',
  },
  {
    title: 'الشعر الإسلامي',
    body: 'روائع الشعر الإسلامي من البردة إلى قصائد الحكمة، واكتب قصائدك الخاصة مع تحليل AI.',
    href: '/poetry',
    icon: '✨',
  },
  {
    title: 'العلماء والدعاة',
    body: 'تعرف على العلماء والدعاة والمحتوى المعرفي المرتبط بهم.',
    href: '/scholars',
    icon: '🎓',
  },
  {
    title: 'خطة الحفظ',
    body: 'خطط مخصصة لحفظ القرآن الكريم مع متابعة التقدم والتسميع الصوتي.',
    href: '/memorization',
    icon: '🏆',
  },
];

export default async function HomePage() {
  const [homepage, pinnedMessages] = await Promise.all([getSiteSetting('homepage'), getPinnedMessages(2)]);
  return (
    <Container className='space-y-14 py-10 md:space-y-20 md:py-16'>
      <section className='space-y-8'>
        <HeroBanner
          title={homepage?.title || 'ZIKR | ذِكرٌ'}
          subtitle={homepage?.body || 'منصة روحانية شاملة تجمع القرآن والحديث والقصص والأذكار والشعر في تجربة إيمانية متكاملة.'}
          imageSrc={homepage?.imageUrl || undefined}
        />

        <div className='flex flex-wrap items-center justify-center gap-3'>
          <Badge className="text-lg px-4 py-2">تجربة إسلامية متميزة</Badge>
        </div>

        <div className='flex flex-wrap items-center justify-center gap-3'>
          <Button href='/quran'>ابدأ التلاوة</Button>
          <Button variant='secondary' href='/spiritual-ai'>الرفيق الروحاني</Button>
          <Button variant='secondary' href='/adhkar'>الأذكار</Button>
          <Button variant='secondary' href='/memorization'>خطة الحفظ</Button>
          <Button variant='ghost' href='#sections'>استعرض الأقسام</Button>
        </div>
      </section>

      {pinnedMessages.length || homepage?.pinnedMessage ? (
        <section className='grid gap-3 md:grid-cols-2'>
          {homepage?.pinnedMessage ? (
            <Card className='border-brand-gold/40'>
              <h2 className='text-xl text-brand-gold'>رسالة مثبتة</h2>
              <p className='mt-2 leading-8 arabic-muted'>{homepage.pinnedMessage}</p>
            </Card>
          ) : null}
          {pinnedMessages.map((message) => (
            <Card key={message.id} className='border-brand-gold/40'>
              <h2 className='text-xl text-brand-gold'>{message.title}</h2>
              <p className='mt-2 leading-8 arabic-muted'>{message.body}</p>
              {message.cta_href ? (
                <div className='mt-3'>
                  <Button href={message.cta_href} variant='ghost'>{message.cta_label ?? 'المزيد'}</Button>
                </div>
              ) : null}
            </Card>
          ))}
        </section>
      ) : null}

      <section id='sections' className='space-y-8'>
        <SectionHeader
          title='أقسام المنصة'
          subtitle='استكشف جميع الأقسام واستفد من محتوى روحاني متنوع ومتكامل'
        />

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {sections.map((section) => (
            <Card key={section.title} className='flex h-full flex-col justify-between space-y-3 hover:border-brand-gold/50 transition-colors'>
              <div className="text-3xl mb-2">{section.icon}</div>
              <h3 className='text-lg font-semibold text-brand-gold'>{section.title}</h3>
              <p className='text-sm leading-7 arabic-muted flex-1'>{section.body}</p>
              <div className='pt-1'>
                <Button variant='ghost' href={section.href}>
                  دخول القسم
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className='text-center space-y-6'>
        <Card className='py-8 space-y-4 bg-brand-gold/5 border-brand-gold/30'>
          <h2 className='text-2xl font-bold text-brand-gold'>ابدأ رحلتك الإيمانية الآن</h2>
          <p className='arabic-muted max-w-xl mx-auto leading-7'>
            سجل الدخول لحفظ تقدمك في الحفظ، وإضافة الآيات والأحاديث المفضلة، والمشاركة في المسابقات.
          </p>
          <div className='flex flex-wrap justify-center gap-3'>
            <Button href='/auth/login'>تسجيل الدخول</Button>
            <Button variant='secondary' href='/auth/register'>إنشاء حساب جديد</Button>
          </div>
        </Card>
      </section>
    </Container>
  );
}
