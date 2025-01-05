import { useQuery } from '@tanstack/react-query';

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  difficulty: string;
  tags: string[];
  thumbnail: string | null;
  instructor: {
    name: string;
  };
}

async function fetchCourse(courseId: string): Promise<Course> {
  const response = await fetch(`/api/courses/${courseId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch course');
  }
  return response.json();
}

export function useCourse(courseId: string) {
  const { data: course, isLoading, error } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => fetchCourse(courseId),
  });

  return {
    course,
    isLoading,
    error: error instanceof Error ? error.message : null,
  };
} 