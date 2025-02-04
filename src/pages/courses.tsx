import { useQuery } from "@tanstack/react-query";
import { CourseList } from '@/components/courses/CourseList';
import { Loader } from '@/components/ui/loader';

interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  instructor: {
    name: string;
  };
  price: number;
}

export default function CoursesPage() {
  const { data: courses, isLoading } = useQuery<Course[]>({
    queryKey: ["courses"],
    queryFn: async () => {
      const response = await fetch('http://localhost:5000/api/courses');
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Available Courses</h1>
        <CourseList courses={courses || []} />
      </div>
    </div>
  );
} 