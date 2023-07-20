"use server";

import { auth } from "@clerk/nextjs";
import Parser from "rss-parser";
import { Prisma } from "@prisma/client";
import { prisma } from "./db";

export default async function updateFeeds() {
  const parser = new Parser();
  const userId = auth().userId;
  const feeds = await prisma.feed.findMany({
    where: { Subscriptions: { some: { userId } } },
    select: { url: true },
  });
  for (const subFeed of feeds) {
    const { url } = subFeed;
    const feed = await parser.parseURL(url);
    for (const item of feed.items) {
      try {
        await prisma.post.create({
          data: {
            Feed: { connect: { url } },
            title: item.title,
            guid: item.guid,
            link: item.link,
            pubDate: new Date(item.pubDate),
          },
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002" // unique constraint failed
        ) {
          console.info(`Post ${item.guid} already exists`);
        } else {
          throw error;
        }
      }
    }
  }
}
