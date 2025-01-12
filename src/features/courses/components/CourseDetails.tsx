import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  instructor: {
    id: string;
    name: string;
  };
  _count: {
    enrolled: number;
    lessons: number;
  };
  lessonPreviews: string[];
}

interface CourseProgress {
  completedLessons: string[];
  totalProgress: number;
  totalTimeSpent: number;
  currentLesson: string | null;
}

interface CourseContent {
  id: string;
  title: string;
  instructor: {
    id: string;
    name: string;
  };
  lessons: {
    id: string;
    title: string;
    order: number;
    isPreview?: boolean;
    completed?: boolean;
    timeSpent?: number;
  }[];
  isEnrolled: boolean;
}

export function CourseDetails({ courseId }: { courseId: string }) {
  const { user, token } = useAuth();

  // Only fetch basic course info initially
  const { data: course, isLoading } = useQuery<Course>({
    queryKey: ['course', courseId],
    queryFn: () => api.get(`/courses/${courseId}`),
  });

  // Only fetch enrollment status if user is logged in
  const { data: enrollment } = useQuery({
    queryKey: ['enrollment', courseId],
    queryFn: () => api.get(`/courses/${courseId}/enrollment`, token),
    enabled: !!user && !!token,
    retry: false,
  });

  if (isLoading) return <div>Loading...</div>;
  if (!course) return <div>Course not found</div>;

  const isEnrolled = !!enrollment?.isEnrolled;
  const isInstructor = user?.id === course.instructor.id;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{course.title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            by {course.instructor.name}
          </p>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{course.description}</p>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <h4 className="font-semibold">Price</h4>
              <p>${course.price}</p>
            </div>
            <div>
              <h4 className="font-semibold">Lessons</h4>
              <p>{course._count.lessons} lessons</p>
            </div>
            <div>
              <h4 className="font-semibold">Students</h4>
              <p>{course._count.enrolled} enrolled</p>
            </div>
          </div>

          {/* Action Button */}
          {user ? (
            isEnrolled ? (
              <Button className="w-full" onClick={() => window.location.href = `/courses/${courseId}/learn`}>
                Continue Learning
              </Button>
            ) : (
              <Button className="w-full" onClick={() => window.location.href = `/courses/${courseId}/enroll`}>
                Enroll Now for ${course.price}
              </Button>
            )
          ) : (
            <div className="space-y-4">
              <Button className="w-full" onClick={() => window.location.href = '/login'}>
                Sign in to Enroll
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Don't have an account? <a href="/signup" className="text-primary hover:underline">Sign up</a>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Course Content Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Course Content</CardTitle>
          <p className="text-sm text-muted-foreground">Preview available lessons</p>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {course.lessonPreviews.map((title, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="text-muted-foreground">
                  {index < 3 ? '📚' : '🔒'}
                </span>
                {title}
                {index < 3 && (
                  <span className="text-xs text-muted-foreground ml-2">(Preview)</span>
                )}
              </li>
            ))}
          </ul>
          {!isEnrolled && (
            <p className="text-sm text-muted-foreground mt-4">
              Enroll to access all {course._count.lessons} lessons
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 