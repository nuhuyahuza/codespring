-- AlterTable
ALTER TABLE `User` ADD COLUMN `dateOfBirth` DATETIME(3) NULL,
    ADD COLUMN `educationLevel` VARCHAR(191) NULL,
    ADD COLUMN `hasCompletedOnboarding` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `interests` TEXT NULL,
    ADD COLUMN `occupation` VARCHAR(191) NULL,
    ADD COLUMN `phoneNumber` VARCHAR(191) NULL,
    ADD COLUMN `preferredLanguage` VARCHAR(191) NULL;
