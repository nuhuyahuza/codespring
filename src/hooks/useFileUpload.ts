import { useState } from 'react';

interface UploadOptions {
  endpoint: string;
  onProgress?: (progress: number) => void;
  onSuccess?: (url: string) => void;
  onError?: (error: Error) => void;
  allowedTypes?: string[];
  maxSize?: number; // in bytes
}

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: Error | null;
}

export function useFileUpload(options: UploadOptions) {
  const [state, setState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
  });

  const validateFile = (file: File): Error | null => {
    if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
      return new Error(`File type ${file.type} is not allowed`);
    }

    if (options.maxSize && file.size > options.maxSize) {
      return new Error(`File size exceeds ${options.maxSize} bytes`);
    }

    return null;
  };

  const upload = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setState({ ...state, error: validationError });
      options.onError?.(validationError);
      return;
    }

    setState({ isUploading: true, progress: 0, error: null });

    const formData = new FormData();
    formData.append('file', file);

    try {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded * 100) / event.total);
          setState((prev) => ({ ...prev, progress }));
          options.onProgress?.(progress);
        }
      });

      const response = await new Promise<string>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            resolve(response.url);
          } else {
            reject(new Error('Upload failed'));
          }
        };

        xhr.onerror = () => reject(new Error('Upload failed'));
        xhr.open('POST', options.endpoint);
        xhr.send(formData);
      });

      setState({ isUploading: false, progress: 100, error: null });
      options.onSuccess?.(response);
      return response;
    } catch (error) {
      const uploadError = error instanceof Error ? error : new Error('Upload failed');
      setState({ isUploading: false, progress: 0, error: uploadError });
      options.onError?.(uploadError);
      throw uploadError;
    }
  };

  return {
    upload,
    ...state,
  };
} 