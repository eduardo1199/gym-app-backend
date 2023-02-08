/*
  Warnings:

  - A unique constraint covering the columns `[id,cpf]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Admin_id_cpf_key" ON "Admin"("id", "cpf");
