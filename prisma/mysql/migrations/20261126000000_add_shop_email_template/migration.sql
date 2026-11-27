CREATE TABLE `ShopEmailTemplate` (
    `shop` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(150) NOT NULL,
    `buttonLabel` VARCHAR(60) NOT NULL,
    `buttonUrl` VARCHAR(2048) NOT NULL,

    PRIMARY KEY (`shop`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
