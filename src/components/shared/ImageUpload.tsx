import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { useUploadImage } from '@/features/shared/hooks/useUploadImage';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  maxSize?: number; // in MB
  aspectRatio?: number;
}

export function ImageUpload({
  value,
  onChange,
  maxSize = 5,
  aspectRatio,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, isLoading, error } = useUploadImage();

  const handleFileSelect = async (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`);
      return;
    }

    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch (err) {
      console.error('Failed to upload image:', err);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      await handleFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFileSelect(file);
    }
  };

  return (
    <div className="space-y-4">
      <Input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {value ? (
        <div className="relative group">
          <img
            src={value}
            alt="Uploaded image"
            className={`w-full rounded-lg object-cover ${
              aspectRatio ? `aspect-[${aspectRatio}]` : 'aspect-video'
            }`}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="secondary" onClick={handleClick}>
              Change Image
            </Button>
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging ? 'border-primary bg-primary/10' : 'border-muted'
          } transition-colors`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          {isLoading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin">⌛</div>
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              {isDragging ? (
                <ImageIcon className="h-8 w-8 text-primary" />
              ) : (
                <Upload className="h-8 w-8 text-muted-foreground" />
              )}
              <p className="text-sm text-muted-foreground">
                Drag and drop an image, or click to select
              </p>
              <p className="text-xs text-muted-foreground">
                Maximum file size: {maxSize}MB
              </p>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
} 