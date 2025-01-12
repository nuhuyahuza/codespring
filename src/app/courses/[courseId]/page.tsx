import { CourseDetails } from '@/features/courses/components/CourseDetails';

export default function CoursePage({ params }: { params: { courseId: string } }) {
  return (
    <div className="container py-8">
      <CourseDetails courseId={params.courseId} />
    </div>
  );
} 