import { and, desc, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import {
  contacts,
  episodes,
  generatedResearch,
  payments,
  researchRequests,
  savedStories,
  stories,
  storyProgress,
  subscriptions,
  tasks,
  userBehavior,
  userSubscriptions,
  users,
} from "../drizzle/schema";

/**
 * ZIKR | ذِكرٌ - Database Connection (Supabase / Postgres)
 */

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const client = postgres(process.env.DATABASE_URL);
      _db = drizzle(client);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ... existing helper functions updated for Postgres syntax if needed ...
// Note: Postgres uses standard SQL, but we need to ensure mysql-specific functions like onDuplicateKeyUpdate are replaced with onConflictDoUpdate

export async function upsertUser(user: any): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.insert(users).values({
    openId: user.openId,
    name: user.name,
    email: user.email,
    loginMethod: user.loginMethod,
    role: user.role || "user",
  }).onConflictDoUpdate({
    target: users.openId,
    set: {
      name: user.name,
      email: user.email,
      lastSignedIn: new Date(),
    }
  });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function getAllEpisodes() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(episodes).orderBy(desc(episodes.publishedAt));
}

export async function getEpisodeBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(episodes).where(eq(episodes.slug, slug)).limit(1);
  return result[0];
}

export async function subscribeEmail(email: string, language = "en") {
  const db = await getDb();
  if (!db) return;
  await db.insert(subscriptions).values({ email, language }).onConflictDoUpdate({
    target: subscriptions.email,
    set: { language, updatedAt: new Date() }
  });
}

export async function listStories(category?: "dark" | "romantic" | "psychological") {
  const db = await getDb();
  if (!db) return [];
  if (!category) return db.select().from(stories).orderBy(desc(stories.createdAt));
  return db.select().from(stories).where(eq(stories.category, category)).orderBy(desc(stories.createdAt));
}

export async function getStoryBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(stories).where(eq(stories.slug, slug)).limit(1);
  return result[0];
}

export async function getRelatedStories(storyId: string, category: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(stories).where(and(eq(stories.category, category as any), sql`${stories.id} != ${storyId}`)).orderBy(desc(stories.createdAt)).limit(3);
}

export async function saveStory(userId: string, storyId: string) {
  const db = await getDb();
  if (!db) return;
  const existing = await db.select().from(savedStories).where(and(eq(savedStories.userId, userId as any), eq(savedStories.storyId, storyId as any))).limit(1);
  if (!existing[0]) {
    await db.insert(savedStories).values({ userId: userId as any, storyId: storyId as any });
  }
}

export async function upsertStoryProgress(userId: string, storyId: string, progress: number) {
  const db = await getDb();
  if (!db) return;
  const existing = await db.select().from(storyProgress).where(and(eq(storyProgress.userId, userId as any), eq(storyProgress.storyId, storyId as any))).limit(1);
  if (existing[0]) {
    await db.update(storyProgress).set({ progress, completed: progress >= 100, updatedAt: new Date() }).where(eq(storyProgress.id, existing[0].id));
  } else {
    await db.insert(storyProgress).values({ userId: userId as any, storyId: storyId as any, progress, completed: progress >= 100 });
  }
}

export async function createResearchRequest(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(researchRequests).values(data).returning({ id: researchRequests.id });
  return result[0]?.id;
}

export async function setResearchResult(requestId: string, content: string, status: "completed" | "failed") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(researchRequests).set({ status }).where(eq(researchRequests.id, requestId as any));
  if (status === "completed") {
    await db.insert(generatedResearch).values({ requestId: requestId as any, content });
  }
}

export async function listResearchByUser(userId: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select({ request: researchRequests, generated: generatedResearch }).from(researchRequests).leftJoin(generatedResearch, eq(generatedResearch.requestId, researchRequests.id)).where(eq(researchRequests.userId, userId as any)).orderBy(desc(researchRequests.createdAt));
}

export async function createTask(userId: string, input: string, result: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(tasks).values({ userId: userId as any, input, result });
}

export async function listTasksByUser(userId: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(tasks).where(eq(tasks.userId, userId as any)).orderBy(desc(tasks.createdAt));
}

export async function trackBehavior(payload: any) {
  const db = await getDb();
  if (!db) return;
  await db.insert(userBehavior).values(payload);
}

export async function getOrCreateUserSubscription(userId: string) {
  const db = await getDb();
  if (!db) return null;
  const existing = await db.select().from(userSubscriptions).where(eq(userSubscriptions.userId, userId as any)).limit(1);
  if (existing[0]) return existing[0];
  await db.insert(userSubscriptions).values({ userId: userId as any, plan: "free", credits: 20 });
  const created = await db.select().from(userSubscriptions).where(eq(userSubscriptions.userId, userId as any)).limit(1);
  return created[0] ?? null;
}

export async function consumeCredit(userId: string) {
  const db = await getDb();
  if (!db) return;
  const subscription = await getOrCreateUserSubscription(userId);
  if (!subscription) return;
  if (subscription.credits <= 0) throw new Error("No credits left. Upgrade your plan.");
  await db.update(userSubscriptions).set({ credits: subscription.credits - 1, updatedAt: new Date() }).where(eq(userSubscriptions.id, subscription.id));
}

export async function createPayment(payload: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(payments).values(payload);
}

export async function listPaymentsByUser(userId: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(payments).where(eq(payments.userId, userId as any)).orderBy(desc(payments.createdAt));
}

export async function createContact(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(contacts).values(data);
}

export async function listPayments() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(payments).orderBy(desc(payments.createdAt));
}

export async function setPaymentStatus(paymentId: string, status: "approved" | "rejected") {
  const db = await getDb();
  if (!db) return;
  await db.update(payments).set({ status: status as any }).where(eq(payments.id, paymentId as any));
}

export async function getDashboardData(userId: string) {
  const db = await getDb();
  if (!db) return null;
  const subscription = await getOrCreateUserSubscription(userId);
  const tasks = await listTasksByUser(userId);
  const research = await listResearchByUser(userId);
  const stories = await db.select().from(savedStories).where(eq(savedStories.userId, userId as any));
  return {
    subscription,
    tasksCount: tasks.length,
    researchCount: research.length,
    savedStoriesCount: stories.length,
  };
}

export async function getAnalyticsOverview() {
  const db = await getDb();
  if (!db) return null;
  const usersCount = await db.select({ count: sql`count(*)` }).from(users);
  const storiesCount = await db.select({ count: sql`count(*)` }).from(stories);
  const tasksCount = await db.select({ count: sql`count(*)` }).from(tasks);
  const paymentsCount = await db.select({ count: sql`count(*)` }).from(payments);
  return {
    users: usersCount[0]?.count || 0,
    stories: storiesCount[0]?.count || 0,
    tasks: tasksCount[0]?.count || 0,
    payments: paymentsCount[0]?.count || 0,
  };
}
