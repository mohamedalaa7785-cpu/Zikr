'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';

type Platform = 'facebook' | 'youtube' | 'instagram' | 'tiktok';

const DEFAULT_SRC: Record<Platform, string> = {
  facebook: '/social/facebook/facebook-cover.png',
  youtube: '/social/youtube/youtube-banner.png',
  instagram: '/social/instagram/instagram-post-template.png',
  tiktok: '/social/tiktok/tiktok-thumbnail.png',
};

interface SocialBannerProps {
  platform: Platform;
  src?: string;
  className?: string;
}

export function SocialBanner({ platform, src, className }: SocialBannerProps) {
  const [failed, setFailed] = useState(false);
  const finalSrc = useMemo(() => (failed ? '/ui/media-fallback.png' : src || DEFAULT_SRC[platform]), [failed, platform, src]);

  return (
    <div className={cn('relative aspect-[16/6] overflow-hidden rounded-xl border border-white/10', className)}>
      <Image src={finalSrc} alt={`${platform} banner`} fill loading='lazy' sizes='100vw' className='object-cover' onError={() => setFailed(true)} />
    </div>
  );
}
