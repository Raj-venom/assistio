import { getRemainingCredits } from "@/lib/usage";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const usageRouter = createTRPCRouter({
  status: protectedProcedure.query(async ({ ctx }) => {
    try {
      const result = await getRemainingCredits(ctx.auth.userId);

      return result;
    } catch (error) {
      return null;
    }
  }),
});
