import { z } from "zod";
import { inngest } from "@/inngest/client";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import prisma from "@/lib/db";
import { TRPCError } from "@trpc/server";
import { consumeCredits } from "@/lib/usage";

export const messagesRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        prompt: z
          .string()
          .min(1, { message: "Prompt is required" })
          .max(1000, { message: "Prompt must be at most 1000 characters" }),
        projectId: z.string().min(1, { message: "Project ID is required" }),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const existingProject = await prisma.project.findUnique({
        where: { id: input.projectId, userId: ctx.auth.userId },
      });

      if (!existingProject) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Project not found`,
        });
      }
      try {
        await consumeCredits(ctx.auth.userId);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error consuming credits:", error);
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "" + error.message || "Something went wrong",
          });
        } else {
          console.error("Insufficient credits", error);
          throw new TRPCError({
            code: "PAYMENT_REQUIRED",
            message: "Not enough credits to perform this action.",
          });
        }
      }

      const newMessage = await prisma.message.create({
        data: {
          projectId: existingProject.id,
          content: input.prompt,
          role: "USER",
          type: "RESULT",
        },
      });

      await inngest.send({
        name: "code-agent/run",
        data: { prompt: input.prompt, projectId: existingProject.id },
      });

      return newMessage;
    }),

  getMany: protectedProcedure
    .input(
      z.object({
        projectId: z.string().min(1, { message: "Project ID is required" }),
      }),
    )
    .query(async ({ input, ctx }) => {
      const messages = await prisma.message.findMany({
        where: {
          projectId: input.projectId,
          project: { userId: ctx.auth.userId },
        },
        orderBy: { createdAt: "asc" },
        include: {
          fragment: true,
        },
      });
      return messages;
    }),
});
