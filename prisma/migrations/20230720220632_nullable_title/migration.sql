/*
  Warnings:

  - Added the required column `title` to the `Feed` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Feed" ADD COLUMN     "title" TEXT NOT NULL;
