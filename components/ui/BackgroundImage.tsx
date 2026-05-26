'use client';

import Image from 'next/image';
import { ReactNode, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';

type BackgroundTheme = 'islamic' | 'dark' | 'serenity' | 'night';

const BACKGROUNDS: Record<BackgroundTheme, string> = {
  islamic: '/backgrounds/islamic/islamic-pattern.png',
  dark: '/backgrounds/dark/dark-bg.png',
  serenity: '/backgrounds/serenity/serenity-bg.png',
  night: '/backgrounds/night/night-sky.png',
};

interface BackgroundImageProps {
  theme?: BackgroundTheme;
  src?: string;
  className?: string;
  children?: ReactNode;
}

export function BackgroundImage({ theme = 'dark', src, className, children }: BackgroundImageProps) {
  const [failed, setFailed] = useState(false);
  const finalSrc = useMemo(() => (failed ? BACKGROUNDS.dark : src || BACKGROUNDS[theme]), [failed, src, theme]);

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <Image src={finalSrc} alt={`${theme} background`} fill sizes='100vw' className='object-cover' onError={() => setFailed(true)} />
      <div className='absolute inset-0 bg-black/35' />
      <div className='relative z-10'>{children}</div>
    </div>
  );
}
