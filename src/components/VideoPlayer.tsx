import { useRef, useEffect } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoPlayerProps {
  url: string;
  isFullscreen: boolean;
  onFullscreenChange: (isFullscreen: boolean) => void;
}

export function VideoPlayer({ url, isFullscreen, onFullscreenChange }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      onFullscreenChange(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [onFullscreenChange]);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative bg-black ${
        isFullscreen ? 'fixed inset-0 z-50' : 'aspect-video rounded-lg overflow-hidden'
      }`}
    >
      <video
        ref={videoRef}
        src={url}
        controls
        className="w-full h-full"
        controlsList="nodownload"
      />
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white"
        onClick={toggleFullscreen}
      >
        {isFullscreen ? (
          <Minimize2 className="h-4 w-4" />
        ) : (
          <Maximize2 className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
} 