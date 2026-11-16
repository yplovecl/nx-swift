-- AlterTable
ALTER TABLE "Subscriber" ADD COLUMN "receivedCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "AppSetting" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "MailPack" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "credits" INTEGER NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "active" BOOLEAN NOT NULL DEFAULT 1,
    "sort" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "ShopMailBalance" (
    "shop" TEXT NOT NULL PRIMARY KEY,
    "allowance" INTEGER NOT NULL,
    "used" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "MailPurchase" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shop" TEXT NOT NULL,
    "packId" INTEGER NOT NULL,
    "credits" INTEGER NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "chargeGid" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "applied" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MailPurchase_packId_fkey" FOREIGN KEY ("packId") REFERENCES "MailPack" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MailDelivery" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shop" TEXT NOT NULL,
    "subscriberId" INTEGER,
    "email" TEXT NOT NULL,
    "sentAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MailDelivery_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "Subscriber" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "MailPurchase_chargeGid_key" ON "MailPurchase"("chargeGid");

-- CreateIndex
CREATE INDEX "MailPurchase_shop_createdAt_idx" ON "MailPurchase"("shop", "createdAt");

-- CreateIndex
CREATE INDEX "MailDelivery_shop_sentAt_idx" ON "MailDelivery"("shop", "sentAt");

-- CreateIndex
CREATE INDEX "MailDelivery_shop_email_idx" ON "MailDelivery"("shop", "email");

-- CreateIndex
CREATE INDEX "MailDelivery_subscriberId_idx" ON "MailDelivery"("subscriberId");

-- Seed the default allowance and the purchasable packs. Change these rows to reconfigure.
INSERT INTO "AppSetting" ("key", "value") VALUES ('default_mail_quota', '100');
INSERT INTO "MailPack" ("credits", "priceCents", "currency", "active", "sort") VALUES
    (500, 100, 'USD', 1, 1),
    (3000, 500, 'USD', 1, 2),
    (8000, 1000, 'USD', 1, 3);
