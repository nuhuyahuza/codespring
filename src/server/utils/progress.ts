interface LessonProgress {
  lessonId: string;
  completed: boolean;
  timeSpent: number;
}

/**
 * Calculates the overall progress percentage for a course based on lesson progress
 * @param progress Array of lesson progress records
 * @returns Progress percentage (0-100)
 */
export function calculateProgress(progress: LessonProgress[]): number {
  if (!progress || progress.length === 0) {
    return 0;
  }

  const completedLessons = progress.filter((lesson) => lesson.completed).length;
  const totalLessons = progress.length;

  return Math.round((completedLessons / totalLessons) * 100);
} 