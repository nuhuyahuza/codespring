import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { CourseActions } from './CourseActions';

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description: string;
    price?: number;
    imageUrl?: string;
    instructor: {
      id: string;
      name: string;
    };
    _count?: {
      enrollments: number;
    };
  };
}

export function CourseCard({ course }: CourseCardProps) {
  // Query to check enrollment status
  const { data: enrollmentStatus } = useQuery({
    queryKey: ['enrollmentStatus', course.id],
    queryFn: async () => {
      const response = await api.get(`/student/courses/${course.id}/enrollment-status`) as { data: { isEnrolled: boolean } };
      return response.data;
    },
    // Only fetch if user is authenticated (handled by api interceptor)
  });

  return (
    <div className="group relative rounded-lg border p-4 hover:shadow-md transition-shadow">
      {course.imageUrl && (
        <div className="aspect-video w-full overflow-hidden rounded-md">
          <img
            src={course.imageUrl}
            alt={course.title}
            className="h-full w-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/course-placeholder.jpg';
            }}
          />
        </div>
      )}
      <div className="mt-4">
        <h3 className="text-lg font-semibold">{course.title}</h3>
        <p className="text-sm text-muted-foreground">
          by {course.instructor.name}
        </p>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {course.description}
        </p>
        {course._count && (
          <p className="mt-1 text-sm text-muted-foreground">
            {course._count.enrollments} student{course._count.enrollments !== 1 ? 's' : ''}
          </p>
        )}
        <div className="mt-4">
          <CourseActions
            courseId={course.id}
            instructorId={course.instructor.id}
            price={course.price || 0}
            isEnrolled={enrollmentStatus?.isEnrolled}
          />
        </div>
      </div>
    </div>
  );
} 