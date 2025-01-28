-- AlterTable
ALTER TABLE `Lesson` MODIFY `description` TEXT NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `instructorProfile` JSON NULL;
