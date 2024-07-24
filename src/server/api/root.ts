import { generateRouter } from "./routers/generate";
import { checkoutRouter } from "./routers/checkout";
import { logoRouter } from "./routers/logos";
import { userRouter } from "./routers/user";
import { generateIconRouter } from "./routers/generateIcon";
import { iconRouter } from "./routers/icons";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  generate: generateRouter,
  checkout: checkoutRouter,
  logos: logoRouter,
  user: userRouter,
  generateIcon: generateIconRouter,
  icons: iconRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
