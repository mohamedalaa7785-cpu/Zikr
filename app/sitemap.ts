import type { MetadataRoute } from 'next';
import { hadithBooks, hadiths, surahs } from '@/lib/data/content';
export default function sitemap(): MetadataRoute.Sitemap {
  const base='https://zikr.app';
  const routes=['','/quran','/hadith','/stories','/scholars','/prayer','/adhkar','/search'];
  return [
    ...routes.map((r)=>({url:`${base}${r}`,lastModified:new Date()})),
    ...surahs.map((s)=>({url:`${base}/quran/${s.id}`,lastModified:new Date()})),
    ...hadithBooks.map((b)=>({url:`${base}/hadith/${b.slug}`,lastModified:new Date()})),
    ...hadiths.map((h)=>({url:`${base}/hadith/${hadithBooks[0].slug}/${h.hadithNumber}`,lastModified:new Date()})),
  ];
}
