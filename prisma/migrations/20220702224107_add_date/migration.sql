/*
  Warnings:

  - Added the required column `date` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "order_number" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "delivery" BOOLEAN NOT NULL,
    "notes" TEXT NOT NULL,
    "total" INTEGER NOT NULL,
    "name" TEXT NOT NULL
);
INSERT INTO "new_Order" ("address", "delivery", "id", "name", "notes", "order_number", "phone", "total") SELECT "address", "delivery", "id", "name", "notes", "order_number", "phone", "total" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE UNIQUE INDEX "Order_order_number_key" ON "Order"("order_number");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
