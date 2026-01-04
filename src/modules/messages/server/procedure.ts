import { z } from "zod";
import { inngest } from "@/inngest/client";
import { createTRPCRouter, baseProcedure } from "@/trpc/init";
import prisma from "@/lib/db";

export const messagesRouter = createTRPCRouter({
  create: baseProcedure
    .input(
      z.object({
        prompt: z.string().min(1, { message: "Prompt is required" }),
      })
    )
    .mutation(async ({ input }) => {
      const newMessage = await prisma.message.create({
        data: {
          content: input.prompt,
          role: "USER",
          type: "RESULT",
        },
      });

      await inngest.send({
        name: "code-agent/run",
        data: { prompt: input.prompt },
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
