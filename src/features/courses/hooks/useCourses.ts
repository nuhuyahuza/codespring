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

async function fetchCourses(): Promise<Course[]> {
  const response = await fetch('/api/courses');
  if (!response.ok) {
    throw new Error('Failed to fetch courses');
  }
  return response.json();
}

export function useCourses() {
  const { data: courses, isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
  });

  return {
    courses,
    isLoading,
    error: error instanceof Error ? error.message : null,
  };
} 