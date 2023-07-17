import { use } from "react";
import Parser from "rss-parser";

export default function Home() {
  const parser = new Parser();
  const feed = use(
    parser.parseURL("https://newsletter.pragmaticengineer.com/feed")
  );

  return (
    <main>
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
