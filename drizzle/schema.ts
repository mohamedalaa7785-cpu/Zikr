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

export const roleEnum = pgEnum('role', ['user', 'admin']);
export const favoriteItemTypeEnum = pgEnum('favorite_item_type', ['quran', 'hadith', 'story', 'scholar', 'dua']);
export const progressScopeEnum = pgEnum('progress_scope', ['quran', 'hadith', 'stories']);
export const reminderTypeEnum = pgEnum('reminder_type', ['prayer', 'quran', 'adhkar', 'fasting', 'zakat']);
export const categoryEnum = pgEnum('category', ['dark', 'romantic', 'psychological']);
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'approved', 'rejected']);
export const planEnum = pgEnum('plan', ['free', 'pro', 'premium']);
export const statusEnum = pgEnum('status', ['pending', 'completed', 'failed']);

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
  nameTranslation: text('name_translation'),
  revelationPlace: text('revelation_place'),
  ayahsCount: integer('ayahs_count').notNull(),
  order: integer('order').notNull(),
  slug: text('slug').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const quranAyahs = pgTable('quran_ayahs', {
  id: uuid('id').defaultRandom().primaryKey(),
  surahId: integer('surah_id').notNull().references(() => quranSurahs.id, { onDelete: 'cascade' }),
  ayahNumber: integer('ayah_number').notNull(),
  textAr: text('text_ar').notNull(),
  textEn: text('text_en'),
  audioUrl: text('audio_url'),
  textUthmani: text('text_uthmani'),
  textSimple: text('text_simple'),
  page: integer('page'),
  juz: integer('juz'),
  hizb: integer('hizb'),
  rub: integer('rub'),
  sajda: boolean('sajda').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  surahAyahUnique: unique().on(t.surahId, t.ayahNumber),
}));

export const quranTafsir = pgTable('quran_tafsir', {
  id: uuid('id').defaultRandom().primaryKey(),
  surahId: integer('surah_id').notNull().references(() => quranSurahs.id, { onDelete: 'cascade' }),
  ayahNumber: integer('ayah_number').notNull(),
  tafsirAr: text('tafsir_ar').notNull(),
  tafsirEn: text('tafsir_en'),
  author: text('author'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  uniquePerSurahAyahAuthor: unique().on(t.surahId, t.ayahNumber, t.author),
}));

export const quranReciters = pgTable('quran_reciters', {
  id: uuid('id').defaultRandom().primaryKey(),
  nameAr: text('name_ar').notNull(),
  nameEn: text('name_en').notNull(),
  style: text('style'),
  thumbnailUrl: text('thumbnail_url'),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const hadithBooks = pgTable('hadith_books', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').notNull().unique(),
  nameAr: text('name_ar').notNull(),
  nameEn: text('name_en').notNull(),
  authorAr: text('author_ar'),
  authorEn: text('author_en'),
  hadithCount: integer('hadith_count'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const hadiths = pgTable('hadiths', {
  id: uuid('id').defaultRandom().primaryKey(),
  bookId: uuid('book_id').notNull().references(() => hadithBooks.id, { onDelete: 'cascade' }),
  hadithNumber: text('hadith_number').notNull(),
  textAr: text('text_ar').notNull(),
  textEn: text('text_en'),
  narratorAr: text('narrator_ar'),
  narratorEn: text('narrator_en'),
  gradeAr: text('grade_ar'),
  gradeEn: text('grade_en'),
  published: boolean('published').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  uniqueByBookAndNumber: unique().on(t.bookId, t.hadithNumber),
}));

export const hadithExplanations = pgTable('hadith_explanations', {
  id: uuid('id').defaultRandom().primaryKey(),
  hadithId: uuid('hadith_id').notNull().references(() => hadiths.id, { onDelete: 'cascade' }),
  explanationAr: text('explanation_ar').notNull(),
  explanationEn: text('explanation_en'),
  author: text('author'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
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
  published: boolean('published').notNull().default(true),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const stories = pgTable('stories', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').notNull().unique(),
  userId: uuid('user_id'),
  title: text('title').notNull(),
  content: text('content').notNull(),
  mood: text('mood'),
  category: text('category').notNull(),
  published: boolean('published').default(true),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const userSubscriptions = pgTable('user_subscriptions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => profiles.id),
  plan: planEnum('plan').notNull().default('free'),
  credits: integer('credits').notNull().default(20),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const payments = pgTable('payments', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id'),
  amount: integer('amount').notNull(),
  method: text('method').notNull(),
  referenceNote: text('reference_note').notNull(),
  screenshotUrl: text('screenshot_url'),
  status: paymentStatusEnum('status').notNull().default('pending'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const researchRequests = pgTable('research_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id'),
  title: text('title').notNull(),
  field: text('field').notNull(),
  pages: integer('pages').notNull().default(3),
  type: text('type').notNull(),
  language: text('language').notNull().default('en'),
  status: statusEnum('status').notNull().default('pending'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const generatedResearch = pgTable('generated_research', {
  id: uuid('id').defaultRandom().primaryKey(),
  requestId: uuid('request_id').references(() => researchRequests.id),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
