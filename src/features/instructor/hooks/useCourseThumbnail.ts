import { useState } from 'react';
import { api } from '@/lib/api';

export function useCourseThumbnail(courseId?: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadThumbnail = async (file: File): Promise<string> => {
    if (!courseId) {
      throw new Error('Course ID is required to upload thumbnail');
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('thumbnail', file);

      await api.post(
        `/courses/${courseId}/thumbnail`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Return the URL based on courseId and file extension
      const extension = file.name.split('.').pop();
      return `/uploads/course-thumbnails/${courseId}.${extension}`;
    } catch (err) {
      console.error('Error uploading thumbnail:', err);
      setError('Failed to upload thumbnail. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    uploadThumbnail,
    isLoading,
    error,
  };
} 