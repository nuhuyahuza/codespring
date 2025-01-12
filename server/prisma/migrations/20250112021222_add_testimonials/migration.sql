/*
  Warnings:

  - You are about to drop the column `resetToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `resetTokenExp` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Course` ADD COLUMN `category` VARCHAR(191) NOT NULL DEFAULT 'other',
    ADD COLUMN `duration` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `imageUrl` VARCHAR(191) NULL,
    ADD COLUMN `level` VARCHAR(191) NOT NULL DEFAULT 'beginner',
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE `User` DROP COLUMN `resetToken`,
    DROP COLUMN `resetTokenExp`,
    ADD COLUMN `avatar` VARCHAR(191) NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE `CourseReview` (
    `id` VARCHAR(191) NOT NULL,
    `rating` INTEGER NOT NULL,
    `comment` TEXT NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `courseId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `CourseReview_userId_idx`(`userId`),
    INDEX `CourseReview_courseId_idx`(`courseId`),
    UNIQUE INDEX `CourseReview_userId_courseId_key`(`userId`, `courseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Testimonial` (
    `id` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Testimonial_studentId_idx`(`studentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CourseReview` ADD CONSTRAINT `CourseReview_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourseReview` ADD CONSTRAINT `CourseReview_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Testimonial` ADD CONSTRAINT `Testimonial_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `Course` RENAME INDEX `Course_instructorId_fkey` TO `Course_instructorId_idx`;
