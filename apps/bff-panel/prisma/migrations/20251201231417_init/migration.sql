-- CreateTable
CREATE TABLE "BacklogItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "postType" TEXT NOT NULL,
    "targetAudience" TEXT NOT NULL,
    "mainMessage" TEXT,
    "objective" TEXT,
    "sourceInsights" TEXT,
    "structure" TEXT,
    "visualPrompts" TEXT,
    "notes" TEXT,
    "plannedDate" DATETIME
);
