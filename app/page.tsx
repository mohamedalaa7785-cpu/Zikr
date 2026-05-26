'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { HeroBanner } from '@/components/ui/HeroBanner';
import { Logo } from '@/components/ui/Logo';
import { SectionHeader } from '@/components/ui/section-header';
import { Thumbnail } from '@/components/ui/Thumbnail';

const sections = ['القرآن', 'الأحاديث', 'العلماء', 'القصص', 'مواقيت الصلاة', 'الذكر'];

export default function HomePage() {
  return (
    <Container className='space-y-16 py-12 md:py-20'>
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='space-y-8'>
        <HeroBanner
          title='ذِكرٌ'
          subtitle='منصة روحانية تجمع القرآن والحديث والقصص والعلم في تجربة حديثة.'
        />
        <div className='grid items-center gap-8 md:grid-cols-2'>
          <div className='space-y-5 text-right'>
            <Badge>منصة روحانية</Badge>
            <div className='flex justify-end'>
              <Logo variant='gold' width={220} height={88} priority />
            </div>
            <div className='flex flex-wrap justify-end gap-3'>
              <Button href='/quran'>ابدأ الآن</Button>
              <Button variant='secondary' href='#sections'>
                استكشف الأقسام
              </Button>
            </div>
          </div>
          <Card className='p-4'>
            <Thumbnail kind='youtube' alt='ZIKR featured thumbnail' />
          </Card>
        </div>
      </motion.section>

      <section id='sections'>
        <SectionHeader title='أقسام ZIKR' subtitle='رحلة متكاملة بين العلم والسكينة.' />
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {sections.map((s) => (
            <Card key={s}>
              <h3 className='text-xl text-brand-gold'>{s}</h3>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title='مختارات اليوم' />
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          {['آية اليوم', 'حديث اليوم', 'Stories preview', 'Scholars preview'].map((x) => (
            <Card key={x}>
              <p className='text-brand-gold'>{x}</p>
              <p className='mt-2 text-sm arabic-muted'>محتوى تجريبي مؤقت للعرض.</p>
            </Card>
          ))}
        </div>
      </section>
    </Container>
  );
}
