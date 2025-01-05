import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CourseContent } from '@/features/instructor/components/CourseContent';
import { CourseSettings } from '@/features/instructor/components/CourseSettings';
import { CoursePreview } from '@/features/instructor/components/CoursePreview';
import { useEditCourse } from '@/features/instructor/hooks/useEditCourse';
import { Button } from '@/components/ui/button';
import { Eye, Settings, BookOpen } from 'lucide-react';

export function EditCoursePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const [activeTab, setActiveTab] = useState('content');
  const { course, isLoading, error, publishCourse } = useEditCourse(courseId!);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">⌛</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl font-semibold text-destructive">Error loading course</h2>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl font-semibold">Course not found</h2>
      </div>
    );
  }

  const handlePublish = async () => {
    try {
      await publishCourse();
    } catch (err) {
      console.error('Failed to publish course:', err);
    }
  };

  return (
    <ProtectedRoute requiredRole="INSTRUCTOR">
      <div className="container py-8">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
              <p className="text-muted-foreground">
                {course.status === 'DRAFT' ? 'Draft' : 'Published'} • Last updated{' '}
                {new Date(course.updatedAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex gap-2">
              {course.status === 'DRAFT' && (
                <Button onClick={handlePublish}>Publish Course</Button>
              )}
              <Button variant="outline" asChild>
                <a href={`/courses/${courseId}`} target="_blank" rel="noopener noreferrer">
                  Preview
                </a>
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full border-b rounded-none">
                  <TabsTrigger value="content" className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Content
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Preview
                  </TabsTrigger>
                </TabsList>

                <div className="p-6">
                  <TabsContent value="content">
                    <CourseContent course={course} />
                  </TabsContent>

                  <TabsContent value="settings">
                    <CourseSettings course={course} />
                  </TabsContent>

                  <TabsContent value="preview">
                    <CoursePreview course={course} />
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
} 