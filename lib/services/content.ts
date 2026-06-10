import { supabaseServerAdminRequest } from '@/lib/supabase/server';

export interface ArticleCategory {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  icon?: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  content?: string;
  author?: string;
  featuredImageUrl?: string;
  views: number;
  published: boolean;
  categoryId?: string;
  tags?: string[];
  createdAt: string;
}

export interface VideoCategory {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  icon?: string;
}

export interface Video {
  id: string;
  title: string;
  slug: string;
  description?: string;
  youtubeId?: string;
  thumbnailUrl?: string;
  duration?: number;
  views: number;
  published: boolean;
  categoryId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

// Articles
export async function getArticleCategories(): Promise<ArticleCategory[]> {
  const rows = await supabaseServerAdminRequest<any[]>(
    '/rest/v1/article_categories?select=id,name_ar,name_en,slug,icon&published=eq.true&order=name_ar.asc'
  ).catch(() => []);
  
  return rows.map(r => ({
    id: r.id,
    nameAr: r.name_ar,
    nameEn: r.name_en,
    slug: r.slug,
    icon: r.icon
  }));
}

export async function getArticles(categoryId?: string, limit = 20): Promise<Article[]> {
  let query = '/rest/v1/articles?select=id,title,slug,summary,author,featured_image_url,views,published,category_id,tags,created_at&published=eq.true&order=created_at.desc';
  
  if (categoryId && categoryId !== 'all') {
    query += `&category_id=eq.${categoryId}`;
  }
  
  query += `&limit=${limit}`;

  const rows = await supabaseServerAdminRequest<any[]>(query).catch(() => []);
  
  return rows.map(r => ({
    id: r.id,
    title: r.title,
    slug: r.slug,
    summary: r.summary,
    author: r.author,
    featuredImageUrl: r.featured_image_url,
    views: r.views || 0,
    published: r.published,
    categoryId: r.category_id,
    tags: r.tags,
    createdAt: r.created_at
  }));
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const rows = await supabaseServerAdminRequest<any[]>(
    `/rest/v1/articles?select=*&slug=eq.${slug}&published=eq.true&limit=1`
  ).catch(() => []);
  
  if (!rows.length) return null;
  const r = rows[0];
  
  return {
    id: r.id,
    title: r.title,
    slug: r.slug,
    summary: r.summary,
    content: r.content,
    author: r.author,
    featuredImageUrl: r.featured_image_url,
    views: r.views || 0,
    published: r.published,
    categoryId: r.category_id,
    tags: r.tags,
    createdAt: r.created_at
  };
}

// Videos
export async function getVideoCategories(): Promise<VideoCategory[]> {
  const rows = await supabaseServerAdminRequest<any[]>(
    '/rest/v1/video_categories?select=id,name_ar,name_en,slug,icon&published=eq.true&order=name_ar.asc'
  ).catch(() => []);
  
  return rows.map(r => ({
    id: r.id,
    nameAr: r.name_ar,
    nameEn: r.name_en,
    slug: r.slug,
    icon: r.icon
  }));
}

export async function getVideos(categoryId?: string, limit = 20): Promise<Video[]> {
  let query = '/rest/v1/videos?select=id,title,slug,description,youtube_id,thumbnail_url,duration,views,published,category_id,metadata,created_at&published=eq.true&order=created_at.desc';
  
  if (categoryId && categoryId !== 'all') {
    query += `&category_id=eq.${categoryId}`;
  }
  
  query += `&limit=${limit}`;

  const rows = await supabaseServerAdminRequest<any[]>(query).catch(() => []);
  
  return rows.map(r => ({
    id: r.id,
    title: r.title,
    slug: r.slug,
    description: r.description,
    youtubeId: r.youtube_id,
    thumbnailUrl: r.thumbnail_url,
    duration: r.duration,
    views: r.views || 0,
    published: r.published,
    categoryId: r.category_id,
    metadata: r.metadata,
    createdAt: r.created_at
  }));
}

export async function getVideoBySlug(slug: string): Promise<Video | null> {
  const rows = await supabaseServerAdminRequest<any[]>(
    `/rest/v1/videos?select=*&slug=eq.${slug}&published=eq.true&limit=1`
  ).catch(() => []);
  
  if (!rows.length) return null;
  const r = rows[0];
  
  return {
    id: r.id,
    title: r.title,
    slug: r.slug,
    description: r.description,
    youtubeId: r.youtube_id,
    thumbnailUrl: r.thumbnail_url,
    duration: r.duration,
    views: r.views || 0,
    published: r.published,
    categoryId: r.category_id,
    metadata: r.metadata,
    createdAt: r.created_at
  };
}

// Duas
export interface DuaCategory {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  icon?: string;
}

export interface Dua {
  id: string;
  titleAr: string;
  titleEn: string;
  slug: string;
  textAr: string;
  textEn?: string;
  occasionAr?: string;
  sourceAr?: string;
  benefitsAr?: string;
  categoryId?: string;
  published: boolean;
}

export async function getDuaCategories(): Promise<DuaCategory[]> {
  const rows = await supabaseServerAdminRequest<any[]>(
    '/rest/v1/dua_categories?select=id,name_ar,name_en,slug,icon&published=eq.true&order=name_ar.asc'
  ).catch(() => []);
  
  return rows.map(r => ({
    id: r.id,
    nameAr: r.name_ar,
    nameEn: r.name_en,
    slug: r.slug,
    icon: r.icon
  }));
}

export async function getDuas(categoryId?: string, limit = 50): Promise<Dua[]> {
  let query = '/rest/v1/duas?select=id,title_ar,title_en,slug,text_ar,occasion_ar,source_ar,benefits_ar,category_id,published&published=eq.true';
  
  if (categoryId && categoryId !== 'all') {
    query += `&category_id=eq.${categoryId}`;
  }
  
  query += `&limit=${limit}`;

  const rows = await supabaseServerAdminRequest<any[]>(query).catch(() => []);
  
  return rows.map(r => ({
    id: r.id,
    titleAr: r.title_ar,
    titleEn: r.title_en,
    slug: r.slug,
    textAr: r.text_ar,
    occasionAr: r.occasion_ar,
    sourceAr: r.source_ar,
    benefitsAr: r.benefits_ar,
    categoryId: r.category_id,
    published: r.published
  }));
}

export async function getDuaBySlug(slug: string): Promise<Dua | null> {
  const rows = await supabaseServerAdminRequest<any[]>(
    `/rest/v1/duas?select=*&slug=eq.${slug}&published=eq.true&limit=1`
  ).catch(() => []);
  
  if (!rows.length) return null;
  const r = rows[0];
  
  return {
    id: r.id,
    titleAr: r.title_ar,
    titleEn: r.title_en,
    slug: r.slug,
    textAr: r.text_ar,
    textEn: r.text_en,
    occasionAr: r.occasion_ar,
    sourceAr: r.source_ar,
    benefitsAr: r.benefits_ar,
    categoryId: r.category_id,
    published: r.published
  };
}

// Prophets
export interface Prophet {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  bioAr?: string;
  featuredImageUrl?: string;
  thumbnailUrl?: string;
  orderNum?: number;
  published: boolean;
}

export async function getProphets(limit = 50): Promise<Prophet[]> {
  const rows = await supabaseServerAdminRequest<any[]>(
    '/rest/v1/prophets?select=*&published=eq.true&order=order_num.asc'
  ).catch(() => []);
  
  return rows.map(r => ({
    id: r.id,
    nameAr: r.name_ar,
    nameEn: r.name_en,
    slug: r.slug,
    bioAr: r.bio_ar,
    featuredImageUrl: r.featured_image_url,
    thumbnailUrl: r.thumbnail_url,
    orderNum: r.order_num,
    published: r.published
  }));
}

export async function getProphetBySlug(slug: string): Promise<Prophet | null> {
  const rows = await supabaseServerAdminRequest<any[]>(
    `/rest/v1/prophets?select=*&slug=eq.${slug}&published=eq.true&limit=1`
  ).catch(() => []);
  
  if (!rows.length) return null;
  const r = rows[0];
  
  return {
    id: r.id,
    nameAr: r.name_ar,
    nameEn: r.name_en,
    slug: r.slug,
    bioAr: r.bio_ar,
    featuredImageUrl: r.featured_image_url,
    thumbnailUrl: r.thumbnail_url,
    orderNum: r.order_num,
    published: r.published
  };
}

// Prophet Sections
export interface ProphetSection {
  id: string;
  titleAr: string;
  titleEn?: string;
  contentAr: string;
  contentEn?: string;
  sectionType?: string;
  orderNum?: number;
}

export async function getProphetSections(prophetId: string): Promise<ProphetSection[]> {
  const rows = await supabaseServerAdminRequest<any[]>(
    `/rest/v1/prophet_sections?select=*&prophet_id=eq.${prophetId}&order=order_num.asc`
  ).catch(() => []);
  
  return rows.map(r => ({
    id: r.id,
    titleAr: r.title_ar,
    titleEn: r.title_en,
    contentAr: r.content_ar,
    contentEn: r.content_en,
    sectionType: r.section_type,
    orderNum: r.order_num
  }));
}

// Kids Content
export interface KidsContent {
  id: string;
  titleAr: string;
  slug: string;
  type: 'story' | 'prayer' | 'wudu' | 'quiz' | 'game' | 'video';
  ageGroup: '3-5' | '6-8' | '9-12' | '13-15';
  featuredImageUrl?: string;
  contentAr?: string;
  videoUrl?: string;
  quiz_data?: any;
  published: boolean;
  createdAt: string;
}

export async function getKidsContent(ageGroup?: string, type?: string, limit = 50): Promise<KidsContent[]> {
  let query = '/rest/v1/kids_content?select=*&published=eq.true&order=created_at.desc';
  
  if (ageGroup && ageGroup !== 'all') {
    query += `&age_group=eq.${ageGroup}`;
  }
  
  if (type && type !== 'all') {
    query += `&type=eq.${type}`;
  }
  
  query += `&limit=${limit}`;

  const rows = await supabaseServerAdminRequest<any[]>(query).catch(() => []);
  
  return rows.map(r => ({
    id: r.id,
    titleAr: r.title_ar,
    slug: r.slug,
    type: r.type,
    ageGroup: r.age_group,
    featuredImageUrl: r.featured_image_url,
    contentAr: r.content_ar,
    videoUrl: r.video_url,
    quiz_data: r.quiz_data,
    published: r.published,
    createdAt: r.created_at
  }));
}

export async function getKidsContentBySlug(slug: string): Promise<KidsContent | null> {
  const rows = await supabaseServerAdminRequest<any[]>(
    `/rest/v1/kids_content?select=*&slug=eq.${slug}&published=eq.true&limit=1`
  ).catch(() => []);
  
  if (!rows.length) return null;
  const r = rows[0];
  
  return {
    id: r.id,
    titleAr: r.title_ar,
    slug: r.slug,
    type: r.type,
    ageGroup: r.age_group,
    featuredImageUrl: r.featured_image_url,
    contentAr: r.content_ar,
    videoUrl: r.video_url,
    quiz_data: r.quiz_data,
    published: r.published,
    createdAt: r.created_at
  };
}
