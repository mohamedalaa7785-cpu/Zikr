import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/dashboard', '/assistant', '/tasks', '/payment', '/research-request', '/api'],
    },
    sitemap: 'https://zikr-platform.vercel.app/sitemap.xml',
  };
}
