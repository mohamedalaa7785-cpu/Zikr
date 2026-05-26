import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { HeroBanner } from '@/components/ui/HeroBanner';
import { SectionHeader } from '@/components/ui/section-header';

const sections = [
  {
    title: 'Quran Preview',
    body: 'تصفح السور بسرعة، مع تجربة قراءة واضحة وهادئة على كل الأجهزة.',
    href: '/quran',
  },
  {
    title: 'Hadith Preview',
    body: 'استكشاف منظم للأحاديث مع بنية قابلة للتوسع والبحث لاحقًا.',
    href: '/hadith',
  },
  {
    title: 'Stories Preview',
    body: 'عرض قصصي بسيط ومتماسك بصريًا لرحلات الإيمان والتأمل.',
    href: '/stories',
  },
  {
    title: 'Scholars Preview',
    body: 'واجهة أولية منظمة لعرض العلماء والمحتوى المعرفي المرتبط بهم.',
    href: '/scholars',
  },
];

export default function HomePage() {
  return (
    <Container className='space-y-14 py-10 md:space-y-20 md:py-16'>
      <section className='space-y-8'>
        <HeroBanner
          title='ZIKR | ذِكرٌ'
          subtitle='منصة روحانية سينمائية تجمع القرآن والحديث والقصص والعلم في تجربة متوازنة وثابتة.'
        />

        <div className='flex flex-wrap items-center justify-end gap-3'>
          <Badge>Premium Islamic Experience</Badge>
          <Button href='/quran'>ابدأ التلاوة</Button>
          <Button variant='secondary' href='#previews'>استعرض الأقسام</Button>
        </div>
      </section>

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
