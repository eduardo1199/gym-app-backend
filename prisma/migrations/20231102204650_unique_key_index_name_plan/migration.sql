/*
  Warnings:

  - A unique constraint covering the columns `[name,timeOfPlan]` on the table `Plan` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Plan_name_timeOfPlan_key" ON "Plan"("name", "timeOfPlan");
