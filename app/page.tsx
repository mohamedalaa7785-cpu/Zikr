'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';

const categories = [
  { icon: '📖', label: 'القرآن', href: '/quran' },
  { icon: '📜', label: 'الحديث', href: '/hadith' },
  { icon: '🎬', label: 'القصص', href: '/stories' },
  { icon: '🤲', label: 'الأذكار', href: '/adhkar' },
  { icon: '🙏', label: 'الأدعية', href: '/dua' },
  { icon: '📰', label: 'المقالات', href: '/articles' },
  { icon: '🎥', label: 'الفيديوهات', href: '/videos' },
  { icon: '🌟', label: 'قسم الأطفال', href: '/kids' },
  { icon: '👳', label: 'قصص الأنبياء', href: '/prophets' },
  { icon: '💚', label: 'الروحاني', href: '/spiritual-ai' },
  { icon: '✨', label: 'الشعر', href: '/poetry' },
  { icon: '🎓', label: 'العلماء', href: '/scholars' },
  { icon: '🏆', label: 'الحفظ', href: '/memorization' },
];

const stories = [
  { id: 1, title: 'قصة الصحابي الجليل', category: 'تاريخ إسلامي', image: '🌟' },
  { id: 2, title: 'درس من حياة الرسول', category: 'السيرة النبوية', image: '🌙' },
  { id: 3, title: 'معجزات القرآن', category: 'إعجاز قرآني', image: '✨' },
  { id: 4, title: 'حكايات من التاريخ', category: 'تراث إسلامي', image: '📚' },
  { id: 5, title: 'دروس روحانية', category: 'تطوير ذاتي', image: '💎' },
  { id: 6, title: 'قصص ملهمة', category: 'إلهام ديني', image: '🌺' },
];

const videos = [
  { id: 1, title: 'تلاوة مميزة', duration: '15:30', views: '2.5K' },
  { id: 2, title: 'شرح سورة الملك', duration: '22:15', views: '1.8K' },
  { id: 3, title: 'أحكام التجويد', duration: '18:45', views: '3.2K' },
  { id: 4, title: 'قصة مؤثرة', duration: '12:20', views: '4.1K' },
  { id: 5, title: 'درس قيم', duration: '25:00', views: '2.9K' },
  { id: 6, title: 'محاضرة إسلامية', duration: '35:10', views: '5.6K' },
];

const stats = [
  { label: 'سور قرآنية', value: '114' },
  { label: 'أحاديث', value: '10K+' },
  { label: 'قصص', value: '500+' },
  { label: 'مستخدمين', value: '50K+' },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className='min-h-screen bg-brand-emeraldDeep text-brand-cream'>
      {/* Main Dashboard Layout */}
      <div className='flex'>
        {/* Right Sidebar Navigation */}
        <aside className='hidden lg:flex w-64 flex-col border-l border-brand-gold/20 bg-brand-emeraldDeep/50 p-6 space-y-8 sticky top-16 h-[calc(100vh-4rem)]'>
          <div className='space-y-4'>
            <h3 className='text-sm font-bold text-brand-gold uppercase tracking-wider'>التنقل السريع</h3>
            <nav className='space-y-2'>
              {categories.map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className='flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-brand-cream hover:bg-brand-gold/10 hover:text-brand-gold transition-colors'
                >
                  <span className='text-lg'>{cat.icon}</span>
                  <span>{cat.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Daily Quote Widget */}
          <Card className='border-brand-gold/20 bg-black/20 p-4 space-y-3'>
            <h4 className='text-xs font-bold text-brand-gold uppercase'>الآية اليومية</h4>
            <p className='text-sm leading-relaxed text-brand-cream/80'>
              "وَعَسَىٰ أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ"
            </p>
            <p className='text-xs text-brand-gold/60'>البقرة - 216</p>
          </Card>

          {/* Prayer Times Widget */}
          <Card className='border-brand-gold/20 bg-black/20 p-4 space-y-3'>
            <h4 className='text-xs font-bold text-brand-gold uppercase'>أوقات الصلاة</h4>
            <div className='space-y-2 text-xs'>
              <div className='flex justify-between'>
                <span>الفجر</span>
                <span className='text-brand-gold'>04:30</span>
              </div>
              <div className='flex justify-between'>
                <span>الظهر</span>
                <span className='text-brand-gold'>12:15</span>
              </div>
              <div className='flex justify-between'>
                <span>العصر</span>
                <span className='text-brand-gold'>15:45</span>
              </div>
            </div>
          </Card>

          {/* Supplications Widget */}
          <Card className='border-brand-gold/20 bg-black/20 p-4 space-y-3'>
            <h4 className='text-xs font-bold text-brand-gold uppercase'>دعاء اليوم</h4>
            <p className='text-xs leading-relaxed text-brand-cream/80'>
              "اللهم اجعل لنا من كل خير نصيباً"
            </p>
          </Card>
        </aside>

        {/* Main Content Area */}
        <main className='flex-1'>
          {/* Hero Banner with Search */}
          <section className='relative border-b border-brand-gold/20 bg-gradient-to-b from-brand-emeraldDeep to-brand-emeraldDeep/80 px-4 py-12 md:py-20'>
            <Container className='space-y-8'>
              {/* Title */}
              <div className='text-center space-y-3'>
                <h1 className='text-4xl md:text-5xl font-bold text-brand-gold'>ذِكرٌ</h1>
                <p className='text-brand-cream/80 text-lg'>منصتك الروحانية الشاملة</p>
              </div>

              {/* Search Bar */}
              <div className='max-w-2xl mx-auto'>
                <div className='relative'>
                  <input
                    type='text'
                    placeholder='ابحث عن آية أو حديث أو قصة...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='w-full px-6 py-4 rounded-xl border border-brand-gold/30 bg-black/20 text-brand-cream placeholder:text-brand-cream/40 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20'
                  />
                  <button className='absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold hover:text-brand-goldSoft'>
                    🔍
                  </button>
                </div>
              </div>

              {/* Category Grid */}
              <div className='grid grid-cols-4 md:grid-cols-8 gap-3'>
                {categories.map((cat) => (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    className='flex flex-col items-center justify-center p-3 rounded-lg border border-brand-gold/20 bg-black/20 hover:bg-brand-gold/10 hover:border-brand-gold/50 transition-all'
                  >
                    <span className='text-2xl mb-1'>{cat.icon}</span>
                    <span className='text-xs text-center text-brand-cream/70 hover:text-brand-gold'>{cat.label}</span>
                  </Link>
                ))}
              </div>
            </Container>
          </section>

          {/* Stories Section */}
          <section className='border-b border-brand-gold/20 px-4 py-12'>
            <Container className='space-y-6'>
              <div className='flex items-center justify-between'>
                <h2 className='text-2xl font-bold text-brand-gold'>القصص والمحتوى</h2>
                <Link href='/stories' className='text-sm text-brand-gold hover:text-brand-goldSoft'>
                  عرض الكل →
                </Link>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {stories.map((story) => (
                  <Card
                    key={story.id}
                    className='border-brand-gold/20 bg-black/20 overflow-hidden hover:border-brand-gold/50 transition-all cursor-pointer group'
                  >
                    <div className='h-32 bg-gradient-to-br from-brand-gold/20 to-brand-emerald/20 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform'>
                      {story.image}
                    </div>
                    <div className='p-4 space-y-2'>
                      <p className='text-xs text-brand-gold/70'>{story.category}</p>
                      <h3 className='font-semibold text-brand-cream'>{story.title}</h3>
                    </div>
                  </Card>
                ))}
              </div>
            </Container>
          </section>

          {/* Videos Section */}
          <section className='border-b border-brand-gold/20 px-4 py-12'>
            <Container className='space-y-6'>
              <div className='flex items-center justify-between'>
                <h2 className='text-2xl font-bold text-brand-gold'>الفيديوهات المميزة</h2>
                <Link href='/youtube' className='text-sm text-brand-gold hover:text-brand-goldSoft'>
                  عرض الكل →
                </Link>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {videos.map((video) => (
                  <Card
                    key={video.id}
                    className='border-brand-gold/20 bg-black/20 overflow-hidden hover:border-brand-gold/50 transition-all cursor-pointer group'
                  >
                    <div className='relative h-40 bg-gradient-to-br from-brand-gold/20 to-brand-emerald/20 flex items-center justify-center'>
                      <div className='text-5xl group-hover:scale-110 transition-transform'>▶</div>
                      <div className='absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded text-xs text-brand-cream'>
                        {video.duration}
                      </div>
                    </div>
                    <div className='p-4 space-y-2'>
                      <h3 className='font-semibold text-brand-cream'>{video.title}</h3>
                      <p className='text-xs text-brand-gold/60'>{video.views} مشاهدة</p>
                    </div>
                  </Card>
                ))}
              </div>
            </Container>
          </section>

          {/* Statistics Footer Bar */}
          <section className='border-t border-brand-gold/20 bg-black/30 px-4 py-8'>
            <Container>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
                {stats.map((stat) => (
                  <div key={stat.label} className='text-center space-y-2'>
                    <div className='text-3xl md:text-4xl font-bold text-brand-gold'>{stat.value}</div>
                    <p className='text-sm text-brand-cream/70'>{stat.label}</p>
                  </div>
                ))}
              </div>
            </Container>
          </section>
        </main>
      </div>
    </div>
  );
}
