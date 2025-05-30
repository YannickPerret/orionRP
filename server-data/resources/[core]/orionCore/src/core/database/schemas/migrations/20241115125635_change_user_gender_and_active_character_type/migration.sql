/*
  Warnings:

  - A unique constraint covering the columns `[license]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `activeCharacter` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_license_key` ON `User`(`license`);
