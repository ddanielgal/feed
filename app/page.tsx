import { UserButton, auth } from "@clerk/nextjs";
import { use } from "react";
import Parser from "rss-parser";
import { z } from "zod";
import { prisma } from "./db";
import { Prisma } from "@prisma/client";

export default function Home() {
  const parser = new Parser();
  const feed = use(
    parser.parseURL("https://newsletter.pragmaticengineer.com/feed")
  );

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
      <form action={addFeed}>
        <input type="text" name="url" />
        <button type="submit">Add Feed</button>
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
