-- CreateTable
CREATE TABLE "user_contexts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "context" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_contexts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_contexts" ADD CONSTRAINT "user_contexts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
