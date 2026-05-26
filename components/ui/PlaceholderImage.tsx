'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';

type PlaceholderType = 'videos' | 'scholars' | 'stories' | 'poetry';

const DEFAULT_PLACEHOLDER: Record<PlaceholderType, string> = {
  videos: '/placeholders/videos/video-placeholder.png',
  scholars: '/placeholders/scholars/scholar-placeholder.png',
  stories: '/placeholders/stories/story-placeholder.png',
  poetry: '/placeholders/poetry/poetry-placeholder.png',
};

interface PlaceholderImageProps {
  type: PlaceholderType;
  src?: string;
  alt: string;
  className?: string;
}

export function PlaceholderImage({ type, src, alt, className }: PlaceholderImageProps) {
  const [failed, setFailed] = useState(false);
  const finalSrc = useMemo(() => (failed || !src ? DEFAULT_PLACEHOLDER[type] : src), [failed, src, type]);

  return (
    <div className={cn('relative overflow-hidden rounded-xl bg-zinc-900', className)}>
      <Image src={finalSrc} alt={alt} fill loading='lazy' sizes='100vw' className='object-cover' onError={() => setFailed(true)} />
    </div>
  );
}
