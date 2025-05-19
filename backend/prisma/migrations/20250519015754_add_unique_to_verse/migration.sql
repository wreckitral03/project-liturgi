/*
  Warnings:

  - A unique constraint covering the columns `[book,chapter,verse]` on the table `Verse` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Verse_book_chapter_verse_key" ON "Verse"("book", "chapter", "verse");
