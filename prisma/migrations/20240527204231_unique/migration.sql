/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "weight" REAL NOT NULL,
    "cpf" TEXT NOT NULL,
    "create_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "start_plan_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finish_plan_date" DATETIME NOT NULL,
    "planId" TEXT,
    CONSTRAINT "User_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("age", "cpf", "create_at", "finish_plan_date", "id", "name", "planId", "start_plan_date", "weight") SELECT "age", "cpf", "create_at", "finish_plan_date", "id", "name", "planId", "start_plan_date", "weight" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_cpf_key" ON "User"("cpf");
CREATE UNIQUE INDEX "User_id_cpf_key" ON "User"("id", "cpf");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
