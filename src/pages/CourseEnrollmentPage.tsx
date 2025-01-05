import { useParams } from 'react-router-dom';
import { EnrollmentForm } from '@/features/courses/components/EnrollmentForm';
import { useCourse } from '@/features/courses/hooks/useCourse';

export function CourseEnrollmentPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const { course, isLoading, error } = useCourse(courseId!);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">⌛</div>
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
    <div className="container max-w-2xl py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
          <p className="text-muted-foreground mt-2">
            Complete your enrollment
          </p>
        </div>
        <EnrollmentForm course={course} />
      </div>
    </div>
  );
} 