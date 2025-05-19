-- CreateTable
CREATE TABLE "Verse" (
    "id" SERIAL NOT NULL,
    "book" TEXT NOT NULL,
    "chapter" INTEGER NOT NULL,
    "verse" INTEGER NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "Verse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Verse_book_chapter_verse_idx" ON "Verse"("book", "chapter", "verse");
