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
    body: 'تصفح السور بسرعة، مع تجربة قراءة واضحة وهادئة على كل الأجهزة.',
    href: '/quran',
  },
  {
    title: 'الأحاديث النبوية',
    body: 'استكشاف منظم للأحاديث مع بنية قابلة للتوسع والبحث لاحقًا.',
    href: '/hadith',
  },
  {
    title: 'قصص وعبر',
    body: 'عرض قصصي بسيط ومتماسك بصريًا لرحلات الإيمان والتأمل.',
    href: '/stories',
  },
  {
    title: 'العلماء والدعاة',
    body: 'واجهة أولية منظمة لعرض العلماء والمحتوى المعرفي المرتبط بهم.',
    href: '/scholars',
  },
];

export default async function HomePage() {
  const [homepage, pinnedMessages] = await Promise.all([getSiteSetting('homepage'), getPinnedMessages(2)]);
  return (
    <Container className='space-y-14 py-10 md:space-y-20 md:py-16'>
      <section className='space-y-8'>
        <HeroBanner
          title={homepage?.title || 'ZIKR | ذِكرٌ'}
          subtitle={homepage?.body || 'منصة روحانية سينمائية تجمع القرآن والحديث والقصص والعلم في تجربة متوازنة وثابتة.'}
          imageSrc={homepage?.imageUrl || undefined}
        />

        <div className='flex flex-wrap items-center justify-end gap-3'>
          <Badge>تجربة إسلامية متميزة</Badge>
          <Button href='/quran'>ابدأ التلاوة</Button>
          <Button variant='secondary' href='/memorization'>خطة الحفظ</Button>
          <Button variant='secondary' href='/competitions'>المسابقات</Button>
          <Button variant='secondary' href='#previews'>استعرض الأقسام</Button>
        </div>
      </section>

      {pinnedMessages.length || homepage?.pinnedMessage ? (
        <section className='grid gap-3 md:grid-cols-2'>
          {homepage?.pinnedMessage ? <Card className='border-brand-gold/40'><h2 className='text-xl text-brand-gold'>رسالة مثبتة</h2><p className='mt-2 leading-8 arabic-muted'>{homepage.pinnedMessage}</p></Card> : null}
          {pinnedMessages.map((message) => <Card key={message.id} className='border-brand-gold/40'><h2 className='text-xl text-brand-gold'>{message.title}</h2><p className='mt-2 leading-8 arabic-muted'>{message.body}</p>{message.cta_href ? <div className='mt-3'><Button href={message.cta_href} variant='ghost'>{message.cta_label ?? 'المزيد'}</Button></div> : null}</Card>)}
        </section>
      ) : null}

      <section id='previews' className='space-y-6'>
        <SectionHeader
          title='واجهة رئيسية ثابتة وقابلة للتوسع'
          subtitle='بنية عرض تمهيدية لأقسام Quran وHadith وStories وScholars ضمن هوية ZIKR | ذِكرٌ.'
        />

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {sections.map((section) => (
            <Card key={section.title} className='flex h-full flex-col justify-between space-y-3'>
              <h3 className='text-lg font-semibold text-brand-gold'>{section.title}</h3>
              <p className='text-sm leading-7 arabic-muted'>{section.body}</p>
              <div className='pt-1'>
                <Button variant='ghost' href={section.href}>
                  دخول القسم
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </Container>
  );
}
