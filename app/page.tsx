import { UserButton, auth } from "@clerk/nextjs";
import Parser from "rss-parser";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "./db";
import updateFeeds from "./updateFeeds";

export default async function Home() {
  const parser = new Parser();
  const feed = await parser.parseURL(
    "https://newsletter.pragmaticengineer.com/feed"
  );

  const subs = await prisma.subscription.findMany({
    where: { userId: auth().userId },
    select: { feed: { select: { url: true } } },
  });

  async function addFeed(data: FormData) {
    "use server";
    const url = z.string().url().parse(data.get("url"));
    try {
      await prisma.feed.create({ data: { url } });
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
    await prisma.subscription.create({
      data: { userId, feed: { connect: { url } } },
    });
  }

  return (
    <main>
      <UserButton afterSignOutUrl="/" />
      <h1>My Subscriptions</h1>
      <ul>
        {subs.map((sub) => (
          <li key={sub.feed.url}>{sub.feed.url}</li>
        ))}
      </ul>
      <form action={addFeed}>
        <input type="text" name="url" />
        <button type="submit">Add Feed</button>
      </form>
      <form action={updateFeeds}>
        <button type="submit">Update Feeds</button>
      </form>
      <h1>{feed.title}</h1>
      <ul>
        {feed.items.map((item) => (
          <li key={item.guid}>
            <a href={item.link}>{item.title}</a>
          </li>
        ))}
      </ul>
    </main>
  );
}
