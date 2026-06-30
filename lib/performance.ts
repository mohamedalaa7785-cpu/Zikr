/**
 * Performance Optimization Utilities
 * Handles caching, lazy loading, and performance monitoring
 */

/**
 * Cache configuration for different content types
 */
export const CACHE_CONFIG = {
  // Static content (24 hours)
  QURAN: 'public, max-age=86400, stale-while-revalidate=604800',
  HADITH: 'public, max-age=86400, stale-while-revalidate=604800',
  SCHOLARS: 'public, max-age=86400, stale-while-revalidate=604800',
  STORIES: 'public, max-age=86400, stale-while-revalidate=604800',
  
  // User-specific content (1 hour)
  PROFILE: 'private, max-age=3600, must-revalidate',
  FAVORITES: 'private, max-age=3600, must-revalidate',
  PROGRESS: 'private, max-age=3600, must-revalidate',
  
  // Dynamic content (5 minutes)
  PRAYER_TIMES: 'public, max-age=300, stale-while-revalidate=600',
  VIDEOS: 'public, max-age=300, stale-while-revalidate=600',
  
  // Real-time content (no cache)
  SEARCH: 'no-cache, no-store, must-revalidate',
  ADMIN: 'no-cache, no-store, must-revalidate',
};

/**
 * Image optimization configuration
 */
export const IMAGE_OPTIMIZATION = {
  sizes: {
    thumbnail: 200,
    small: 400,
    medium: 800,
    large: 1200,
    xlarge: 1920,
  },
  formats: ['image/avif', 'image/webp', 'image/jpeg'],
  quality: {
    thumbnail: 60,
    small: 70,
    medium: 80,
    large: 85,
    xlarge: 90,
  },
};

/**
 * Generate responsive image sizes string
 */
export function generateImageSizes(
  type: 'thumbnail' | 'small' | 'medium' | 'large' | 'xlarge' = 'medium'
): string {
  const config = IMAGE_OPTIMIZATION.sizes;
  return `(max-width: 640px) ${config.small}px, (max-width: 1024px) ${config.medium}px, ${config[type]}px`;
}

/**
 * Generate srcSet for responsive images
 */
export function generateSrcSet(baseUrl: string, type: 'thumbnail' | 'small' | 'medium' | 'large' | 'xlarge' = 'medium'): string {
  const sizes = IMAGE_OPTIMIZATION.sizes;
  const sizeValues = Object.values(sizes);
  
  return sizeValues
    .map((size) => `${baseUrl}?w=${size} ${size}w`)
    .join(', ');
}

/**
 * Debounce function for performance-critical operations
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Throttle function for performance-critical operations
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Measure performance of async operations
 */
export async function measurePerformance<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = performance.now();
  try {
    const result = await fn();
    const end = performance.now();
    console.log(`[performance] ${name}: ${(end - start).toFixed(2)}ms`);
    return result;
  } catch (error) {
    const end = performance.now();
    console.error(`[performance] ${name} failed: ${(end - start).toFixed(2)}ms`, error);
    throw error;
  }
}

/**
 * Lazy load components
 */
export function createLazyComponent(
  importFn: () => Promise<{ default: React.ComponentType<unknown> }>,
  fallback?: React.ReactNode
) {
  const Component = React.lazy(importFn);
  
  return (props: Record<string, unknown>) => {
    const fallbackElement = fallback || 'جاري التحميل...';
    return React.createElement(
      React.Suspense,
      { fallback: fallbackElement },
      React.createElement(Component as React.ComponentType<Record<string, unknown>>, props)
    );
  };
}

/**
 * Prefetch data for better UX
 */
export async function prefetchData(urls: string[]): Promise<void> {
  if (typeof window === 'undefined') return;
  
  for (const url of urls) {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    link.as = 'fetch';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  }
}

/**
 * Preload critical resources
 */
export function preloadResource(
  href: string,
  type: 'script' | 'style' | 'font' | 'image' = 'script'
): void {
  if (typeof window === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = type;
  
  if (type === 'font') {
    link.crossOrigin = 'anonymous';
  }
  
  document.head.appendChild(link);
}

/**
 * Get cache headers for API responses
 */
export function getCacheHeaders(contentType: keyof typeof CACHE_CONFIG): Record<string, string> {
  return {
    'Cache-Control': CACHE_CONFIG[contentType],
    'CDN-Cache-Control': CACHE_CONFIG[contentType],
  };
}

/**
 * Optimize bundle size by removing unused code
 */
export const BUNDLE_OPTIMIZATION = {
  // Tree-shakeable exports
  treeshake: true,
  
  // Code splitting
  codesplit: {
    vendor: true,
    common: true,
  },
  
  // Minification
  minify: true,
  
  // Compression
  compression: 'gzip',
};

// Re-export React for lazy loading
import React from 'react';
