import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { z } from "zod";

export const iconRouter = createTRPCRouter({
  getIcons: protectedProcedure.query(async ({ ctx, input }) => {
    const icons = await ctx.db.icons.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return icons;
  }),
  getIconsById: publicProcedure.input(z.string()).query(async (opts) => {
    console.log(opts.input);
    const { input } = opts;
    const icons = await opts.ctx.db.icons.findUnique({
      where: {
        id: input,
      },
    });
    return icons;
  }),
  getIconsGeneratedInLast60Secs: protectedProcedure.query(async ({ ctx }) => {
    const sixtySecondsAgo = new Date(Date.now() - 60 * 1000); // Get the date 60 seconds ago
    const icons = await ctx.db.icons.findMany({
      where: {
        userId: ctx.session.user.id,
        createdAt: {
          gte: sixtySecondsAgo,
        },
      },
    });
    return icons;
  }),

  getAllIcons: publicProcedure.query(async ({ ctx }) => {
    const icons = await ctx.db.icons.findMany({
      take: 16,
      orderBy: {
        createdAt: "desc",
      },
    });
    return icons;
  }),
});
