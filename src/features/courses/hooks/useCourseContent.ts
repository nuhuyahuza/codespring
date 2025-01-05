import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

interface Lesson {
  id: string;
  title: string;
  videoUrl: string | null;
  content: string | null;
  order: number;
}

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: {
    name: string;
  };
}

interface Progress {
  completedLessons: string[];
  currentLesson: string | null;
  totalProgress: number;
}

async function fetchCourseContent(courseId: string) {
  const response = await fetch(`/api/courses/${courseId}/content`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch course content');
  }

  return response.json();
}

async function fetchLesson(lessonId: string) {
  const response = await fetch(`/api/lessons/${lessonId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch lesson');
  }

  return response.json();
}

async function fetchProgress(courseId: string) {
  const response = await fetch(`/api/courses/${courseId}/progress`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch progress');
  }

  return response.json();
}

export function useCourseContent(courseId: string, currentLessonId: string | null) {
  const {
    data: courseData,
    isLoading: isLoadingCourse,
    error: courseError,
  } = useQuery({
    queryKey: ['course-content', courseId],
    queryFn: () => fetchCourseContent(courseId),
  });

  const {
    data: lessonData,
    isLoading: isLoadingLesson,
    error: lessonError,
  } = useQuery({
    queryKey: ['lesson', currentLessonId],
    queryFn: () => (currentLessonId ? fetchLesson(currentLessonId) : null),
    enabled: !!currentLessonId,
  });

  const {
    data: progressData,
    isLoading: isLoadingProgress,
    error: progressError,
  } = useQuery({
    queryKey: ['progress', courseId],
    queryFn: () => fetchProgress(courseId),
  });

  // Set initial lesson if none selected
  useEffect(() => {
    if (courseData?.lessons?.length > 0 && !currentLessonId) {
      const lastIncompleteLesson = courseData.lessons.find(
        (lesson: Lesson) => !progressData?.completedLessons.includes(lesson.id)
      );
      if (lastIncompleteLesson) {
        // You might want to handle this through a callback instead
        // setCurrentLessonId(lastIncompleteLesson.id);
      }
    }
  }, [courseData, progressData, currentLessonId]);

  return {
    course: courseData?.course as Course | undefined,
    lessons: courseData?.lessons as Lesson[] | undefined,
    currentLesson: lessonData?.lesson as Lesson | undefined,
    progress: progressData as Progress | undefined,
    isLoading: isLoadingCourse || isLoadingLesson || isLoadingProgress,
    error: courseError || lessonError || progressError,
  };
} 