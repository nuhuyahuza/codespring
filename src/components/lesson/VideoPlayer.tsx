import { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { extractVideoId } from '../../../server/src/utils/youtube';

interface VideoPlayerProps {
  url: string;
  onProgress?: (progress: number) => void;
  onDuration?: (duration: number) => void;
  autoPlay?: boolean;
  controls?: boolean;
}

export function VideoPlayer({
  url,
  onProgress,
  onDuration,
  autoPlay = false,
  controls = true,
}: VideoPlayerProps) {
  const [isYouTube, setIsYouTube] = useState(false);

  useEffect(() => {
    setIsYouTube(!!extractVideoId(url));
  }, [url]);

  const handleProgress = (state: { played: number }) => {
    onProgress?.(state.played * 100);
  };

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
      <ReactPlayer
        url={url}
        width="100%"
        height="100%"
        controls={controls}
        playing={autoPlay}
        onProgress={handleProgress}
        onDuration={onDuration}
        config={{
          youtube: {
            playerVars: {
              modestbranding: 1,
              rel: 0,
            },
          },
          file: {
            attributes: {
              controlsList: 'nodownload',
            },
          },
        }}
      />
    </div>
  );
} 