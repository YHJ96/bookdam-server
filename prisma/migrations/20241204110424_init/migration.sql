/*
  Warnings:

  - The primary key for the `Tags` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Tags` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Tags` table. All the data in the column will be lost.
  - You are about to drop the `BookmarkTags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Bookmarks` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `bookmark_id` to the `Tags` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tag_id` to the `Tags` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BookmarkTags" DROP CONSTRAINT "bookmarktags_bookmark_id_fkey";

-- DropForeignKey
ALTER TABLE "BookmarkTags" DROP CONSTRAINT "bookmarktags_tag_id_fkey";

-- DropIndex
DROP INDEX "tags_name_key";

-- AlterTable
ALTER TABLE "Tags" DROP CONSTRAINT "tags_pkey",
RENAME CONSTRAINT "tags_pkey" TO "Tags_pkey",
DROP COLUMN "id",
DROP COLUMN "name",
ADD COLUMN     "bookmark_id" INTEGER NOT NULL,
ADD COLUMN     "tag_id" INTEGER NOT NULL,
ADD CONSTRAINT "Tags_pkey" PRIMARY KEY ("bookmark_id", "tag_id");

-- DropTable
DROP TABLE "BookmarkTags";

-- DropTable
DROP TABLE "Bookmarks";

-- CreateTable
CREATE TABLE "Bookmark" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "bookmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "provider" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tag_name_key" ON "Tag"("name");

-- AddForeignKey
ALTER TABLE "Tags" ADD CONSTRAINT "tags_bookmark_id_fkey" FOREIGN KEY ("bookmark_id") REFERENCES "Bookmark"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Tags" ADD CONSTRAINT "tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
