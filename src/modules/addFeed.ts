import Parser from "rss-parser";
import { z } from "zod";
import { prisma } from "./server/db";
import { Prisma } from "@prisma/client";
import { auth } from "@clerk/nextjs";

export default async function addFeed(data: FormData) {
  "use server";
  const url = z.string().url().parse(data.get("url"));
  const parser = new Parser();
  const feed = await parser.parseURL(url);
  try {
    await prisma.feed.create({
      data: { url, title: feed.title ?? "Untitled Feed" },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002" // unique constraint failed
    ) {
      console.info(`Feed ${url} already exists`);
    } else {
      throw error;
    }
  }
  const userId = auth().userId;
  if (!userId) {
    throw new Error("Not logged in");
  }
  await prisma.subscription.create({
    data: { userId, feed: { connect: { url } } },
  });
}
