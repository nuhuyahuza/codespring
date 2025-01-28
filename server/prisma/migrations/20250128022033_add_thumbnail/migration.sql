/*
  Warnings:

  - You are about to alter the column `duration` on the `Course` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(5,2)`.
  - You are about to drop the `Testimonial` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Testimonial` DROP FOREIGN KEY `Testimonial_studentId_fkey`;

-- AlterTable
ALTER TABLE `Course` ADD COLUMN `learningObjectives` JSON NULL,
    ADD COLUMN `rating` DECIMAL(3, 2) NULL DEFAULT 0.00,
    ADD COLUMN `requirements` JSON NULL,
    ADD COLUMN `thumbnail` VARCHAR(191) NULL,
    MODIFY `duration` DECIMAL(5, 2) NOT NULL DEFAULT 0.00;

-- DropTable
DROP TABLE `Testimonial`;

-- CreateIndex
CREATE INDEX `Course_category_idx` ON `Course`(`category`);

-- CreateIndex
CREATE INDEX `Course_level_idx` ON `Course`(`level`);

-- CreateIndex
CREATE INDEX `User_email_idx` ON `User`(`email`);
