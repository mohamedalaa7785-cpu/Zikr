'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';

type ThumbnailKind = 'youtube' | 'documentaries' | 'poetry' | 'shorts';

const PLACEHOLDERS: Record<ThumbnailKind, string> = {
  youtube: '/thumbnails/youtube/default-thumb.png',
  documentaries: '/thumbnails/documentaries/default-thumb.png',
  poetry: '/placeholders/poetry/poetry-placeholder.png',
  shorts: '/thumbnails/shorts/default-thumb.png',
};

interface ThumbnailProps {
  src?: string;
  alt: string;
  kind: ThumbnailKind;
  className?: string;
}

export function Thumbnail({ src, alt, kind, className }: ThumbnailProps) {
  const [failed, setFailed] = useState(false);
  const finalSrc = useMemo(() => (failed || !src ? PLACEHOLDERS[kind] : src), [failed, kind, src]);

  return (
    <div className={cn('group relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-zinc-900', className)}>
      <Image
        src={finalSrc}
        alt={alt}
        fill
        loading='lazy'
        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        className='object-cover transition-transform duration-500 group-hover:scale-105'
        onError={() => setFailed(true)}
      />
      <div className='absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent' />
    </div>
  );
}
