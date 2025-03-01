-- AlterTable
ALTER TABLE `Course` ADD COLUMN `certificationDetails` JSON NULL,
    ADD COLUMN `certificationPrice` DOUBLE NULL,
    ADD COLUMN `hasCertification` BOOLEAN NOT NULL DEFAULT false;
