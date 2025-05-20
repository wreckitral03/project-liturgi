-- CreateTable
CREATE TABLE "Summary" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "checklist" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Summary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Summary_date_key" ON "Summary"("date");
