import { CheckCircle, Circle, PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Lesson {
  id: string;
  title: string;
  order: number;
  videoUrl: string | null;
}

interface Progress {
  completedLessons: string[];
  currentLesson: string | null;
}

interface LessonListProps {
  lessons: Lesson[];
  currentLessonId: string | null;
  onLessonSelect: (lessonId: string) => void;
  progress: Progress;
}

export function LessonList({
  lessons,
  currentLessonId,
  onLessonSelect,
  progress,
}: LessonListProps) {
  return (
    <div className="space-y-1">
      <h3 className="font-medium mb-2">Course Content</h3>
      <div className="space-y-1">
        {lessons.map((lesson) => {
          const isCompleted = progress?.completedLessons.includes(lesson.id);
          const isCurrent = lesson.id === currentLessonId;

          return (
            <button
              key={lesson.id}
              onClick={() => onLessonSelect(lesson.id)}
              className={cn(
                'flex items-center w-full p-3 text-sm rounded-lg transition-colors',
                'hover:bg-muted/50',
                isCurrent && 'bg-muted',
                'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
              )}
            >
              <div className="flex items-center flex-1">
                <div className="mr-2">
                  {isCompleted ? (
                    <CheckCircle className="h-4 w-4 text-primary" />
                  ) : isCurrent ? (
                    <PlayCircle className="h-4 w-4 text-primary" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex flex-col items-start">
                  <span className={cn(
                    'text-sm font-medium',
                    isCompleted && 'text-muted-foreground'
                  )}>
                    {lesson.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {lesson.videoUrl ? 'Video Lesson' : 'Text Lesson'}
                  </span>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">
                {String(lesson.order).padStart(2, '0')}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
} 