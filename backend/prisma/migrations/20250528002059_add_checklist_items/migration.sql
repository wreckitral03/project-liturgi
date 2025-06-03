-- CreateTable
CREATE TABLE "SummaryChecklistStatus" (
    "id" TEXT NOT NULL,
    "summaryId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "checklist" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SummaryChecklistStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SummaryChecklistStatus_summaryId_userId_key" ON "SummaryChecklistStatus"("summaryId", "userId");

-- AddForeignKey
ALTER TABLE "SummaryChecklistStatus" ADD CONSTRAINT "SummaryChecklistStatus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SummaryChecklistStatus" ADD CONSTRAINT "SummaryChecklistStatus_summaryId_fkey" FOREIGN KEY ("summaryId") REFERENCES "Summary"("id") ON DELETE CASCADE ON UPDATE CASCADE;
