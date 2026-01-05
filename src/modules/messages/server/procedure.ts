import { z } from "zod";
import { inngest } from "@/inngest/client";
import { createTRPCRouter, baseProcedure } from "@/trpc/init";
import prisma from "@/lib/db";

export const messagesRouter = createTRPCRouter({
  create: baseProcedure
    .input(
      z.object({
        prompt: z.string()
        .min(1, { message: "Prompt is required" })
        .max(1000, { message: "Prompt must be at most 1000 characters" }),
        projectId: z.string().min(1, { message: "Project ID is required" }),
      })
    )
    .mutation(async ({ input }) => {
      const newMessage = await prisma.message.create({
        data: {
          projectId: input.projectId,
          content: input.prompt,
          role: "USER",
          type: "RESULT",
        },
      });

      await inngest.send({
        name: "code-agent/run",
        data: { prompt: input.prompt, projectId: input.projectId },
      });

      return newMessage;
    }),

  getMany: baseProcedure.query(async () => {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        fragment: true,
      },
    });
    return messages;
  }),
});
