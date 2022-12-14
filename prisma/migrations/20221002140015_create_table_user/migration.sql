-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" TEXT NOT NULL,
    "weight" DECIMAL NOT NULL,
    "cpf" TEXT NOT NULL PRIMARY KEY,
    "registrationDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startDateForPlan" DATETIME NOT NULL,
    "endDateforPlan" DATETIME NOT NULL,
    "planId" TEXT NOT NULL,
    CONSTRAINT "User_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
