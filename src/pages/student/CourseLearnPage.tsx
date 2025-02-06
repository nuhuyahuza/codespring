import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth';
import { Button } from '@/components/ui/button';
import { 
  Loader2, Menu, ChevronLeft,
  Home, BookOpen, Users, Award, Settings, LogOut, Code2, CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CourseSidebar } from '@/components/course/CourseSidebar';
import { ReadingLesson } from '@/components/course/ReadingLesson';
import { VideoLesson } from '@/components/course/VideoLesson';
import { CodeEditor } from '@/components/course/CodeEditor';

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
  instructor: {
    name: string;
  };
  lessons: {
    id: string;
    title: string;
    content: string;
    videoUrl: string | null;
    order: number;
    courseId: string;
    createdAt: string;
    duration: number | null;
    updatedAt: string;
    progress: {
      completed: boolean;
      timeSpent: number;
    }[];
    type: 'video' | 'reading';
  }[];
  type: 'programming' | 'general';
  programmingLanguage?: string;
}

export function CourseLearnPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [showCodeEditor, setShowCodeEditor] = useState(false);

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

    const data = await response.json();
    console.log('API Response:', data); // Add debug log
    return data;
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
    if (course?.lessons?.length && !currentLessonId) {
      const firstIncomplete = course.lessons.find(
        (lesson) => !lesson.progress?.[0]?.completed
      );
      console.log('First incomplete lesson:', firstIncomplete); // Add debug log
      console.log('Course Lesson:', course.lessons); // Add debug log
      setCurrentLessonId(firstIncomplete?.id || course.lessons[0].id);
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
      if (!token || !courseId) throw new Error('Not authenticated or missing courseId');
      
      try {
        const response = await fetch(
          `http://localhost:5000/api/courses/${courseId}/lessons/${lessonId}/progress`,
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

        const data = await response.json();
        console.log('Progress response:', data);
        return data;
      } catch (error) {
        console.error('Progress mutation error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course', courseId, 'learn'] });
      toast.success('Progress updated successfully');
    },
    onError: (error) => {
      console.error('Progress mutation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update progress');
    },
  });

  const currentLesson = course?.lessons?.find((lesson) => lesson.id === currentLessonId);
  console.log('Current Lesson:', currentLesson); // Add debug log
  const currentLessonIndex = course?.lessons?.findIndex((lesson) => lesson.id === currentLessonId) ?? -1;
  const previousLessonsCompleted = course?.lessons
    ?.slice(0, currentLessonIndex)
    .every((lesson) => lesson.progress?.[0]?.completed) ?? false;

  const handleLessonComplete = async () => {
    if (!currentLessonId || !course) return;
    
    try {
      await progressMutation.mutateAsync({
        lessonId: currentLessonId,
        completed: true,
        timeSpent: 0,
      });

      // Automatically move to next lesson after completion
      const currentIndex = course.lessons.findIndex(l => l.id === currentLessonId);
      if (currentIndex < course.lessons.length - 1) {
        setCurrentLessonId(course.lessons[currentIndex + 1].id);
      }
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleLessonSelect = (lessonId: string, index: number) => {
    if (!course?.lessons) return;
    
    // Allow selecting completed lessons or the next available lesson
    const isCompleted = course.lessons[index].progress?.[0]?.completed;
    const previousLessonsCompleted = course.lessons
      .slice(0, index)
      .every(lesson => lesson.progress?.[0]?.completed);

    if (!isCompleted && !previousLessonsCompleted) {
      toast.error('Please complete previous lessons first');
      return;
    }

    setCurrentLessonId(lessonId);
    setIsSidebarOpen(false); // Close sidebar on mobile
  };

  // Update the lesson navigation buttons
  const handlePreviousLesson = () => {
    if (!course || currentLessonIndex <= 0) return;
    setCurrentLessonId(course.lessons[currentLessonIndex - 1].id);
  };

  const handleNextLesson = () => {
    if (!course || currentLessonIndex >= course.lessons.length - 1) return;
    setCurrentLessonId(course.lessons[currentLessonIndex + 1].id);
  };

  // Add click outside handler
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
  }, [isSidebarOpen]);

  // Render lesson content based on type
  const renderLessonContent = (lesson: Course['lessons'][0]) => {
    if (lesson.type === 'video' && lesson.videoUrl) {
      return (
        <VideoLesson
          title={lesson.title}
          content={lesson.content}
          lessonNumber={currentLessonIndex + 1}
          totalLessons={course?.lessons?.length || 0}
          videoUrl={lesson.videoUrl}
          isFullscreen={isFullscreen}
          onFullscreenChange={setIsFullscreen}
        />
      );
    } else {
      return (
        <ReadingLesson 
          title={lesson.title}
          content={lesson.content}
          estimatedTime={lesson.duration || 5}
          objectives={[
            "Understand the core concepts covered in this lesson",
            "Apply the knowledge through practical examples",
            "Master the techniques discussed"
          ]}
        />
      );
    }
  };

  const isProgrammingCourse = (course: Course) => {
    return course.type === 'programming' || 
           course.category.toLowerCase().includes('programming') ||
           course.category.toLowerCase().includes('development');
  };

  const isCourseCompleted = (course: Course) => {
    return course.lessons.every(lesson => lesson.progress?.[0]?.completed);
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

  const totalLessons = course.lessons?.length ?? 0;
  const completedLessons = course.lessons?.filter((lesson) => lesson.progress?.[0]?.completed).length ?? 0;
  const progressPercentage = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;
  console.log('Course:', course); // Add debug log
  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen overflow-hidden">
        {/* Main Sidebar - Always visible */}
        <div className="hidden md:flex w-20 flex-col fixed inset-y-0 z-50 bg-muted/50 border-r">
          <div className="flex-1 flex flex-col items-center gap-4 p-4">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
              CS
            </div>
            <TooltipProvider delayDuration={0}>
              <nav className="flex-1 flex flex-col items-center gap-4 pt-8">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => navigate('/student/dashboard')}>
                      <Home className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    Dashboard
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => navigate('/student/courses')}>
                      <BookOpen className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    My Courses
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => navigate('/student/community')}>
                      <Users className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    Community
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => navigate('/student/certificates')}>
                      <Award className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    Certificates
                  </TooltipContent>
                </Tooltip>
              </nav>

              <div className="mt-auto flex flex-col gap-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Settings className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    Settings
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <LogOut className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    Sign Out
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 md:ml-20">
          {/* Mobile Header */}
          <div className="md:hidden flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/courses')}
                className="mr-2"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-lg font-semibold truncate">{course.title}</h1>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          {/* Course Content Layout */}
          <div className="flex h-[calc(100vh-4rem)] md:h-screen">
            <CourseSidebar
              course={course}
              currentLessonId={currentLessonId || ''}
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
              onLessonSelect={handleLessonSelect}
              progressPercentage={progressPercentage}
            />

            {/* Main Content Area - Updated */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto">
                {currentLesson && (
                  <div className="h-full flex flex-col">
                    <div className="flex-1 p-4">
                      {renderLessonContent(currentLesson)}

                      {isProgrammingCourse(course) && (
                        <div className="mt-6 border-t pt-6">
                          <Button
                            variant="outline"
                            onClick={() => setShowCodeEditor(!showCodeEditor)}
                          >
                            <Code2 className="mr-2 h-4 w-4" />
                            {showCodeEditor ? 'Hide Code Editor' : 'Show Code Editor'}
                          </Button>
                          
                          {showCodeEditor && (
                            <div className="mt-4">
                              <CodeEditor
                                defaultLanguage={course.programmingLanguage || 'javascript'}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Navigation buttons - Simplified */}
                    <div className="flex-shrink-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
                      <div className="flex flex-col md:flex-row gap-4 md:justify-between">
                        <Button
                          variant="outline"
                          className="w-full md:w-auto"
                          disabled={currentLessonIndex === 0}
                          onClick={handlePreviousLesson}
                        >
                          Previous Lesson
                        </Button>

                        {isCourseCompleted(course) ? (
                          <Button
                            variant="secondary"
                            className="w-full md:w-auto"
                            disabled
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Course Completed
                          </Button>
                        ) : currentLesson?.progress?.[0]?.completed ? (
                          <Button
                            className="w-full md:w-auto"
                            disabled={currentLessonIndex === course.lessons?.length - 1}
                            onClick={handleNextLesson}
                          >
                            Next Lesson
                          </Button>
                        ) : (
                          <Button
                            className="w-full md:w-auto"
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
                  </div>
                )}
              </div>

              {/* Footer - Simplified */}
              <footer className="flex-shrink-0 border-t py-3 px-4 text-center text-sm text-muted-foreground">
                <p>© {new Date().getFullYear()} CodeSpring. All rights reserved.</p>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}