import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  numeric,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";

/**
 * ZIKR | ذِكرٌ - Database Schema (Postgres / Supabase)
 */

// Enums
export const roleEnum = pgEnum("role", ["user", "admin"]);
export const categoryEnum = pgEnum("category", ["dark", "romantic", "psychological"]);
export const statusEnum = pgEnum("status", ["pending", "completed", "failed"]);
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "approved", "rejected"]);
export const planEnum = pgEnum("plan", ["free", "pro", "premium"]);

/**
 * Core user table backing auth flow.
 */
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  openId: text("openId").unique(),
  name: text("name"),
  email: text("email").unique(),
  loginMethod: text("loginMethod"),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastSignedIn: timestamp("last_signed_in").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Quran System
 */
export const quranSurahs = pgTable("quran_surahs", {
  id: integer("id").primaryKey(),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull(),
  nameTranslation: text("name_translation"),
  revelationPlace: text("revelation_place"),
  ayahsCount: integer("ayahs_count").notNull(),
});

export const quranAyahs = pgTable("quran_ayahs", {
  id: uuid("id").primaryKey().defaultRandom(),
  surahId: integer("surah_id").notNull().references(() => quranSurahs.id),
  ayahNumber: integer("ayah_number").notNull(),
  textAr: text("text_ar").notNull(),
  textEn: text("text_en"),
  audioUrl: text("audio_url"),
});

export const quranReciters = pgTable("quran_reciters", {
  id: uuid("id").primaryKey().defaultRandom(),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull(),
  style: text("style"), // e.g., Murattal, Mujawwad
  thumbnailUrl: text("thumbnail_url"),
});

export const quranAudio = pgTable("quran_audio", {
  id: uuid("id").primaryKey().defaultRandom(),
  surahId: integer("surah_id").notNull().references(() => quranSurahs.id),
  reciterId: uuid("reciter_id").notNull().references(() => quranReciters.id),
  audioUrl: text("audio_url").notNull(),
  duration: integer("duration"),
});

export const quranTafsir = pgTable("quran_tafsir", {
  id: uuid("id").primaryKey().defaultRandom(),
  surahId: integer("surah_id").notNull().references(() => quranSurahs.id),
  ayahNumber: integer("ayah_number").notNull(),
  tafsirAr: text("tafsir_ar").notNull(),
  tafsirEn: text("tafsir_en"),
  author: text("author"), // e.g., Ibn Kathir, Al-Jalalayn
});

/**
 * Hadith System
 */
export const hadithBooks = pgTable("hadith_books", {
  id: uuid("id").primaryKey().defaultRandom(),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull(),
  slug: text("slug").notNull().unique(),
  authorAr: text("author_ar"),
  authorEn: text("author_en"),
  hadithCount: integer("hadith_count"),
});

export const hadiths = pgTable("hadiths", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookId: uuid("book_id").notNull().references(() => hadithBooks.id),
  hadithNumber: text("hadith_number").notNull(),
  textAr: text("text_ar").notNull(),
  textEn: text("text_en"),
  narratorAr: text("narrator_ar"),
  narratorEn: text("narrator_en"),
  gradeAr: text("grade_ar"),
  gradeEn: text("grade_en"),
});

export const hadithExplanations = pgTable("hadith_explanations", {
  id: uuid("id").primaryKey().defaultRandom(),
  hadithId: uuid("hadith_id").notNull().references(() => hadiths.id),
  explanationAr: text("explanation_ar").notNull(),
  explanationEn: text("explanation_en"),
  author: text("author"),
});

/**
 * Scholars System
 */
export const scholars = pgTable("scholars", {
  id: uuid("id").primaryKey().defaultRandom(),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull(),
  slug: text("slug").notNull().unique(),
  bioAr: text("bio_ar"),
  bioEn: text("bio_en"),
  thumbnailUrl: text("thumbnail_url"),
  websiteUrl: text("website_url"),
  youtubeUrl: text("youtube_url"),
});

/**
 * Stories / narrative engine
 */
export const stories = pgTable("stories", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  userId: uuid("user_id").references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  mood: text("mood"),
  category: categoryEnum("category").default("psychological").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const storyProgress = pgTable("story_progress", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  storyId: uuid("story_id").notNull().references(() => stories.id),
  progress: integer("progress").default(0).notNull(),
  completed: boolean("completed").default(false).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const savedStories = pgTable("saved_stories", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  storyId: uuid("story_id").notNull().references(() => stories.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Story = typeof stories.$inferSelect;
export type InsertStory = typeof stories.$inferInsert;

/**
 * Research generation workflows
 */
export const researchRequests = pgTable("research_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  field: text("field").notNull(),
  pages: integer("pages").default(3).notNull(),
  type: text("type").notNull(),
  language: text("language").default("en").notNull(),
  status: statusEnum("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const generatedResearch = pgTable("generated_research", {
  id: uuid("id").primaryKey().defaultRandom(),
  requestId: uuid("request_id").notNull().references(() => researchRequests.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  input: text("input").notNull(),
  result: text("result").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userBehavior = pgTable("user_behavior", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  page: text("page").notNull(),
  timeSpent: integer("time_spent").default(0).notNull(),
  interaction: text("interaction").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  amount: numeric("amount").notNull(),
  method: text("method").notNull(),
  referenceNote: text("reference_note").notNull(),
  screenshotUrl: text("screenshot_url"),
  status: paymentStatusEnum("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userSubscriptions = pgTable("user_subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  plan: planEnum("plan").default("free").notNull(),
  credits: integer("credits").default(20).notNull(),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Legacy content table retained for compatibility
 */
export const episodes = pgTable("episodes", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  titleEn: text("titleEn").notNull(),
  titleAr: text("titleAr").notNull(),
  descriptionEn: text("descriptionEn").notNull(),
  descriptionAr: text("descriptionAr").notNull(),
  contentEn: text("contentEn").notNull(),
  contentAr: text("contentAr").notNull(),
  keywordsEn: text("keywordsEn"),
  keywordsAr: text("keywordsAr"),
  category: text("category"),
  thumbnailUrl: text("thumbnailUrl"),
  youtubeVideoId: text("youtubeVideoId"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Episode = typeof episodes.$inferSelect;
export type InsertEpisode = typeof episodes.$inferInsert;

/**
 * Newsletter subscriptions table
 */
export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  language: text("language").default("en").notNull(),
  verified: boolean("verified").default(false).notNull(),
  verificationToken: text("verificationToken"),
  subscribedAt: timestamp("subscribed_at").defaultNow().notNull(),
  unsubscribedAt: timestamp("unsubscribed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

/**
 * Contact form submissions table
 */
export const contacts = pgTable("contacts", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  language: text("language").default("en").notNull(),
  read: boolean("read").default(false).notNull(),
  notificationSent: boolean("notificationSent").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = typeof contacts.$inferInsert;
