import { z } from "zod";
import { inngest } from "@/inngest/client";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import prisma from "@/lib/db";
import { TRPCError } from "@trpc/server";
import { consumeCredits } from "@/lib/usage";

// TODO: Move createTitleFromPrompt to a utility file AND IMPROVE it
function createTitleFromPrompt(prompt: string): string {
  const words = prompt.trim().split(/\s+/);
  const titleWords = words.slice(0, 5);
  const title = titleWords.join(" ");
  return title.length > 50 ? title.substring(0, 50) + "..." : title;
}

export const projectsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        prompt: z
          .string()
          .min(1, { message: "Prompt is required" })
          .max(1000, { message: "Prompt must be at most 1000 characters" }),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const project = await prisma.project.create({
        data: {
          name: createTitleFromPrompt(input.prompt),
          userId: ctx.auth.userId,
          messages: {
            create: {
              content: input.prompt,
              role: "USER",
              type: "RESULT",
            },
          },
        },
      });

      await inngest.send({
        name: "code-agent/run",
        data: { prompt: input.prompt, projectId: project.id },
      });

      try {
        await consumeCredits(ctx.auth.userId);
      } catch (error) {
        if (error instanceof Error) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "" + error.message || "Something went wrong",
          });
        } else {
          throw new TRPCError({
            code: "PAYMENT_REQUIRED",
            message: "Not enough credits to perform this action.",
          });
        }
      }

      return project;
    }),

  getMany: protectedProcedure.query(async ({ ctx }) => {
    const project = await prisma.project.findMany({
      where: { userId: ctx.auth.userId },
      orderBy: { updatedAt: "desc" },
    });
    return project;
  }),

  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, { message: "Project ID is required" }),
      }),
    )
    .query(async ({ input, ctx }) => {
      const project = await prisma.project.findUnique({
        where: { id: input.id, userId: ctx.auth.userId },
      });

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Project with ID ${input.id} not found`,
        });
      }

      return project;
    }),
});
