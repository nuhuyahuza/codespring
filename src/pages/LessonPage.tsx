import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLesson } from '@/features/courses/hooks/useLesson';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { VideoPlayer } from '@/features/courses/components/VideoPlayer';
import { AssignmentSubmission } from '@/features/courses/components/AssignmentSubmission';
import { LessonSubmissions } from '@/features/courses/components/LessonSubmissions';
import { useSubmitAssignment } from '@/features/courses/hooks/useSubmissions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { user } = useAuth();
  const { data: lesson, isLoading } = useLesson(lessonId!);
  const { mutateAsync: submitAssignment } = useSubmitAssignment();
  const [activeTab, setActiveTab] = useState('content');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">⌛</div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl font-semibold">Lesson not found</h2>
      </div>
    );
  }

  const handleSubmitAssignment = async (data: FormData) => {
    await submitAssignment(data);
  };

  return (
    <ProtectedRoute>
      <div className="container py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{lesson.title}</h1>
            <p className="text-muted-foreground">{lesson.description}</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="content">Content</TabsTrigger>
              {lesson.type === 'ASSIGNMENT' && (
                <>
                  {user?.role === 'STUDENT' && (
                    <TabsTrigger value="submit">Submit Assignment</TabsTrigger>
                  )}
                  {user?.role === 'INSTRUCTOR' && (
                    <TabsTrigger value="submissions">View Submissions</TabsTrigger>
                  )}
                </>
              )}
            </TabsList>

            <TabsContent value="content">
              <Card>
                <CardHeader>
                  <CardTitle>Lesson Content</CardTitle>
                </CardHeader>
                <CardContent>
                  {lesson.type === 'VIDEO' && lesson.videoUrl && (
                    <VideoPlayer
                      url={lesson.videoUrl}
                      onComplete={() => {
                        // Handle video completion
                      }}
                    />
                  )}
                  {lesson.content && (
                    <div className="mt-4 prose max-w-none">
                      {lesson.content}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {lesson.type === 'ASSIGNMENT' && user?.role === 'STUDENT' && (
              <TabsContent value="submit">
                <AssignmentSubmission
                  courseId={lesson.courseId}
                  lessonId={lesson.id}
                  assignmentTitle={lesson.title}
                  dueDate={lesson.dueDate}
                  onSubmit={handleSubmitAssignment}
                />
              </TabsContent>
            )}

            {lesson.type === 'ASSIGNMENT' && user?.role === 'INSTRUCTOR' && (
              <TabsContent value="submissions">
                <LessonSubmissions lessonId={lesson.id} />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
} 