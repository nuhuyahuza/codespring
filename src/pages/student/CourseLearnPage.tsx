import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth';
import { VideoPlayer } from '@/components/VideoPlayer';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Loader2, Lock, CheckCircle, PlayCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  instructorId: string;
  createdAt: string;
  updatedAt: string;
  category: string;
  duration: number;
  imageUrl: string | null;
  level: string;
  status: string;
  User: {
    name: string;
  };
  Lesson: {
    id: string;
    title: string;
    content: string;
    videoUrl: string | null;
    order: number;
    courseId: string;
    createdAt: string;
    updatedAt: string;
    LessonProgress: {
      completed: boolean;
      timeSpent: number;
    }[];
  }[];
}

export function CourseLearnPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const fetchCourse = useCallback(async () => {
    if (!courseId || !token) throw new Error('Missing courseId or token');
    
    const response = await fetch(
      `http://localhost:5000/api/courses/${courseId}/learn`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch course');
    }

    return response.json();
  }, [courseId, token]);

  const { data: course, isLoading, error } = useQuery<Course>({
    queryKey: ['course', courseId, 'learn'],
    queryFn: fetchCourse,
    enabled: Boolean(courseId && token),
    staleTime: Infinity,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 1,
  });

  // Set initial lesson only when course first loads
  useEffect(() => {
    if (course && course?.Lesson?.length > 0 && !currentLessonId) {
      const firstIncomplete = course.Lesson.find(
        (lesson) => !lesson.LessonProgress?.[0]?.completed
      );
      setCurrentLessonId(firstIncomplete?.id || course.Lesson[0].id);
    }
  }, [course]);

  const progressMutation = useMutation({
    mutationFn: async ({
      lessonId,
      completed,
      timeSpent
    }: {
      lessonId: string;
      completed: boolean;
      timeSpent: number;
    }) => {
      if (!token) throw new Error('Not authenticated');
      
      const response = await fetch(
        `http://localhost:5000/api/lessons/${lessonId}/progress`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ completed, timeSpent }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update progress');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course', courseId, 'learn'] });
      toast.success('Progress updated successfully');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to update progress');
    },
  });

  const currentLesson = course?.Lesson?.find((lesson) => lesson.id === currentLessonId);
  const currentLessonIndex = course?.Lesson?.findIndex((lesson) => lesson.id === currentLessonId) ?? -1;
  const previousLessonsCompleted = course?.Lesson
    ?.slice(0, currentLessonIndex)
    .every((lesson) => lesson.LessonProgress?.[0]?.completed) ?? false;

  const handleLessonComplete = async () => {
    if (!currentLessonId) return;
    try {
      await progressMutation.mutateAsync({
        lessonId: currentLessonId,
        completed: true,
        timeSpent: 0, // You might want to track actual time spent
      });
    } catch (error) {
      // Error is handled by the mutation's onError callback
    }
  };

  const handleLessonSelect = (lessonId: string, index: number) => {
    if (!course?.Lesson) return;
    
    const previousLessonsCompleted = course.Lesson
      .slice(0, index)
      .every((lesson) => lesson.LessonProgress?.[0]?.completed);

    if (!previousLessonsCompleted) {
      toast.error('Please complete previous lessons first');
      return;
    }

    setCurrentLessonId(lessonId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-destructive">Course not found</h2>
          <p className="text-muted-foreground mt-2">The course you're looking for doesn't exist or you don't have access to it.</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-destructive">Course not found</h2>
          <p className="text-muted-foreground mt-2">The course you're looking for doesn't exist or you don't have access to it.</p>
        </div>
      </div>
    );
  }

  const totalLessons = course.Lesson.length;
  const completedLessons = course.Lesson.filter((lesson) => lesson.LessonProgress?.[0]?.completed).length;
  const progressPercentage = Math.round((completedLessons / totalLessons) * 100);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-80 border-r bg-muted/10 p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">{course.title}</h2>
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Course Progress</span>
            <span>{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
        <div className="space-y-2">
          {course.Lesson.map((lesson, index) => {
            const isCompleted = lesson.LessonProgress?.[0]?.completed;
            const isCurrent = lesson.id === currentLessonId;
            const isLocked = !course.Lesson
              .slice(0, index)
              .every((l) => l.LessonProgress?.[0]?.completed);

            return (
              <button
                key={lesson.id}
                onClick={() => handleLessonSelect(lesson.id, index)}
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
                  ) : (
                    <PlayCircle className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{lesson.title}</div>
                  <div className="text-xs opacity-70">Lesson {index + 1}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        {currentLesson && (
          <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">{currentLesson.title}</h3>
              <p className="text-muted-foreground">
                Lesson {currentLessonIndex + 1} of {totalLessons}
              </p>
            </div>

            {currentLesson.videoUrl && (
              <div className="mb-6">
                <VideoPlayer
                  url={currentLesson.videoUrl}
                  isFullscreen={isFullscreen}
                  onFullscreenChange={setIsFullscreen}
                />
              </div>
            )}

            <div className="prose dark:prose-invert max-w-none mb-6">
              {currentLesson.content}
            </div>

            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                disabled={currentLessonIndex === 0}
                onClick={() => {
                  const prevLesson = course.Lesson[currentLessonIndex - 1];
                  if (prevLesson) setCurrentLessonId(prevLesson.id);
                }}
              >
                Previous Lesson
              </Button>

              {currentLesson.LessonProgress?.[0]?.completed ? (
                <Button
                  disabled={currentLessonIndex === course.Lesson.length - 1}
                  onClick={() => {
                    const nextLesson = course.Lesson[currentLessonIndex + 1];
                    if (nextLesson) setCurrentLessonId(nextLesson.id);
                  }}
                >
                  Next Lesson
                </Button>
              ) : (
                <Button
                  onClick={handleLessonComplete}
                  disabled={!previousLessonsCompleted || progressMutation.isPending}
                >
                  {progressMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Complete Lesson'
                  )}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}