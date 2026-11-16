-- AlterTable
ALTER TABLE `Subscriber` ADD COLUMN `receivedCount` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `AppSetting` (
    `key` VARCHAR(64) NOT NULL,
    `value` VARCHAR(32) NOT NULL,

    PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MailPack` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `credits` INTEGER NOT NULL,
    `priceCents` INTEGER NOT NULL,
    `currency` VARCHAR(3) NOT NULL DEFAULT 'USD',
    `active` BOOLEAN NOT NULL DEFAULT true,
    `sort` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ShopMailBalance` (
    `shop` VARCHAR(191) NOT NULL,
    `allowance` INTEGER NOT NULL,
    `used` INTEGER NOT NULL DEFAULT 0,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`shop`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MailPurchase` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `shop` VARCHAR(191) NOT NULL,
    `packId` INTEGER NOT NULL,
    `credits` INTEGER NOT NULL,
    `priceCents` INTEGER NOT NULL,
    `currency` VARCHAR(3) NOT NULL,
    `chargeGid` VARCHAR(128) NOT NULL,
    `status` VARCHAR(32) NOT NULL,
    `applied` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `MailPurchase_chargeGid_key`(`chargeGid`),
    INDEX `MailPurchase_shop_createdAt_idx`(`shop`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MailDelivery` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `shop` VARCHAR(191) NOT NULL,
    `subscriberId` INTEGER NULL,
    `email` VARCHAR(254) NOT NULL,
    `sentAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `MailDelivery_shop_sentAt_idx`(`shop`, `sentAt`),
    INDEX `MailDelivery_shop_email_idx`(`shop`, `email`),
    INDEX `MailDelivery_subscriberId_idx`(`subscriberId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MailPurchase` ADD CONSTRAINT `MailPurchase_packId_fkey` FOREIGN KEY (`packId`) REFERENCES `MailPack`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MailDelivery` ADD CONSTRAINT `MailDelivery_subscriberId_fkey` FOREIGN KEY (`subscriberId`) REFERENCES `Subscriber`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- Seed the default allowance and the purchasable packs. Change these rows to reconfigure.
INSERT INTO `AppSetting` (`key`, `value`) VALUES ('default_mail_quota', '100');
INSERT INTO `MailPack` (`credits`, `priceCents`, `currency`, `active`, `sort`) VALUES
    (500, 100, 'USD', true, 1),
    (3000, 500, 'USD', true, 2),
    (8000, 1000, 'USD', true, 3);
