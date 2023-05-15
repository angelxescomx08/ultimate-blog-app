import { createTRPCRouter } from "~/server/api/trpc";
import { postRouter } from "./routers/post";
import { authRouter } from "./routers/auth";
import { tagRouter } from "./routers/tag";
import { unsplashRouter } from "./routers/unsplash";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  auth: authRouter,
  tag: tagRouter,
  unsplash: unsplashRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
