import {
  boolean,
  integer,
  jsonb,
  smallint,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const roleEnum = pgEnum("role", ["user", "admin"]);
export const favoriteItemTypeEnum = pgEnum("favorite_item_type", [
  "quran",
  "hadith",
  "story",
  "scholar",
  "dua",
]);
export const progressScopeEnum = pgEnum("progress_scope", [
  "quran",
  "hadith",
  "stories",
]);
export const reminderTypeEnum = pgEnum("reminder_type", [
  "prayer",
  "quran",
  "adhkar",
  "fasting",
  "zakat",
]);
export const categoryEnum = pgEnum("category", [
  "dark",
  "romantic",
  "psychological",
]);
export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "approved",
  "rejected",
]);
export const planEnum = pgEnum("plan", ["free", "pro", "premium"]);
export const statusEnum = pgEnum("status", ["pending", "completed", "failed"]);

// User-owned tables
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  displayName: text("display_name"),
  avatarUrl: text("avatar_url"),
  locale: text("locale").notNull().default("ar"),
  role: roleEnum("role").notNull().default("user"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const favorites = pgTable(
  "favorites",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    itemType: favoriteItemTypeEnum("item_type").notNull(),
    itemRef: text("item_ref").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  t => ({
    uniq: uniqueIndex("favorites_user_item_unique").on(
      t.userId,
      t.itemType,
      t.itemRef
    ),
  })
);

export const readingProgress = pgTable(
  "reading_progress",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    scope: progressScopeEnum("scope").notNull(),
    ref: text("ref").notNull(),
    progressJson: jsonb("progress_json").notNull().default({}),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  t => ({
    uniq: uniqueIndex("reading_progress_user_scope_ref_unique").on(
      t.userId,
      t.scope,
      t.ref
    ),
  })
);

export const reminders = pgTable("reminders", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  type: reminderTypeEnum("type").notNull(),
  scheduleJson: jsonb("schedule_json").notNull().default({}),
  enabled: boolean("enabled").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// Server action support tables (user-owned Supabase tables)
export const quranFavorites = pgTable(
  "quran_favorites",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull(),
    surahId: integer("surah_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  t => ({ uniq: unique().on(t.userId, t.surahId) })
);

export const bookmarks = pgTable("bookmarks", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  itemType: text("item_type").notNull(),
  itemRef: text("item_ref").notNull(),
  label: text("label"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const searchHistory = pgTable("search_history", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  query: text("query").notNull(),
  searchedAt: timestamp("searched_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const quranReads = pgTable("quran_reads", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  surahId: integer("surah_id").notNull(),
  ayahNumber: integer("ayah_number").notNull(),
  readAt: timestamp("read_at", { withTimezone: true }).defaultNow().notNull(),
});

export const storyReads = pgTable(
  "story_reads",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull(),
    storyId: uuid("story_id")
      .notNull()
      .references(() => stories.id, { onDelete: "cascade" }),
    readAt: timestamp("read_at", { withTimezone: true }).defaultNow().notNull(),
  },
  t => ({ uniq: unique().on(t.userId, t.storyId) })
);

export const storyRatings = pgTable(
  "story_ratings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull(),
    storyId: uuid("story_id")
      .notNull()
      .references(() => stories.id, { onDelete: "cascade" }),
    rating: smallint("rating").notNull(),
    comment: text("comment"),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  t => ({ uniq: unique().on(t.userId, t.storyId) })
);

export const storyFavorites = pgTable(
  "story_favorites",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull(),
    storyId: uuid("story_id")
      .notNull()
      .references(() => stories.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  t => ({ uniq: unique().on(t.userId, t.storyId) })
);

export const socialShares = pgTable("social_shares", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  contentType: text("content_type").notNull(),
  contentId: text("content_id").notNull(),
  platform: text("platform"),
  sharedAt: timestamp("shared_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const prophetNotes = pgTable(
  "prophet_notes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull(),
    prophetId: text("prophet_id").notNull(),
    note: text("note").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  t => ({ uniq: unique().on(t.userId, t.prophetId) })
);

export const notificationSettings = pgTable(
  "notification_settings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull(),
    emailNotifications: boolean("emailNotifications").notNull().default(true),
    pushNotifications: boolean("pushNotifications").notNull().default(true),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  t => ({ uniq: unique().on(t.userId) })
);

export const adhkarCompletions = pgTable("adhkar_completions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  adhkarId: text("adhkar_id").notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const adhkarStreaks = pgTable(
  "adhkar_streaks",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull(),
    streak: integer("streak").notNull().default(0),
    lastCompletedAt: timestamp("last_completed_at", { withTimezone: true }),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  t => ({ uniq: unique().on(t.userId) })
);

export const appSettings = pgTable(
  "app_settings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull(),
    theme: text("theme").notNull().default("system"),
    fontSize: text("fontSize").notNull().default("medium"),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  t => ({ uniq: unique().on(t.userId) })
);

export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  title: text("title").notNull(),
  body: text("body"),
  type: text("type"),
  read: boolean("read").notNull().default(false),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// Quran content (public read, admin write)
export const quranSurahs = pgTable("quran_surahs", {
  id: integer("id").primaryKey(),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull(),
  nameTranslation: text("name_translation"),
  revelationPlace: text("revelation_place"),
  ayahsCount: integer("ayahs_count").notNull(),
  order: integer("order").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const quranAyahs = pgTable(
  "quran_ayahs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    surahId: integer("surah_id")
      .notNull()
      .references(() => quranSurahs.id, { onDelete: "cascade" }),
    ayahNumber: integer("ayah_number").notNull(),
    textAr: text("text_ar").notNull(),
    textEn: text("text_en"),
    audioUrl: text("audio_url"),
    textUthmani: text("text_uthmani"),
    textSimple: text("text_simple"),
    page: integer("page"),
    juz: integer("juz"),
    hizb: integer("hizb"),
    rub: integer("rub"),
    sajda: boolean("sajda").default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  t => ({
    surahAyahUnique: unique().on(t.surahId, t.ayahNumber),
  })
);

export const quranTafsir = pgTable(
  "quran_tafsir",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    surahId: integer("surah_id")
      .notNull()
      .references(() => quranSurahs.id, { onDelete: "cascade" }),
    ayahNumber: integer("ayah_number").notNull(),
    tafsirAr: text("tafsir_ar").notNull(),
    tafsirEn: text("tafsir_en"),
    author: text("author"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  t => ({
    uniquePerSurahAyahAuthor: unique().on(t.surahId, t.ayahNumber, t.author),
  })
);

export const quranReciters = pgTable("quran_reciters", {
  id: uuid("id").defaultRandom().primaryKey(),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull(),
  code: text("code").notNull().unique(),
  style: text("style"),
  baseUrlTemplate: text("base_url_template").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// Hadith content (public read, admin write)
export const hadithBooks = pgTable("hadith_books", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull(),
  source: text("source").notNull(),
  authorAr: text("author_ar"),
  authorEn: text("author_en"),
  hadithCount: integer("hadith_count"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const hadiths = pgTable(
  "hadiths",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    bookId: uuid("book_id")
      .notNull()
      .references(() => hadithBooks.id, { onDelete: "cascade" }),
    hadithNumber: text("hadith_number").notNull(),
    textAr: text("text_ar").notNull(),
    textEn: text("text_en"),
    narratorAr: text("narrator_ar"),
    narratorEn: text("narrator_en"),
    gradeAr: text("grade_ar"),
    gradeEn: text("grade_en"),
    chapter: text("chapter"),
    ref: text("ref"),
    published: boolean("published").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  t => ({
    uniqueByBookAndNumber: unique().on(t.bookId, t.hadithNumber),
  })
);

export const hadithExplanations = pgTable("hadith_explanations", {
  id: uuid("id").defaultRandom().primaryKey(),
  hadithId: uuid("hadith_id")
    .notNull()
    .references(() => hadiths.id, { onDelete: "cascade" }),
  explanationAr: text("explanation_ar").notNull(),
  explanationEn: text("explanation_en"),
  author: text("author"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// Scholars & Stories (public read, admin write)
export const scholars = pgTable("scholars", {
  id: uuid("id").defaultRandom().primaryKey(),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull(),
  slug: text("slug").notNull().unique(),
  bioAr: text("bio_ar"),
  bioEn: text("bio_en"),
  thumbnailUrl: text("thumbnail_url"),
  websiteUrl: text("website_url"),
  youtubeUrl: text("youtube_url"),
  published: boolean("published").notNull().default(true),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const stories = pgTable("stories", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  userId: uuid("user_id"),
  title: text("title").notNull(),
  summary: text("summary"),
  content: text("content").notNull(),
  mood: text("mood"),
  category: text("category").notNull(),
  published: boolean("published").default(true),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Subscription & Payments (user-owned)
export const userSubscriptions = pgTable("user_subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => profiles.id),
  plan: planEnum("plan").notNull().default("free"),
  credits: integer("credits").notNull().default(20),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id"),
  amount: integer("amount").notNull(),
  method: text("method").notNull(),
  referenceNote: text("reference_note").notNull(),
  screenshotUrl: text("screenshot_url"),
  status: paymentStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Research (user-owned)
export const researchRequests = pgTable("research_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id"),
  title: text("title").notNull(),
  field: text("field").notNull(),
  pages: integer("pages").notNull().default(3),
  type: text("type").notNull(),
  language: text("language").notNull().default("en"),
  status: statusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const generatedResearch = pgTable("generated_research", {
  id: uuid("id").defaultRandom().primaryKey(),
  requestId: uuid("request_id").references(() => researchRequests.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Site admin (admin-only write)
export const siteSettings = pgTable("site_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: text("key").notNull().unique(),
  value: jsonb("value").notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const competitions = pgTable("competitions", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  prize: text("prize"),
  startsAt: timestamp("starts_at", { withTimezone: true }),
  endsAt: timestamp("ends_at", { withTimezone: true }),
  published: boolean("published").notNull().default(false),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const pinnedMessages = pgTable("pinned_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  title: text("title"),
  body: text("body"),
  type: text("type"),
  isActive: boolean("is_active").notNull().default(true),
  startAt: timestamp("start_at", { withTimezone: true }),
  endAt: timestamp("end_at", { withTimezone: true }),
  priority: integer("priority").notNull().default(0),
});

export const memorizationPlans = pgTable("memorization_plans", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  cadence: text("cadence").notNull().default("daily"),
  targetRef: text("target_ref"),
  prompt: text("prompt"),
  tajweedFocus: text("tajweed_focus"),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// Prophets (public read, admin write)
export const prophets = pgTable("prophets", {
  id: uuid("id").primaryKey(),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull(),
  slug: text("slug").notNull().unique(),
  bioAr: text("bio_ar"),
  bioEn: text("bio_en"),
  birthPlaceAr: text("birth_place_ar"),
  deathPlaceAr: text("death_place_ar"),
  featuredImageUrl: text("featured_image_url"),
  thumbnailUrl: text("thumbnail_url"),
  orderNum: integer("order_num").notNull().default(0),
  published: boolean("published").notNull().default(true),
  metadata: jsonb("metadata").notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const prophetSections = pgTable("prophet_sections", {
  id: uuid("id").primaryKey(),
  prophetId: uuid("prophet_id")
    .notNull()
    .references(() => prophets.id, { onDelete: "cascade" }),
  titleAr: text("title_ar").notNull(),
  titleEn: text("title_en"),
  contentAr: text("content_ar").notNull(),
  contentEn: text("content_en"),
  sectionType: text("section_type"),
  orderNum: integer("order_num").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// Duas (public read, admin write)
export const duaCategories = pgTable("dua_categories", {
  id: uuid("id").primaryKey(),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull(),
  slug: text("slug").notNull().unique(),
  icon: text("icon"),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const duas = pgTable("duas", {
  id: uuid("id").primaryKey(),
  titleAr: text("title_ar").notNull(),
  titleEn: text("title_en").notNull(),
  slug: text("slug").notNull().unique(),
  textAr: text("text_ar").notNull(),
  textEn: text("text_en"),
  occasionAr: text("occasion_ar"),
  occasionEn: text("occasion_en"),
  sourceAr: text("source_ar"),
  sourceEn: text("source_en"),
  benefitsAr: text("benefits_ar"),
  benefitsEn: text("benefits_en"),
  categoryId: uuid("category_id").references(() => duaCategories.id, {
    onDelete: "set null",
  }),
  published: boolean("published").notNull().default(true),
  metadata: jsonb("metadata").notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// Additional public content modules synchronized from Supabase migrations
export const articleCategories = pgTable("article_categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull(),
  slug: text("slug").notNull().unique(),
  descriptionAr: text("description_ar"),
  descriptionEn: text("description_en"),
  icon: text("icon"),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const articles = pgTable("articles", {
  id: uuid("id").defaultRandom().primaryKey(),
  categoryId: uuid("category_id").references(() => articleCategories.id, {
    onDelete: "cascade",
  }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  summary: text("summary"),
  author: text("author"),
  featuredImageUrl: text("featured_image_url"),
  published: boolean("published").notNull().default(true),
  views: integer("views").notNull().default(0),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const companions = pgTable("companions", {
  id: uuid("id").defaultRandom().primaryKey(),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull(),
  slug: text("slug").notNull().unique(),
  bioAr: text("bio_ar"),
  bioEn: text("bio_en"),
  category: text("category"),
  thumbnailUrl: text("thumbnail_url"),
  featuredImageUrl: text("featured_image_url"),
  orderNum: integer("order_num"),
  published: boolean("published").notNull().default(true),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const companionStories = pgTable("companion_stories", {
  id: uuid("id").defaultRandom().primaryKey(),
  companionId: uuid("companion_id")
    .notNull()
    .references(() => companions.id, { onDelete: "cascade" }),
  titleAr: text("title_ar").notNull(),
  titleEn: text("title_en").notNull(),
  contentAr: text("content_ar").notNull(),
  contentEn: text("content_en"),
  storyType: text("story_type"),
  orderNum: integer("order_num"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
