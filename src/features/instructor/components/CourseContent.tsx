import { Course } from '@/types/course';
import { CourseContentEditor } from './CourseContentEditor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface CourseContentProps {
  course: Course;
}

export function CourseContent({ course }: CourseContentProps) {
  const hasNoContent = course.sections.length === 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Course Content</h2>
        <p className="text-muted-foreground">
          Organize your course content into sections and lessons. Drag and drop to
          reorder.
        </p>
      </div>

      {hasNoContent && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Your course has no content yet. Add sections and lessons to get
            started.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Course Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <CourseContentEditor courseId={course.id} />
        </CardContent>
      </Card>
    </div>
  );
} 