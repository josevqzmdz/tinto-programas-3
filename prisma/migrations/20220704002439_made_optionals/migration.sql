-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "order_number" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "delivery" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "total" TEXT,
    "name" TEXT NOT NULL
);
INSERT INTO "new_Order" ("address", "date", "delivery", "id", "name", "notes", "order_number", "phone", "total") SELECT "address", "date", "delivery", "id", "name", "notes", "order_number", "phone", "total" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE UNIQUE INDEX "Order_order_number_key" ON "Order"("order_number");
CREATE TABLE "new_Article" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "article_name" TEXT NOT NULL,
    "color" TEXT,
    "unit_price" TEXT,
    "quantity" INTEGER,
    "orderId" INTEGER,
    CONSTRAINT "Article_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Article" ("article_name", "color", "id", "orderId", "quantity", "unit_price") SELECT "article_name", "color", "id", "orderId", "quantity", "unit_price" FROM "Article";
DROP TABLE "Article";
ALTER TABLE "new_Article" RENAME TO "Article";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
