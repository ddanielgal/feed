import { protectedProcedure, router } from "../trpc";

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
});

export default subscriptionRouter;
