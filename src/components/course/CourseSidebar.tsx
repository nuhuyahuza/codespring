import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Lock, PlayCircle, X, BookOpen } from "lucide-react";
import { useRef, useEffect } from 'react';

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'reading';
  content: string;
  videoUrl: string | null;
  order: number;
  duration: number | null;
  progress?: {
    completed: boolean;
    timeSpent: number;
  }[];
}

interface CourseSidebarProps {
  course: {
    title: string;
    lessons: Lesson[];
  };
  currentLessonId: string;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  onLessonSelect: (lessonId: string, index: number) => void;
  progressPercentage: number;
}

export function CourseSidebar({
  course,
  currentLessonId,
  isSidebarOpen,
  setIsSidebarOpen,
  onLessonSelect,
  progressPercentage,
}: CourseSidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsSidebarOpen(false);
      }
    }

    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen, setIsSidebarOpen]);

  return (
    <div>
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <div
        ref={sidebarRef}
        className={`
          fixed md:sticky top-0 h-full z-50 w-full md:w-80
          transform transition-transform duration-200 ease-in-out
          bg-background border-r overflow-y-auto
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="p-6">
          <div className="flex justify-between items-center md:hidden mb-4">
            <h2 className="text-xl font-bold">Course Content</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(false)}
              className="hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <h2 className="text-2xl font-bold mb-4 hidden md:block">{course.title}</h2>
          
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Course Progress</span>
              <span>{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <div className="space-y-2">
            {course.lessons?.map((lesson, index) => {
              const isCompleted = lesson.progress?.[0]?.completed;
              const isCurrent = lesson.id === currentLessonId;
              const isLocked = !course.lessons
                .slice(0, index)
                .every((l) => l.progress?.[0]?.completed);

              return (
                <button
                  key={lesson.id}
                  onClick={() => {
                    onLessonSelect(lesson.id, index);
                    setIsSidebarOpen(false);
                  }}
                  disabled={isLocked && !isCompleted}
                  className={`w-full p-3 rounded-lg text-left flex items-center gap-3 transition-colors ${
                    isCurrent
                      ? 'bg-primary text-primary-foreground'
                      : isCompleted
                      ? 'bg-muted/50 hover:bg-muted'
                      : isLocked
                      ? 'bg-muted/30 cursor-not-allowed opacity-50'
                      : 'hover:bg-muted/50'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : isLocked ? (
                      <Lock className="h-5 w-5" />
                    ) : lesson.type === 'reading' ? (
                      <BookOpen className="h-5 w-5" />
                    ) : (
                      <PlayCircle className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{lesson.title}</div>
                    <div className="text-xs opacity-70">
                      Lesson {index + 1} • {lesson.type === 'reading' ? 'Reading' : 'Video'}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 