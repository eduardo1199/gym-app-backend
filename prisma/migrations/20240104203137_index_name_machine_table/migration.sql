/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Machine` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Machine_name_key" ON "Machine"("name");
