import { CourseCard } from './CourseCard';

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  difficulty: string;
  tags: string[];
  thumbnail: string | null;
  instructor: {
    name: string;
  };
}

interface CourseGridProps {
  courses: Course[];
  onEnroll?: (courseId: string) => void;
}

export function CourseGrid({ courses, onEnroll }: CourseGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          onEnroll={() => onEnroll?.(course.id)}
        />
      ))}
    </div>
  );
} 