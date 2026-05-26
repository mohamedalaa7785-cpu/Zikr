'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { SectionHeader } from '@/components/ui/section-header';

const sections=['القرآن','الأحاديث','العلماء','القصص','مواقيت الصلاة','الذكر'];
export default function HomePage(){return <Container className='space-y-16 py-12 md:py-20'><motion.section initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className='grid items-center gap-8 md:grid-cols-2'><div className='space-y-5 text-right'><Badge>منصة روحانية</Badge><h1 className='text-6xl font-bold text-brand-gold'>ذِكرٌ</h1><p className='text-lg arabic-muted'>منصة روحانية تجمع القرآن والحديث والقصص والعلم في تجربة حديثة.</p><div className='flex flex-wrap justify-end gap-3'><Button href='/quran'>ابدأ الآن</Button><Button variant='secondary' href='#sections'>استكشف الأقسام</Button></div></div><Card><Image src='/brand/zikr-logo-2.jpg' alt='ZIKR logo' width={600} height={600} className='mx-auto rounded-2xl'/></Card></motion.section>
<section id='sections'><SectionHeader title='أقسام ZIKR' subtitle='رحلة متكاملة بين العلم والسكينة.'/><div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>{sections.map(s=><Card key={s}><h3 className='text-xl text-brand-gold'>{s}</h3></Card>)}</div></section>
<section><SectionHeader title='مختارات اليوم'/><div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>{['آية اليوم','حديث اليوم','Stories preview','Scholars preview'].map(x=><Card key={x}><p className='text-brand-gold'>{x}</p><p className='mt-2 text-sm arabic-muted'>محتوى تجريبي مؤقت للعرض.</p></Card>)}</div></section>
<section><SectionHeader title='وضع السكينة' subtitle='اقتباس الذكر اليومي والتجربة الهادئة.'/><Card><p className='text-xl text-brand-gold'>﴿أَلا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ﴾</p><p className='mt-3 arabic-muted'>قريبًا: تجربة تفاعلية تساعدك على الثبات والطمأنينة.</p></Card></section></Container>}
