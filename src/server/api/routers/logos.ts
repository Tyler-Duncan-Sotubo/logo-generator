import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const logoRouter = createTRPCRouter({
  getLogos: protectedProcedure.query(async ({ ctx }) => {
    const icons = await ctx.db.logos.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return icons;
  }),
  getLogosGeneratedInLast60Secs: protectedProcedure.query(async ({ ctx }) => {
    const sixtySecondsAgo = new Date(Date.now() - 60 * 1000); // Get the date 60 seconds ago
    const icons = await ctx.db.logos.findMany({
      where: {
        userId: ctx.session.user.id,
        createdAt: {
          gte: sixtySecondsAgo,
        },
      },
    });
    return icons;
  }),
  getAllLogos: publicProcedure.query(async ({ ctx }) => {
    const icons = await ctx.db.logos.findMany({
      take: 16,
      orderBy: {
        createdAt: "desc",
      },
    });
    return icons;
  }),
});
