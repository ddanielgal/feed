import { ClerkProvider } from "@clerk/nextjs";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { trpc } from "~/modules/trpc";

const inter = Inter({ subsets: ["latin"] });

function App({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider {...pageProps}>
      <main className={inter.className}>
        <Component {...pageProps} />
      </main>
    </ClerkProvider>
  );
}

export default trpc.withTRPC(App);
