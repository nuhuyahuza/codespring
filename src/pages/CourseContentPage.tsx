import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCourseContent } from '@/features/courses/hooks/useCourseContent';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { VideoPlayer } from '@/features/courses/components/VideoPlayer';
import { LessonList } from '@/features/courses/components/LessonList';
import { CourseProgress } from '@/features/courses/components/CourseProgress';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export function CourseContentPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const { course, lessons, currentLesson, progress, isLoading, error } = useCourseContent(
    courseId!,
    currentLessonId
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl font-semibold text-destructive">Error loading course</h2>
        <p className="text-muted-foreground">{error || 'Course not found'}</p>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 border-r p-4">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold">{course.title}</h2>
                <p className="text-sm text-muted-foreground">
                  by {course.instructor.name}
                </p>
              </div>
              
              <CourseProgress progress={progress} />

              <LessonList
                lessons={lessons}
                currentLessonId={currentLessonId}
                onLessonSelect={setCurrentLessonId}
                progress={progress}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 p-4">
            {currentLesson ? (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold">{currentLesson.title}</h1>
                  <p className="text-muted-foreground">
                    Lesson {currentLesson.order} of {lessons.length}
                  </p>
                </div>

                {currentLesson.videoUrl && (
                  <VideoPlayer
                    url={currentLesson.videoUrl}
                    onComplete={() => {
                      // Handle lesson completion
                    }}
                  />
                )}

                <div className="prose max-w-none">
                  {currentLesson.content}
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    disabled={!lessons[currentLesson.order - 2]}
                    onClick={() => {
                      const prevLesson = lessons[currentLesson.order - 2];
                      if (prevLesson) {
                        setCurrentLessonId(prevLesson.id);
                      }
                    }}
                  >
                    Previous Lesson
                  </Button>
                  <Button
                    disabled={!lessons[currentLesson.order]}
                    onClick={() => {
                      const nextLesson = lessons[currentLesson.order];
                      if (nextLesson) {
                        setCurrentLessonId(nextLesson.id);
                      }
                    }}
                  >
                    Next Lesson
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <h2 className="text-xl font-semibold">Welcome to {course.title}</h2>
                <p className="text-muted-foreground mb-4">
                  Select a lesson from the sidebar to begin learning
                </p>
                {lessons[0] && (
                  <Button onClick={() => setCurrentLessonId(lessons[0].id)}>
                    Start First Lesson
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 