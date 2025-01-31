/*
  Warnings:

  - You are about to alter the column `duration` on the `Course` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `status` on the `Course` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.
  - You are about to alter the column `rating` on the `Course` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.
  - You are about to drop the column `quizData` on the `Lesson` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Course` DROP FOREIGN KEY `Course_instructorId_fkey`;

-- DropForeignKey
ALTER TABLE `Lesson` DROP FOREIGN KEY `Lesson_courseId_fkey`;

-- DropForeignKey
ALTER TABLE `LessonProgress` DROP FOREIGN KEY `LessonProgress_lessonId_fkey`;

-- DropForeignKey
ALTER TABLE `LessonProgress` DROP FOREIGN KEY `LessonProgress_userId_fkey`;

-- AlterTable
ALTER TABLE `Course` ADD COLUMN `completionCriteria` JSON NULL,
    ADD COLUMN `isLiveEnabled` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `language` VARCHAR(191) NOT NULL DEFAULT 'English',
    ADD COLUMN `lastSavedStep` VARCHAR(191) NULL,
    ADD COLUMN `liveSessionDetails` JSON NULL,
    ADD COLUMN `tags` TEXT NULL,
    MODIFY `duration` INTEGER NOT NULL DEFAULT 0,
    MODIFY `status` ENUM('DRAFT', 'IN_REVIEW', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    MODIFY `rating` DOUBLE NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `Lesson` DROP COLUMN `quizData`,
    ADD COLUMN `attachments` JSON NULL,
    ADD COLUMN `completionCriteria` JSON NULL,
    ADD COLUMN `isPreview` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `sectionId` VARCHAR(191) NULL,
    MODIFY `order` INTEGER NOT NULL DEFAULT 0,
    MODIFY `type` ENUM('VIDEO', 'READING', 'QUIZ', 'ASSIGNMENT', 'LIVE_SESSION') NOT NULL DEFAULT 'VIDEO';

-- AlterTable
ALTER TABLE `LessonProgress` ADD COLUMN `lastPosition` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `Section` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `order` INTEGER NOT NULL,
    `courseId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Section_courseId_idx`(`courseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Resource` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `type` ENUM('DOCUMENT', 'VIDEO', 'AUDIO', 'CODE', 'LINK') NOT NULL DEFAULT 'DOCUMENT',
    `url` VARCHAR(191) NOT NULL,
    `lessonId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Resource_lessonId_idx`(`lessonId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Course_status_idx` ON `Course`(`status`);

-- CreateIndex
CREATE INDEX `Lesson_sectionId_idx` ON `Lesson`(`sectionId`);

-- CreateIndex
CREATE INDEX `LessonProgress_userId_idx` ON `LessonProgress`(`userId`);

-- AddForeignKey
ALTER TABLE `Course` ADD CONSTRAINT `Course_instructorId_fkey` FOREIGN KEY (`instructorId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Section` ADD CONSTRAINT `Section_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lesson` ADD CONSTRAINT `Lesson_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `Section`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lesson` ADD CONSTRAINT `Lesson_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Resource` ADD CONSTRAINT `Resource_lessonId_fkey` FOREIGN KEY (`lessonId`) REFERENCES `Lesson`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LessonProgress` ADD CONSTRAINT `LessonProgress_lessonId_fkey` FOREIGN KEY (`lessonId`) REFERENCES `Lesson`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LessonProgress` ADD CONSTRAINT `LessonProgress_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
