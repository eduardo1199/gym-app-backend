/*
  Warnings:

  - You are about to alter the column `age` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "weight" DECIMAL NOT NULL,
    "cpf" TEXT NOT NULL PRIMARY KEY,
    "registrationDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startDateForPlan" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDateforPlan" DATETIME NOT NULL,
    "planId" TEXT,
    CONSTRAINT "User_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("age", "cpf", "endDateforPlan", "id", "name", "planId", "registrationDate", "startDateForPlan", "weight") SELECT "age", "cpf", "endDateforPlan", "id", "name", "planId", "registrationDate", "startDateForPlan", "weight" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
