import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFileUpload } from '@/hooks/useFileUpload';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VideoPlayer } from '../VideoPlayer';

interface VideoUploadProps {
  onVideoAdded: (videoData: {
    url: string;
    duration: number;
    thumbnail?: string;
    provider: 'LOCAL' | 'YOUTUBE';
  }) => void;
}

export function VideoUpload({ onVideoAdded }: VideoUploadProps) {
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const { upload, isUploading, progress } = useFileUpload({
    endpoint: `${import.meta.env.VITE_API_URL}/video/upload`,
    allowedTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
    maxSize: 500 * 1024 * 1024,
    onSuccess: (url) => {
      onVideoAdded({
        url,
        duration: 0,
        provider: 'LOCAL',
      });
      setPreview(url);
    },
    onError: (err) => setError(err.message),
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);
      const file = acceptedFiles[0];
      if (file) {
        upload(file);
      }
    },
    [upload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/mp4': ['.mp4'],
      'video/webm': ['.webm'],
      'video/quicktime': ['.mov'],
    },
    maxSize: 500 * 1024 * 1024,
    multiple: false,
  });

  const handleYouTubeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/video/youtube`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: videoUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to process YouTube URL');
      }

      const data = await response.json();
      onVideoAdded({
        url: videoUrl,
        duration: data.duration,
        thumbnail: data.thumbnail,
        provider: 'YOUTUBE',
      });
      setPreview(videoUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process YouTube URL');
    }
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="upload">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload Video</TabsTrigger>
          <TabsTrigger value="youtube">YouTube URL</TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-primary bg-primary/10' : 'border-border'}`}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <div className="text-sm">
                {isDragActive ? (
                  <p>Drop the video here</p>
                ) : (
                  <p>
                    Drag and drop a video file here, or click to select
                    <br />
                    <span className="text-xs text-muted-foreground">
                      Supported formats: MP4, WebM, MOV (max 500MB)
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="youtube">
          <form onSubmit={handleYouTubeSubmit} className="space-y-4">
            <Input
              type="url"
              placeholder="Enter YouTube URL"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
            <Button type="submit" disabled={!videoUrl}>
              Add YouTube Video
            </Button>
          </form>
        </TabsContent>
      </Tabs>

      {isUploading && (
        <div className="space-y-2">
          <Progress value={progress} />
          <p className="text-sm text-muted-foreground">Uploading: {progress}%</p>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {preview && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Preview:</h3>
          <VideoPlayer url={preview} isFullscreen={false} onFullscreenChange={() => {}} />
        </div>
      )}
    </div>
  );
} 