'use client';

import Image, { ImageProps } from 'next/image';
import { CSSProperties } from 'react';

interface OptimizedImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  src: string;
  alt: string;
  /**
   * Width in pixels. Required for proper layout and avoiding CLS.
   */
  width: number;
  /**
   * Height in pixels. Required for proper layout and avoiding CLS.
   */
  height: number;
  /**
   * Responsive sizes for different breakpoints
   * @default "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
   */
  sizes?: string;
  /**
   * Whether to use blur placeholder. Disable for very fast images.
   * @default true
   */
  useBlur?: boolean;
  /**
   * Custom aspect ratio class for container
   */
  aspectRatio?: string;
  /**
   * CSS class for container
   */
  containerClassName?: string;
  /**
   * Whether to enable lazy loading
   * @default true
   */
  lazy?: boolean;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  useBlur = true,
  aspectRatio = 'aspect-video',
  containerClassName = '',
  lazy = true,
  className = '',
  ...props
}: OptimizedImageProps) {
  const containerStyle: CSSProperties = {
    position: 'relative',
    width: '100%',
    aspectRatio: width && height ? `${width} / ${height}` : undefined,
  };

  return (
    <div
      className={`overflow-hidden rounded-lg ${aspectRatio} ${containerClassName}`}
      style={containerStyle}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        loading={lazy ? 'lazy' : 'eager'}
        placeholder={useBlur ? 'blur' : 'empty'}
        blurDataURL={useBlur ? getBlurImage(width, height) : undefined}
        quality={85}
        className={`w-full h-full object-cover ${className}`}
        {...props}
      />
    </div>
  );
}

/**
 * Generate a small blur placeholder based on aspect ratio.
 * In production, use actual blurDataURL from image optimization API.
 */
function getBlurImage(width: number, height: number): string {
  // Minimal SVG blur placeholder
  const aspect = width / height;
  const w = aspect > 1 ? 100 : Math.round(100 / aspect);
  const h = aspect > 1 ? Math.round(100 / aspect) : 100;

  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'%3E%3Crect fill='%23333' width='${w}' height='${h}'/%3E%3C/svg%3E`;
}
