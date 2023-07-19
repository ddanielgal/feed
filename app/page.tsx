import { UserButton } from "@clerk/nextjs";
import { use } from "react";
import Parser from "rss-parser";
import { z } from "zod";
import { prisma } from "./db";

export default function Home() {
  const parser = new Parser();
  const feed = use(
    parser.parseURL("https://newsletter.pragmaticengineer.com/feed")
  );

  async function addFeed(data: FormData) {
    "use server";
    const url = z.string().url().parse(data.get("url"));
    await prisma.feed.create({ data: { url } });
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
