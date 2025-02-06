import { VideoPlayer } from "@/components/VideoPlayer";
import { Card } from "@/components/ui/card";

interface VideoLessonProps {
  title: string;
  videoUrl: string;
  content: string;
  lessonNumber: number;
  totalLessons: number;
  isFullscreen: boolean;
  onFullscreenChange: (isFullscreen: boolean) => void;
}

export function VideoLesson({
  title,
  videoUrl,
  content,
  lessonNumber,
  totalLessons,
  isFullscreen,
  onFullscreenChange,
}: VideoLessonProps) {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground">
          Lesson {lessonNumber} of {totalLessons}
        </p>
      </div>

      <div className="mb-6">
        <div className="relative aspect-video rounded-lg overflow-hidden">
          <VideoPlayer
            url={videoUrl}
            isFullscreen={isFullscreen}
            onFullscreenChange={onFullscreenChange}
          />
        </div>
      </div>

      <div className="prose dark:prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </Card>
  );
} 