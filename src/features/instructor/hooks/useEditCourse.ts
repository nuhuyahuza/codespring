import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface Section {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  type: 'VIDEO' | 'QUIZ' | 'ASSIGNMENT';
  content: string;
  duration: number;
  order: number;
}

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  price: number;
  duration: number;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  sections: Section[];
  updatedAt: string;
}

export function useEditCourse(courseId: string) {
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const response = await api.get<Course>(`/api/instructor/courses/${courseId}`);
      setCourse(response);
      setError(null);
    } catch (err) {
      console.error('Error fetching course:', err);
      setError('Failed to load course');
    } finally {
      setIsLoading(false);
    }
  };

  const updateCourse = async (data: Partial<Course>) => {
    try {
      const response = await api.put<Course>(
        `/api/instructor/courses/${courseId}`,
        data
      );
      setCourse(response);
      setError(null);
    } catch (err) {
      console.error('Error updating course:', err);
      setError('Failed to update course');
      throw err;
    }
  };

  const addSection = async (title: string) => {
    try {
      const response = await api.post<Section>(
        `/api/instructor/courses/${courseId}/sections`,
        {
          title,
          order: course?.sections.length ?? 0,
        }
      );
      setCourse((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          sections: [...prev.sections, response],
        };
      });
      setError(null);
    } catch (err) {
      console.error('Error adding section:', err);
      setError('Failed to add section');
      throw err;
    }
  };

  const updateSection = async (sectionId: string, data: Partial<Section>) => {
    try {
      const response = await api.put<Section>(
        `/api/instructor/courses/${courseId}/sections/${sectionId}`,
        data
      );
      setCourse((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          sections: prev.sections.map((section) =>
            section.id === sectionId ? response : section
          ),
        };
      });
      setError(null);
    } catch (err) {
      console.error('Error updating section:', err);
      setError('Failed to update section');
      throw err;
    }
  };

  const deleteSection = async (sectionId: string) => {
    try {
      await api.delete(`/api/instructor/courses/${courseId}/sections/${sectionId}`);
      setCourse((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          sections: prev.sections.filter((section) => section.id !== sectionId),
        };
      });
      setError(null);
    } catch (err) {
      console.error('Error deleting section:', err);
      setError('Failed to delete section');
      throw err;
    }
  };

  const addLesson = async (sectionId: string, data: Partial<Lesson>) => {
    try {
      const response = await api.post<Lesson>(
        `/api/instructor/courses/${courseId}/sections/${sectionId}/lessons`,
        {
          ...data,
          order:
            course?.sections.find((s) => s.id === sectionId)?.lessons.length ?? 0,
        }
      );
      setCourse((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          sections: prev.sections.map((section) =>
            section.id === sectionId
              ? {
                  ...section,
                  lessons: [...section.lessons, response],
                }
              : section
          ),
        };
      });
      setError(null);
    } catch (err) {
      console.error('Error adding lesson:', err);
      setError('Failed to add lesson');
      throw err;
    }
  };

  const updateLesson = async (
    sectionId: string,
    lessonId: string,
    data: Partial<Lesson>
  ) => {
    try {
      const response = await api.put<Lesson>(
        `/api/instructor/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`,
        data
      );
      setCourse((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          sections: prev.sections.map((section) =>
            section.id === sectionId
              ? {
                  ...section,
                  lessons: section.lessons.map((lesson) =>
                    lesson.id === lessonId ? response : lesson
                  ),
                }
              : section
          ),
        };
      });
      setError(null);
    } catch (err) {
      console.error('Error updating lesson:', err);
      setError('Failed to update lesson');
      throw err;
    }
  };

  const deleteLesson = async (sectionId: string, lessonId: string) => {
    try {
      await api.delete(
        `/api/instructor/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`
      );
      setCourse((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          sections: prev.sections.map((section) =>
            section.id === sectionId
              ? {
                  ...section,
                  lessons: section.lessons.filter(
                    (lesson) => lesson.id !== lessonId
                  ),
                }
              : section
          ),
        };
      });
      setError(null);
    } catch (err) {
      console.error('Error deleting lesson:', err);
      setError('Failed to delete lesson');
      throw err;
    }
  };

  const publishCourse = async () => {
    try {
      const response = await api.post<Course>(
        `/api/instructor/courses/${courseId}/publish`
      );
      setCourse(response);
      setError(null);
    } catch (err) {
      console.error('Error publishing course:', err);
      setError('Failed to publish course');
      throw err;
    }
  };

  return {
    course,
    isLoading,
    error,
    updateCourse,
    addSection,
    updateSection,
    deleteSection,
    addLesson,
    updateLesson,
    deleteLesson,
    publishCourse,
  };
} 