-- CreateTable
CREATE TABLE `SystemSettings` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `general` JSON NOT NULL,
    `email` JSON NOT NULL,
    `notifications` JSON NOT NULL,
    `security` JSON NOT NULL,
    `payment` JSON NOT NULL,
    `storage` JSON NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
