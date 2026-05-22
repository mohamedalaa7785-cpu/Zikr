import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ZIKR | ذِكرٌ',
    short_name: 'ZIKR',
    description: 'Cinematic Islamic platform foundation.',
    start_url: '/',
    display: 'standalone',
    background_color: '#020203',
    theme_color: '#0d1b2a',
    icons: [{ src: '/zikr-favicon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
