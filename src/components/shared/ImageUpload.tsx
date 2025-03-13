import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (file: File) => void;
  maxSize?: number; // in MB
  aspectRatio?: number;
  accept?: string; // Allow custom accept types
}

export function ImageUpload({
  value,
  onChange,
  maxSize = 5,
  aspectRatio,
  accept = "image/*"
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string>(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Update preview when value changes from parent
    setPreview(value);
  }, [value]);

  const handleFileSelect = async (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    setError(null);
    
    // Create a preview URL for the selected file
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    
    // Clean up the object URL when we create a new one
    return () => URL.revokeObjectURL(objectUrl);
    
    onChange(file);
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
    if (file) {
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
        accept={accept}
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {(preview || value) ? (
        <div className="relative group w-full h-[225px] bg-muted rounded-lg overflow-hidden">
          <img
            src={preview || value}
            alt="Selected image"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="secondary" onClick={handleClick}>
              Change Image
            </Button>
          </div>
        </div>
      ) : (
        <div
          className={`w-full h-[225px] border-2 border-dashed rounded-lg p-8 text-center flex items-center justify-center ${
            isDragging ? 'border-primary bg-primary/10' : 'border-muted'
          } transition-colors cursor-pointer`}
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