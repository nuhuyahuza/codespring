/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `attachments` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `courseId` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `gradedAt` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Submission` table. All the data in the column will be lost.
  - You are about to alter the column `role` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `VarChar(191)`.
  - You are about to drop the `_StudentEnrollments` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `description` on table `Group` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Lesson` DROP FOREIGN KEY `Lesson_courseId_fkey`;

-- DropForeignKey
ALTER TABLE `Submission` DROP FOREIGN KEY `Submission_courseId_fkey`;

-- DropForeignKey
ALTER TABLE `_StudentEnrollments` DROP FOREIGN KEY `_StudentEnrollments_A_fkey`;

-- DropForeignKey
ALTER TABLE `_StudentEnrollments` DROP FOREIGN KEY `_StudentEnrollments_B_fkey`;

-- AlterTable
ALTER TABLE `Course` DROP COLUMN `imageUrl`;

-- AlterTable
ALTER TABLE `Group` MODIFY `description` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `GroupMember` MODIFY `role` VARCHAR(191) NOT NULL DEFAULT 'member';

-- AlterTable
ALTER TABLE `Submission` DROP COLUMN `attachments`,
    DROP COLUMN `courseId`,
    DROP COLUMN `gradedAt`,
    DROP COLUMN `score`,
    DROP COLUMN `status`,
    ADD COLUMN `grade` DOUBLE NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `role` VARCHAR(191) NOT NULL DEFAULT 'student';

-- DropTable
DROP TABLE `_StudentEnrollments`;

-- CreateTable
CREATE TABLE `Enrollment` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `courseId` VARCHAR(191) NOT NULL,
    `progress` DOUBLE NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Enrollment_userId_courseId_key`(`userId`, `courseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Enrollment` ADD CONSTRAINT `Enrollment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Enrollment` ADD CONSTRAINT `Enrollment_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lesson` ADD CONSTRAINT `Lesson_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
