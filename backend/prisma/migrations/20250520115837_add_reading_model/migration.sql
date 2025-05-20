-- CreateTable
CREATE TABLE "Reading" (
    "date" TEXT NOT NULL,
    "firstReference" TEXT NOT NULL,
    "firstContent" TEXT NOT NULL,
    "psalmReference" TEXT NOT NULL,
    "psalmContent" TEXT NOT NULL,
    "secondReference" TEXT,
    "secondContent" TEXT,
    "gospelReference" TEXT NOT NULL,
    "gospelContent" TEXT NOT NULL,

    CONSTRAINT "Reading_pkey" PRIMARY KEY ("date")
);
