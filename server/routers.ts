import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import * as db from "./db";
import * as youtube from "./youtube";
import { invokeLLM } from "./_core/llm";

const userIdFromContext = (ctx: any) => {
  const candidate = Number(ctx.user?.id ?? 1);
  return Number.isFinite(candidate) ? candidate : 1;
};

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  episodes: router({
    list: publicProcedure.query(async () => db.getAllEpisodes()),
    bySlug: publicProcedure.input(z.string().min(1)).query(async ({ input }) => db.getEpisodeBySlug(input)),
  }),

  stories: router({
    list: publicProcedure
      .input(z.object({ category: z.enum(["dark", "romantic", "psychological"]).optional() }).optional())
      .query(async ({ input }) => db.listStories(input?.category)),
    bySlug: publicProcedure.input(z.string().min(1)).query(async ({ input }) => db.getStoryBySlug(input)),
    related: publicProcedure
      .input(z.object({ storyId: z.number().int().positive(), category: z.string().min(1) }))
      .query(async ({ input }) => db.getRelatedStories(input.storyId, input.category)),
    save: publicProcedure
      .input(z.object({ storyId: z.number().int().positive() }))
      .mutation(async ({ ctx, input }) => {
        await db.saveStory(userIdFromContext(ctx), input.storyId);
        return { success: true };
      }),
    progress: publicProcedure
      .input(z.object({ storyId: z.number().int().positive(), progress: z.number().int().min(0).max(100) }))
      .mutation(async ({ ctx, input }) => {
        await db.upsertStoryProgress(userIdFromContext(ctx), input.storyId, input.progress);
        return { success: true };
      }),
  }),

  research: router({
    request: publicProcedure
      .input(
        z.object({
          title: z.string().min(5).max(200),
          field: z.string().min(2).max(120),
          pages: z.number().int().min(1).max(25),
          type: z.string().min(2).max(60),
          language: z.string().min(2).max(20),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const userId = userIdFromContext(ctx);
        await db.consumeCredit(userId);

        const requestId = await db.createResearchRequest({ ...input, userId, status: "pending" });

        try {
          const completion = await invokeLLM({
            messages: [
              {
                role: "system",
                content:
                  "You are an academic research assistant. Return structured research with sections: Introduction, Body, Analysis, Conclusion.",
              },
              {
                role: "user",
                content: `Create a ${input.pages}-page ${input.type} research in ${input.language} about ${input.title} in the field of ${input.field}.`,
              },
            ],
          });

          const content = completion.choices?.[0]?.message?.content;
          const normalized = typeof content === "string" ? content : JSON.stringify(content);
          await db.setResearchResult(requestId, normalized, "completed");
          return { requestId, content: normalized };
        } catch (error) {
          await db.setResearchResult(requestId, "Generation failed", "failed");
          throw error;
        }
      }),
    mine: publicProcedure.query(async ({ ctx }) => db.listResearchByUser(userIdFromContext(ctx))),
  }),

  tasks: router({
    generate: publicProcedure
      .input(z.object({ goal: z.string().min(4).max(500) }))
      .mutation(async ({ ctx, input }) => {
        const userId = userIdFromContext(ctx);
        await db.consumeCredit(userId);

        const completion = await invokeLLM({
          messages: [
            {
              role: "system",
              content: "You generate practical daily plans with clear milestones and checkboxes.",
            },
            {
              role: "user",
              content: `Create a day-by-day plan for this goal: ${input.goal}`,
            },
          ],
        });

        const content = completion.choices?.[0]?.message?.content;
        const normalized = typeof content === "string" ? content : JSON.stringify(content);
        await db.createTask(userId, input.goal, normalized);
        return { result: normalized };
      }),
    mine: publicProcedure.query(async ({ ctx }) => db.listTasksByUser(userIdFromContext(ctx))),
  }),

  assistant: router({
    chat: publicProcedure
      .input(
        z.object({
          message: z.string().min(1).max(1000),
          history: z
            .array(
              z.object({
                role: z.enum(["user", "assistant"]),
                content: z.string().min(1).max(1200),
              })
            )
            .max(12)
            .optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await db.consumeCredit(userIdFromContext(ctx));

        const completion = await invokeLLM({
          messages: [
            {
              role: "system",
              content: "You are ZIKR | ذِكرٌ assistant. Explain lessons, answer questions, and help write content concisely.",
            },
            ...(input.history ?? []).map(item => ({ role: item.role, content: item.content })),
            { role: "user", content: input.message },
          ],
        });

        const content = completion.choices?.[0]?.message?.content;
        return { answer: typeof content === "string" ? content : JSON.stringify(content) };
      }),
  }),

  behavior: router({
    track: publicProcedure
      .input(
        z.object({
          page: z.string().min(1).max(255),
          timeSpent: z.number().int().min(0).max(86400),
          interaction: z.string().min(1).max(120),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await db.trackBehavior({
          ...input,
          userId: userIdFromContext(ctx),
        });
        return { success: true };
      }),
  }),

  payments: router({
    submit: publicProcedure
      .input(
        z.object({
          amount: z.number().int().positive(),
          method: z.enum(["Instapay", "Mobile Wallet"]),
          referenceNote: z.string().min(3).max(800),
          screenshotUrl: z.string().url().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await db.createPayment({
          userId: userIdFromContext(ctx),
          amount: input.amount,
          method: input.method,
          referenceNote: input.referenceNote,
          screenshotUrl: input.screenshotUrl,
          status: "pending",
        });
        return { success: true };
      }),
    mine: publicProcedure.query(async ({ ctx }) => db.listPaymentsByUser(userIdFromContext(ctx))),
    adminList: publicProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
      return db.listPayments();
    }),
    adminDecision: publicProcedure
      .input(z.object({ paymentId: z.number().int().positive(), status: z.enum(["approved", "rejected"]) }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        await db.setPaymentStatus(input.paymentId, input.status);
        return { success: true };
      }),
  }),

  dashboard: router({
    mine: publicProcedure.query(async ({ ctx }) => db.getDashboardData(userIdFromContext(ctx))),
  }),

  newsletter: router({
    subscribe: publicProcedure
      .input(z.object({ email: z.string().email(), language: z.string().default("en") }))
      .mutation(async ({ input }) => {
        await db.subscribeEmail(input.email, input.language);
        await sendNewsletterNotification(input.email);
        return { success: true, message: "Subscribed successfully" };
      }),
  }),

  contact: router({
    submit: publicProcedure
      .input(
        z.object({
          name: z.string().min(2),
          email: z.string().email(),
          subject: z.string().min(2),
          message: z.string().min(5),
          language: z.string().default("en"),
        })
      )
      .mutation(async ({ input }) => {
        await db.createContact(input);
        await sendContactNotification(input);
        return { success: true, message: "Message sent successfully" };
      }),
  }),


  analytics: router({
    admin: adminProcedure.query(async () => db.getAnalyticsOverview()),
  }),

  youtube: router({
    getVideos: publicProcedure
      .input(z.object({ maxResults: z.number().int().min(1).max(20).default(12) }).optional())
      .query(async ({ input }) => youtube.getChannelVideos(input?.maxResults ?? 12)),
  }),
});

export type AppRouter = typeof appRouter;

async function sendContactNotification(data: any) {
  try {
    const { notifyOwner } = await import("./_core/notification");
    await notifyOwner({
      title: `New Contact Form Submission from ${data.name}`,
      content: `Email: ${data.email}\nSubject: ${data.subject}\n\nMessage:\n${data.message}`,
    });
  } catch (error) {
    console.error("Failed to send contact notification:", error);
  }
}

async function sendNewsletterNotification(email: string) {
  try {
    const { notifyOwner } = await import("./_core/notification");
    await notifyOwner({
      title: "New Newsletter Subscription",
      content: `Email: ${email}`,
    });
  } catch (error) {
    console.error("Failed to send newsletter notification:", error);
  }
}
