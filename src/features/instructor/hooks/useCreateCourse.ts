import { useState } from 'react';
import { api } from '@/lib/api';

interface CourseFormData {
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  price: number;
  duration: number;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
}

export function useCreateCourse() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCourse = async (data: CourseFormData): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post<{ id: string }>('/api/instructor/courses', data);
      return response.data.id;
    } catch (err) {
      console.error('Error creating course:', err);
      setError('Failed to create course. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createCourse,
    isLoading,
    error,
  };
} 