    // Start of Selection
    import { useState } from 'react';
    import { api } from '@/lib/api';
    
    export function useUploadImage() {
      const [isLoading, setIsLoading] = useState(false);
      const [error, setError] = useState<string | null>(null);
    
      const uploadImage = async (file: File): Promise<string> => {
        setIsLoading(true);
        setError(null);
    
        try {
          const formData = new FormData();
          formData.append('image', file);
    
          const response = await api.post<{ url: string }>(
            '/api/upload/image',
            formData
          );
    
          return response.url;
        } catch (err) {
          console.error('Error uploading image:', err);
          setError('Failed to upload image. Please try again.');
          throw err;
        } finally {
          setIsLoading(false);
        }
      };
    
      return {
        uploadImage,
        isLoading,
        error,
      };
    } 