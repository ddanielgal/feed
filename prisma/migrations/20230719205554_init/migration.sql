-- CreateTable
CREATE TABLE "Feed" (
    "url" TEXT NOT NULL,

    CONSTRAINT "Feed_pkey" PRIMARY KEY ("url")
);

-- CreateTable
CREATE TABLE "Post" (
    "guid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "pubDate" TIMESTAMP(3) NOT NULL,
    "feedUrl" TEXT NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("guid")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "userId" TEXT NOT NULL,
    "feedUrl" TEXT NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("userId","feedUrl")
);

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_feedUrl_fkey" FOREIGN KEY ("feedUrl") REFERENCES "Feed"("url") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_feedUrl_fkey" FOREIGN KEY ("feedUrl") REFERENCES "Feed"("url") ON DELETE RESTRICT ON UPDATE CASCADE;
