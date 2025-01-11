import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCourseContent } from '@/features/courses/hooks/useCourseContent';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { VideoPlayer } from '@/features/courses/components/VideoPlayer';
import { LessonList } from '@/features/courses/components/LessonList';
import { CourseProgress } from '@/features/courses/components/CourseProgress';
import { Button } from '@/components/ui/button';
import { Loader2, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function CourseContentPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const { course, lessons = [], currentLesson, progress, isLoading, error } = useCourseContent(
    courseId!,
    currentLessonId
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl font-semibold text-destructive">Error loading course</h2>
        <p className="text-muted-foreground">{error instanceof Error ? error.message : 'Course not found'}</p>
      </div>
    );
  }

  const defaultProgress = {
    completedLessons: [] as string[],
    currentLesson: currentLessonId,
    totalProgress: 0,
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-4">
          {/* Sidebar */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1 bg-card rounded-lg shadow-lg p-6"
          >
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  {course.title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  by {course.instructor.name}
                </p>
              </div>
              
              <CourseProgress progress={progress || defaultProgress} />

              <LessonList
                lessons={lessons}
                currentLessonId={currentLessonId}
                onLessonSelect={setCurrentLessonId}
                progress={progress || defaultProgress}
              />
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-3 bg-card rounded-lg shadow-lg p-6"
          >
            {currentLesson ? (
              <motion.div
                key={currentLesson.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    {currentLesson.title}
                  </h1>
                  <p className="text-muted-foreground">
                    Lesson {currentLesson.order} of {lessons.length}
                  </p>
                </div>

                {currentLesson.videoUrl && (
                  <div className="rounded-lg overflow-hidden ring-1 ring-primary/10 shadow-lg">
                    <VideoPlayer
                      url={currentLesson.videoUrl}
                      onComplete={() => {
                        // Handle lesson completion
                      }}
                    />
                  </div>
                )}

                <div className="prose max-w-none">
                  {currentLesson.content}
                </div>

                <div className="flex justify-between pt-4 border-t">
                  <Button
                    variant="outline"
                    disabled={!lessons[currentLesson.order - 2]}
                    onClick={() => {
                      const prevLesson = lessons[currentLesson.order - 2];
                      if (prevLesson) {
                        setCurrentLessonId(prevLesson.id);
                      }
                    }}
                    className="transition-transform hover:-translate-x-1"
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
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
                    className="transition-transform hover:translate-x-1"
                  >
                    Next Lesson
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center h-[60vh] text-center"
              >
                <BookOpen className="h-16 w-16 text-primary mb-4 animate-pulse" />
                <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Welcome to {course.title}
                </h2>
                <p className="text-muted-foreground mb-6">
                  Select a lesson from the sidebar to begin learning
                </p>
                {lessons[0] && (
                  <Button
                    onClick={() => setCurrentLessonId(lessons[0].id)}
                    className="animate-bounce"
                    size="lg"
                  >
                    Start First Lesson
                  </Button>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 