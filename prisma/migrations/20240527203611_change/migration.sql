/*
  Warnings:

  - You are about to drop the column `timeOfPlan` on the `Plan` table. All the data in the column will be lost.
  - You are about to drop the column `birthDate` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `endDateforPlan` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `registrationDate` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `startDateForPlan` on the `User` table. All the data in the column will be lost.
  - Added the required column `plan_month_time` to the `Plan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birth_date` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `finish_plan_date` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Plan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "plan_month_time" INTEGER NOT NULL,
    "price" DECIMAL NOT NULL
);
INSERT INTO "new_Plan" ("id", "name", "price") SELECT "id", "name", "price" FROM "Plan";
DROP TABLE "Plan";
ALTER TABLE "new_Plan" RENAME TO "Plan";
CREATE UNIQUE INDEX "Plan_name_key" ON "Plan"("name");
CREATE UNIQUE INDEX "Plan_plan_month_time_key" ON "Plan"("plan_month_time");
CREATE UNIQUE INDEX "Plan_name_plan_month_time_key" ON "Plan"("name", "plan_month_time");
CREATE TABLE "new_Admin" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "cpf" TEXT NOT NULL PRIMARY KEY,
    "password" TEXT NOT NULL,
    "birth_date" TEXT NOT NULL
);
INSERT INTO "new_Admin" ("cpf", "id", "name", "password", "year") SELECT "cpf", "id", "name", "password", "year" FROM "Admin";
DROP TABLE "Admin";
ALTER TABLE "new_Admin" RENAME TO "Admin";
CREATE UNIQUE INDEX "Admin_id_key" ON "Admin"("id");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "weight" REAL NOT NULL,
    "cpf" TEXT NOT NULL PRIMARY KEY,
    "create_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "start_plan_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finish_plan_date" DATETIME NOT NULL,
    "planId" TEXT,
    CONSTRAINT "User_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("age", "cpf", "id", "name", "planId", "weight") SELECT "age", "cpf", "id", "name", "planId", "weight" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_id_cpf_key" ON "User"("id", "cpf");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
