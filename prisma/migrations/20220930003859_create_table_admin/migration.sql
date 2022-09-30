-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "cpf" TEXT NOT NULL PRIMARY KEY,
    "password" TEXT NOT NULL,
    "birthDate" TEXT NOT NULL
);
