import { useMemo } from 'react';
import { Course } from '@/types';

export function useFilteredCourses(
  courses: Course[] | undefined,
  status: string | null,
  searchQuery: string
) {
  return useMemo(() => {
    if (!courses) return [];

    let filtered = courses;

    // Filter by status
    if (status) {
      filtered = filtered.filter(course => course.status === status);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(query) ||
        course.instructor.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [courses, status, searchQuery]);
} 