import { UserButton } from "@clerk/nextjs";
import Head from "next/head";
import { trpc } from "~/modules/trpc";

export default function Home() {
  const { data: subscriptions } = trpc.subscriptions.list.useQuery();

  if (!subscriptions) {
    return null;
  }

  return (
    <>
      <header>
        <UserButton afterSignOutUrl="/" />
      </header>
      <main>
        <Head>
          <title>Feed</title>
        </Head>
        <h1>My Subscriptions</h1>
        <ul>
          {subscriptions.map((sub) => (
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
        {subscriptions.map((sub) => (
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
    </>
  );
}
