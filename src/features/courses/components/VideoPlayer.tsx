import { useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';

interface VideoPlayerProps {
  url: string;
  onComplete?: () => void;
}

export function VideoPlayer({ url, onComplete }: VideoPlayerProps) {
  const playerRef = useRef<ReactPlayer>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    progressRef.current = 0;
  }, [url]);

  const handleProgress = ({ played }: { played: number }) => {
    progressRef.current = played;
  };

  const handleEnded = () => {
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="relative aspect-video w-full">
      <ReactPlayer
        ref={playerRef}
        url={url}
        width="100%"
        height="100%"
        controls
        playing={false}
        onProgress={handleProgress}
        onEnded={handleEnded}
        config={{
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