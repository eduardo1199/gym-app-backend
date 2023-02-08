-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" TEXT NOT NULL,
    "weight" DECIMAL NOT NULL,
    "cpf" TEXT NOT NULL PRIMARY KEY,
    "registrationDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startDateForPlan" DATETIME NOT NULL,
    "endDateforPlan" DATETIME NOT NULL,
    "planId" TEXT,
    CONSTRAINT "User_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("age", "cpf", "endDateforPlan", "id", "name", "planId", "registrationDate", "startDateForPlan", "weight") SELECT "age", "cpf", "endDateforPlan", "id", "name", "planId", "registrationDate", "startDateForPlan", "weight" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
