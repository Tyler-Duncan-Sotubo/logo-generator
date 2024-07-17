import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const generateRouter = createTRPCRouter({
  generateLogo: publicProcedure
    .input(
      z.object({
        logoName: z.string(),
        tagLine: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      console.log("Generating logo..." + input.logoName + " " + input.tagLine);
      return {
        logoUrl: "https://via.placeholder.com/150",
      };
    }),
});
