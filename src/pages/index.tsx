import { UserButton, auth, useAuth } from "@clerk/nextjs";
import Head from "next/head";
import { prisma } from "../modules/db";
import { use } from "react";

export default function Home() {
  const { userId } = useAuth();

  if (!userId) {
    return null;
  }

  const subs: {
    feed: {
      url: string;
      title: string;
      Posts: { link: string; title: string }[];
    };
  }[] = [];
  //   use(
  //     prisma.subscription.findMany({
  //       where: { userId },
  //       select: {
  //         feed: {
  //           select: {
  //             url: true,
  //             title: true,
  //             Posts: { select: { link: true, title: true } },
  //           },
  //         },
  //       },
  //     })
  //   );

  return (
    <main>
      <Head>
        <title>Feed</title>
      </Head>
      <UserButton afterSignOutUrl="/" />
      <h1>My Subscriptions</h1>
      <ul>
        {subs.map((sub) => (
          <li key={sub.feed.url}>{sub.feed.url}</li>
        ))}
      </ul>
      {/* <form action={addFeed}>
        <input type="text" name="url" />
        <button type="submit">Add Feed</button>
      </form>
      <form action={updateFeeds}>
        <button type="submit">Update Feeds</button>
      </form> */}
      {subs.map((sub) => (
        <section key={sub.feed.url}>
          <h1>{sub.feed.title}</h1>
          <ul>
            {sub.feed.Posts.map((post) => (
              <li key={post.link}>
                <a href={post.link}>{post.title}</a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
