import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CourseCard } from "@/components/courses/course-card";
import { Spinner } from "@/components/ui/spinner";

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  instructor: {
    name: string;
  };
}

export function CoursesPage() {
  const {
    data: courses,
    isLoading,
    error,
  } = useQuery<Course[]>({
    queryKey: ["courses"],
    queryFn: async () => {
      const response = await fetch("http://localhost:5000/api/courses");
      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-lg bg-red-50 p-4 text-red-500"
        >
          <p>Error loading courses. Please try again later.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-3xl font-bold"
      >
        Available Courses
      </motion.h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses?.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
} 