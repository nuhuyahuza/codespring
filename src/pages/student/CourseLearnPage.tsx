import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth';
import { VideoPlayer } from '@/components/VideoPlayer';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Loader2, Lock, CheckCircle, PlayCircle, X, Menu, ChevronLeft,
  Home, BookOpen, Users, Award, Settings, LogOut
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  }[];
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
      {/* Student Dashboard Layout */}
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
            {/* Course Sidebar */}
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
                  {/* Mobile Close Button */}
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

                  {/* Desktop Title */}
                  <h2 className="text-2xl font-bold mb-4 hidden md:block">{course.title}</h2>
                  
                  {/* Rest of sidebar content */}
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
                            handleLessonSelect(lesson.id, index);
                            setIsSidebarOpen(false); // Close sidebar on mobile after selection
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
              </div>
            </div>

            {/* Main Content Area - Updated layout */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto">
                <div className="container max-w-4xl mx-auto px-4 py-6">
                  {currentLesson && (
                    <div className="p-4 md:p-6 max-w-4xl mx-auto">
                      <div className="mb-4 md:mb-6">
                        <h3 className="text-xl md:text-2xl font-bold mb-2">{currentLesson.title}</h3>
                        <p className="text-muted-foreground">
                          Lesson {currentLessonIndex + 1} of {totalLessons}
                        </p>
                      </div>

                      {currentLesson.videoUrl && (
                        <div className="mb-4 md:mb-6">
                          <div className="relative aspect-video">
                            <VideoPlayer
                              url={currentLesson.videoUrl}
                              isFullscreen={isFullscreen}
                              onFullscreenChange={setIsFullscreen}
                            />
                          </div>
                        </div>
                      )}

                      <div className="prose dark:prose-invert max-w-none mb-6 text-sm md:text-base">
                        {currentLesson.content}
                      </div>

                      <div className="flex flex-col md:flex-row gap-4 md:gap-0 md:justify-between items-stretch md:items-center">
                        <Button
                          variant="outline"
                          className="w-full md:w-auto"
                          disabled={currentLessonIndex === 0}
                          onClick={handlePreviousLesson}
                        >
                          Previous Lesson
                        </Button>

                        {currentLesson?.progress?.[0]?.completed ? (
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
                  )}
                </div>
              </div>

              {/* Updated Footer */}
              <footer className="flex-shrink-0 border-t py-2 px-6 text-center text-xs text-muted-foreground bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <p>© {new Date().getFullYear()} CodeSpring. All rights reserved.</p>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}