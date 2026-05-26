'use client';

import Image from 'next/image';
import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';

interface HeroBannerProps {
  className?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  imageSrc?: string;
}

const DEFAULT_HERO = '/banners/homepage/main-hero.png';
const HERO_FALLBACK = '/backgrounds/dark/night-gradient.png';

export function HeroBanner({ className, title, subtitle, imageSrc = DEFAULT_HERO }: HeroBannerProps) {
  const [src, setSrc] = useState(imageSrc);

  return (
    <section className={cn('relative overflow-hidden rounded-3xl border border-white/10 min-h-[280px] md:min-h-[360px]', className)}>
      <Image
        src={src}
        alt='ZIKR hero banner'
        fill
        priority
        sizes='100vw'
        className='object-cover object-center scale-[1.02]'
        onError={() => setSrc(HERO_FALLBACK)}
      />
      <div className='absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-black/75' />
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_70%_15%,rgba(212,175,55,0.20),transparent_45%)]' />
      <div className='absolute inset-0 backdrop-blur-[1px]' />
      <div className='relative z-10 p-6 text-right md:p-10 lg:p-14'>
        {title && <h1 className='text-balance text-3xl font-bold leading-tight text-brand-gold md:text-5xl'>{title}</h1>}
        {subtitle && <p className='mt-4 max-w-3xl text-base text-zinc-100/90 md:text-lg'>{subtitle}</p>}
      </div>
    </section>
  );
}
