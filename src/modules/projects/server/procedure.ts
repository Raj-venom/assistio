import { z } from "zod";
import { inngest } from "@/inngest/client";
import { createTRPCRouter, baseProcedure } from "@/trpc/init";
import prisma from "@/lib/db";
import { TRPCError } from "@trpc/server";

// TODO: Move to a utility file AND IMPROVE it
function createTitleFromPrompt(prompt: string): string {
  const words = prompt.trim().split(/\s+/);
  const titleWords = words.slice(0, 5);
  const title = titleWords.join(" ");
  return title.length > 50 ? title.substring(0, 50) + "..." : title;
}

export const projectsRouter = createTRPCRouter({
  create: baseProcedure
    .input(
      z.object({
        prompt: z
          .string()
          .min(1, { message: "Prompt is required" })
          .max(1000, { message: "Prompt must be at most 1000 characters" }),
      })
    )
    .mutation(async ({ input }) => {
      const project = await prisma.project.create({
        data: {
          name: createTitleFromPrompt(input.prompt),
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

      return project;
    }),

  getMany: baseProcedure.query(async () => {
    const project = await prisma.project.findMany({
      orderBy: { updatedAt: "desc" },
    });
    return project;
  }),

  getOne: baseProcedure
    .input(
      z.object({
        id: z.string().min(1, { message: "Project ID is required" }),
      })
    )
    .query(async ({ input }) => {
      const project = await prisma.project.findUnique({
        where: { id: input.id },
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
