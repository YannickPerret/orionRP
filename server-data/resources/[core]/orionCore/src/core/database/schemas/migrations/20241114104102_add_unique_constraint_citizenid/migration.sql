-- CreateTable
CREATE TABLE `User` (
    `id` CHAR(36) NOT NULL,
    `license` VARCHAR(255) NOT NULL,
    `steamId` VARCHAR(255) NULL,
    `ip` VARCHAR(45) NULL,
    `lastConnection` DATETIME(3) NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `username` VARCHAR(255) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT false,
    `source` INTEGER NULL,
    `activeCharacter` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `roleId` CHAR(36) NOT NULL,

    UNIQUE INDEX `User_steamId_key`(`steamId`),
    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_username_key`(`username`),
    INDEX `id`(`id`),
    INDEX `licences`(`license`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `id` CHAR(36) NOT NULL,
    `name` ENUM('ADMIN', 'HELPER', 'DEVELOPER', 'GUEST', 'USER') NOT NULL,

    UNIQUE INDEX `Role_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Character` (
    `id` CHAR(36) NOT NULL,
    `userId` CHAR(36) NOT NULL,
    `citizenid` VARCHAR(50) NOT NULL,
    `firstName` VARCHAR(255) NOT NULL,
    `lastName` VARCHAR(255) NOT NULL,
    `gender` ENUM('MALE', 'FEMALE') NOT NULL DEFAULT 'MALE',
    `model` VARCHAR(255) NULL,
    `appearance` JSON NULL,
    `clothes` JSON NULL,
    `weapons` JSON NULL,
    `money` INTEGER NOT NULL DEFAULT 500,
    `bank` INTEGER NOT NULL DEFAULT 0,
    `position` JSON NOT NULL,
    `hunger` DOUBLE NOT NULL DEFAULT 100,
    `thirst` DOUBLE NOT NULL DEFAULT 100,
    `health` DOUBLE NOT NULL DEFAULT 100,
    `armor` DOUBLE NOT NULL DEFAULT 0,
    `isDead` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Character_citizenid_key`(`citizenid`),
    INDEX `id`(`id`),
    INDEX `userId`(`userId`),
    INDEX `citizenid`(`citizenid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Inventory` (
    `id` CHAR(36) NOT NULL,
    `weight` DOUBLE NOT NULL DEFAULT 0,
    `characterId` CHAR(36) NULL,

    UNIQUE INDEX `Inventory_characterId_key`(`characterId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Item` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `image` VARCHAR(255) NOT NULL,
    `stackable` BOOLEAN NOT NULL DEFAULT true,
    `usable` BOOLEAN NOT NULL DEFAULT false,
    `effects` JSON NULL,
    `metadata` JSON NULL,

    UNIQUE INDEX `Item_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InventoryItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quantity` INTEGER NOT NULL,
    `inventoryId` CHAR(36) NOT NULL,
    `itemId` CHAR(36) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vehicle` (
    `id` CHAR(36) NOT NULL,
    `model` VARCHAR(255) NOT NULL,
    `plate` VARCHAR(255) NOT NULL,
    `positionX` DOUBLE NOT NULL,
    `positionY` DOUBLE NOT NULL,
    `positionZ` DOUBLE NOT NULL,
    `isImpounded` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `characterId` CHAR(36) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Character` ADD CONSTRAINT `Character_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inventory` ADD CONSTRAINT `Inventory_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `Character`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryItem` ADD CONSTRAINT `InventoryItem_inventoryId_fkey` FOREIGN KEY (`inventoryId`) REFERENCES `Inventory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryItem` ADD CONSTRAINT `InventoryItem_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `Item`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vehicle` ADD CONSTRAINT `Vehicle_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `Character`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
