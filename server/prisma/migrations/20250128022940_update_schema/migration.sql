-- AlterTable
ALTER TABLE `Course` MODIFY `duration` VARCHAR(191) NOT NULL DEFAULT '0.00',
    MODIFY `rating` VARCHAR(191) NULL DEFAULT '0.00';

-- RenameIndex
ALTER TABLE `Enrollment` RENAME INDEX `Enrollment_courseId_fkey` TO `Enrollment_courseId_idx`;

-- RenameIndex
ALTER TABLE `Group` RENAME INDEX `Group_courseId_fkey` TO `Group_courseId_idx`;

-- RenameIndex
ALTER TABLE `GroupMember` RENAME INDEX `GroupMember_groupId_fkey` TO `GroupMember_groupId_idx`;

-- RenameIndex
ALTER TABLE `Lesson` RENAME INDEX `Lesson_courseId_fkey` TO `Lesson_courseId_idx`;

-- RenameIndex
ALTER TABLE `LessonProgress` RENAME INDEX `LessonProgress_lessonId_fkey` TO `LessonProgress_lessonId_idx`;

-- RenameIndex
ALTER TABLE `Message` RENAME INDEX `Message_groupId_fkey` TO `Message_groupId_idx`;

-- RenameIndex
ALTER TABLE `Message` RENAME INDEX `Message_userId_fkey` TO `Message_userId_idx`;

-- RenameIndex
ALTER TABLE `Submission` RENAME INDEX `Submission_lessonId_fkey` TO `Submission_lessonId_idx`;

-- RenameIndex
ALTER TABLE `Submission` RENAME INDEX `Submission_userId_fkey` TO `Submission_userId_idx`;
