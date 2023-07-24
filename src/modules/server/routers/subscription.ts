import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import Parser from "rss-parser";

const subscriptionRouter = router({
  list: protectedProcedure.query(({ ctx }) =>
    ctx.prisma.subscription.findMany({
      where: {
        userId: ctx.auth.userId,
      },
      select: {
        feed: {
          select: {
            url: true,
            title: true,
            Posts: { select: { link: true, title: true } },
          },
        },
      },
    })
  ),
  add: protectedProcedure
    .input(z.object({ url: z.string().url() }))
    .mutation(async ({ ctx, input }) => {
      const parser = new Parser();
      const feed = await parser.parseURL(input.url);
      return ctx.prisma.subscription.create({
        data: {
          feed: {
            connectOrCreate: {
              where: { url: input.url },
              create: { url: input.url, title: feed.title ?? "Untitled Feed" },
            },
          },
          userId: ctx.auth.userId,
        },
      });
    }),
});

export default subscriptionRouter;
