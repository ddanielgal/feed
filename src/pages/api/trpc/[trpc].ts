import * as trpcNext from "@trpc/server/adapters/next";
import { appRouter } from "~/modules/server/routers/root";
import { createTRPCContext } from "~/modules/server/trpc";

// export API handler
// @see https://trpc.io/docs/server/adapters
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
});
