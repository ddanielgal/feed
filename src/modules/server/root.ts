import { router } from "./trpc";
import subscriptionRouter from "./routers/subscription";

export const appRouter = router({
  subscriptions: subscriptionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
