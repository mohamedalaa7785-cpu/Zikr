 codex/perform-complete-schema-synchronization-audit
import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { boolean, integer, jsonb, pgEnum, pgTable, text, timestamp, unique, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
 main

export const roleEnum = pgEnum('role', ['user', 'admin']);
export const favoriteItemTypeEnum = pgEnum('favorite_item_type', ['quran', 'hadith', 'story', 'scholar', 'dua']);
export const progressScopeEnum = pgEnum('progress_scope', ['quran', 'hadith', 'stories']);
export const reminderTypeEnum = pgEnum('reminder_type', ['prayer', 'quran', 'adhkar', 'fasting', 'zakat']);

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(),
  displayName: text('display_name'),
  avatarUrl: text('avatar_url'),
  locale: text('locale').notNull().default('ar'),
  role: roleEnum('role').notNull().default('user'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const favorites = pgTable('favorites', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  itemType: favoriteItemTypeEnum('item_type').notNull(),
  itemRef: text('item_ref').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({ uniq: uniqueIndex('favorites_user_item_unique').on(t.userId, t.itemType, t.itemRef) }));

export const readingProgress = pgTable('reading_progress', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  scope: progressScopeEnum('scope').notNull(),
  ref: text('ref').notNull(),
  progressJson: jsonb('progress_json').notNull().default({}),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({ uniq: uniqueIndex('reading_progress_user_scope_ref_unique').on(t.userId, t.scope, t.ref) }));

export const reminders = pgTable('reminders', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  type: reminderTypeEnum('type').notNull(),
  scheduleJson: jsonb('schedule_json').notNull().default({}),
  enabled: boolean('enabled').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const quranSurahs = pgTable('quran_surahs', {
  id: integer('id').primaryKey(),
  nameAr: text('name_ar').notNull(),
  nameEn: text('name_en').notNull(),
  ayahCount: integer('ayah_count').notNull(),
  revelationPlace: text('revelation_place').notNull(),
  order: integer('order').notNull(),
  slug: text('slug').notNull().unique(),
 codex/perform-complete-schema-synchronization-audit
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
 main
});

export const quranAyahs = pgTable('quran_ayahs', {
  id: uuid('id').defaultRandom().primaryKey(),
  surahId: integer('surah_id').notNull().references(() => quranSurahs.id, { onDelete: 'cascade' }),
  ayahNumber: integer('ayah_number').notNull(),
  textUthmani: text('text_uthmani').notNull(),
  textSimple: text('text_simple').notNull(),
  page: integer('page'),
  juz: integer('juz'),
  hizb: integer('hizb'),
  rub: integer('rub'),
  sajda: boolean('sajda').default(false),
 codex/perform-complete-schema-synchronization-audit
}, (t) => ({
  surahAyahUnique: unique().on(t.surahId, t.ayahNumber),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  surahAyahUnique: unique().on(t.surahId, t.ayahNumber),
  surahIdIdx: unique().on(t.surahId),
 main
}));

export const quranTafsir = pgTable('quran_tafsir', {
  id: uuid('id').defaultRandom().primaryKey(),
  surahId: integer('surah_id').notNull().references(() => quranSurahs.id, { onDelete: 'cascade' }),
  ayahNumber: integer('ayah_number').notNull(),
  source: text('source').notNull(),
  text: text('text').notNull(),
 codex/perform-complete-schema-synchronization-audit
}, (t) => ({
  uniquePerSource: unique().on(t.surahId, t.ayahNumber, t.source),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  uniquePerSource: unique().on(t.surahId, t.ayahNumber, t.source),
  surahIdIdx: unique().on(t.surahId),
 main
}));

export const quranReciters = pgTable('quran_reciters', {
  id: uuid('id').defaultRandom().primaryKey(),
  nameAr: text('name_ar').notNull(),
  nameEn: text('name_en'),
  code: text('code').notNull().unique(),
  style: text('style'),
  baseUrlTemplate: text('base_url_template').notNull(),
 codex/perform-complete-schema-synchronization-audit
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
 main
});

export const hadithBooks = pgTable('hadith_books', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').notNull().unique(),
  nameAr: text('name_ar').notNull(),
  nameEn: text('name_en'),
  source: text('source').notNull(),
 codex/perform-complete-schema-synchronization-audit
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
 main
});

export const hadiths = pgTable('hadiths', {
  id: uuid('id').defaultRandom().primaryKey(),
  bookId: uuid('book_id').notNull().references(() => hadithBooks.id, { onDelete: 'cascade' }),
  hadithNumber: text('hadith_number').notNull(),
  textAr: text('text_ar').notNull(),
  narrator: text('narrator'),
  grade: text('grade'),
  chapter: text('chapter'),
  ref: text('ref'),
 codex/perform-complete-schema-synchronization-audit
}, (t) => ({
  uniqueByBookAndNumber: unique().on(t.bookId, t.hadithNumber),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  uniqueByBookAndNumber: unique().on(t.bookId, t.hadithNumber),
  bookIdIdx: unique().on(t.bookId),
 main
}));

export const hadithExplanations = pgTable('hadith_explanations', {
  id: uuid('id').defaultRandom().primaryKey(),
  hadithId: uuid('hadith_id').notNull().references(() => hadiths.id, { onDelete: 'cascade' }),
  source: text('source').notNull(),
  text: text('text').notNull(),
 codex/perform-complete-schema-synchronization-audit
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
 main
});

export const scholars = pgTable('scholars', {
  id: uuid('id').defaultRandom().primaryKey(),
  nameAr: text('name_ar').notNull(),
  nameEn: text('name_en').notNull(),
  slug: text('slug').notNull().unique(),
  bioAr: text('bio_ar'),
  bioEn: text('bio_en'),
  thumbnailUrl: text('thumbnail_url'),
  websiteUrl: text('website_url'),
  youtubeUrl: text('youtube_url'),
 codex/perform-complete-schema-synchronization-audit
});
  published: boolean('published').notNull().default(true),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

 main
export const stories = pgTable('stories', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  summary: text('summary').notNull(),
  category: text('category').notNull(),
  published: boolean('published').notNull().default(true),
 codex/perform-complete-schema-synchronization-audit
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

  thumbnailUrl: text('thumbnail_url'),
  videoUrl: text('video_url'),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
 main
